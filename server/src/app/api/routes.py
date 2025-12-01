"""
API routes for the application
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Header
from fastapi.responses import JSONResponse
from .models import (
    UserCredentials, LoginCredentials, Document, BookStatus,
    DocumentMetadata, DocumentUploader, DocumentModeration,
    DocumentMarkdown, ApprovalProcess
)
from ..infra.ocr import process_pdf
from ..infra.config import config
from ..domain.services import AuthService
from ..domain.image_generator import PreviewImageGenerator
from ..infra.repositories import user_repository, document_repository
from datetime import datetime, timedelta
from typing import Optional, Dict
import jwt

router = APIRouter(prefix="/api", tags=["api"])


# ==================== Helper Functions ====================

async def verify_admin_token(authorization: Optional[str]) -> Dict:
    """
    Verify JWT token and check if user is admin

    Args:
        authorization: Authorization header with Bearer token

    Returns:
        User data from token

    Raises:
        HTTPException: If token is invalid or user is not admin
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Token d'authentification manquant."
        )

    # Extract token from "Bearer <token>"
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Schéma d'authentification invalide. Utilisez 'Bearer <token>'."
            )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Format d'autorisation invalide."
        )

    # Verify token
    try:
        payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("username")

        if not username:
            raise HTTPException(
                status_code=401,
                detail="Token invalide."
            )

        # Get user record to check account type
        user_record = await user_repository.get_user_record(username)

        if not user_record:
            raise HTTPException(
                status_code=401,
                detail="Utilisateur introuvable."
            )

        if user_record.get("account_type") != "ADMIN":
            raise HTTPException(
                status_code=403,
                detail="Accès refusé. Droits d'administrateur requis."
            )

        return user_record

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=401,
            detail="Token expiré."
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Token invalide."
        )


# ==================== Upload Endpoint ====================

@router.post("/send-book")
async def send_book(
        file: UploadFile = File(...),
        title: Optional[str] = None,
        author: Optional[str] = None,
        username: Optional[str] = Header(None)
):
    """
    Upload and process a PDF file with OCR, then create a document

    Args:
        file: The PDF file to process
        title: Optional title of the document
        author: Optional author of the document
        username: Username of the uploader, if known.

    Returns:
        JSON response with OCR results, document ID, and processing details
    """

    # Validate content type
    if file.content_type not in config.ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Type de fichier non supporté. Veuillez envoyer un PDF."
        )

    # Read and enforce size limit
    data = await file.read()
    if len(data) > config.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Fichier trop volumineux. Taille maximale : 200 Mo."
        )

    try:
        filename = file.filename or "uploaded.pdf"

        # Process PDF - retourne déjà toutes les analyses (metadata, security, content, markdown)
        ocr_result = process_pdf(filename, data)

        # Sauvegarder le résultat complet
        with open(config.get_ocr_result_path(), "w", encoding="utf-8") as f:
            f.write(str(ocr_result))

        # Extraire les données retournées par process_pdf
        extracted_metadata = ocr_result.get("metadata", {})
        security_analysis = ocr_result.get("security_analysis", {})
        content_analysis = ocr_result.get("content_analysis", {})
        markdown_content = ocr_result.get("markdown", "")

        current_date = datetime.now().isoformat()

        # Normaliser les métadonnées pour le modèle Pydantic
        # L'auteur peut être une liste, on la convertit en string
        metadata_author = extracted_metadata.get("author")
        if isinstance(metadata_author, list):
            metadata_author = ", ".join(metadata_author) if metadata_author else "Inconnu"
        elif not metadata_author:
            metadata_author = "Inconnu"

        # La date de parution peut être None ou un entier, la convertir en string
        parution_date_raw = extracted_metadata.get("date") or extracted_metadata.get("parution_date")
        parution_date = str(parution_date_raw) if parution_date_raw else ""

        # Utiliser le titre et l'auteur détectés par l'IA, avec fallback sur les paramètres
        doc_title = title or extracted_metadata.get("title") or filename
        doc_author = author or metadata_author

        # Générer l'image de prévisualisation et le texte de preview
        preview_text, cover_image = PreviewImageGenerator.generate_from_markdown(
            markdown_content=markdown_content,
            title=doc_title,
            author=doc_author
        )

        # Vérifier si le document est conforme (pas de problème de sécurité ou de contenu)
        is_compliant = True
        compliance_issues = []

        # Vérifier l'analyse de sécurité
        if security_analysis.get("has_security_prompts", True):
            is_compliant = False
            compliance_issues.append("Injection de prompt détectée")
        elif content_analysis.get("is_appropriate", True):
            is_compliant = False
            compliance_issues.append("Contenu inapproprié détecté")

        # Create document with OCR data using a proper nested structure
        document = Document(
            metadata=DocumentMetadata(
                title=doc_title,
                author=doc_author,
                parution_date=parution_date,
                is_appropriate=str(content_analysis.get("is_appropriate", True)),
                is_harmful=not content_analysis.get("is_appropriate", True)
            ),
            uploader=DocumentUploader(
                username=username or "anonymous",
                upload_date=current_date
            ),
            moderation=DocumentModeration(
                approval_process=ApprovalProcess(
                    status=BookStatus.WAITING,
                    date=current_date,
                    details="; ".join(compliance_issues) if not is_compliant else ""
                ),
                approved_by=[]
            ),
            markdown=DocumentMarkdown(
                content=markdown_content
            ),
            preview=preview_text,
            cover_image=cover_image
        )

        document_data = document.model_dump()

        # Ajouter les analyses de sécurité et de contenu au document
        document_data["security_analysis"] = security_analysis
        document_data["content_analysis"] = content_analysis
        document_data["compliance_issues"] = compliance_issues

        # Si le document n'est pas conforme, le placer en quarantaine
        if not is_compliant:
            document_id = await document_repository.add_document_to_quarantine(document_data)
            quarantine_status = "quarantined"
        else:
            document_id = await document_repository.add_document(document_data)
            quarantine_status = "approved"

        # Prepare detailed response for frontend
        # Normaliser les métadonnées pour le frontend
        normalized_metadata = {
            "title": doc_title,
            "author": doc_author,
            "date": parution_date,
            "publisher": extracted_metadata.get("publisher", "Non spécifié"),
            "description": extracted_metadata.get("description", f"Document uploadé par {username or 'anonymous'}")
        }

        return JSONResponse(content={
            "success": True,
            "message": "Document traité avec succès." if is_compliant else "Document placé en quarantaine pour révision administrative.",
            "document_id": document_id,
            "quarantine_status": quarantine_status,
            "is_compliant": is_compliant,
            "compliance_issues": compliance_issues,
            "document": {
                "title": doc_title,
                "author": doc_author,
                "uploader": username or "anonymous",
                "upload_date": current_date,
                "status": BookStatus.WAITING.value,
                "in_quarantine": not is_compliant
            },
            "preview": markdown_content[:200],
            "metadata": normalized_metadata,
            "security_analysis": security_analysis,
            "content_analysis": content_analysis,
            "markdown": markdown_content,
            "ocr": ocr_result.get("ocr", {}),
            "processing_info": ocr_result.get("processing_info", {})
        })
    except Exception as e:
        # Map general errors to 500
        raise HTTPException(
            status_code=500,
            detail=f"Échec du traitement OCR ou de la création du document : {e}"
        )


@router.post("/register")
async def register_user(user_credentials: UserCredentials):
    """
    Register a new user

    Args:
        user_credentials: Username, password, and email

    Returns:
        JSON response with registration confirmation
    """
    # Check if a user already exists
    if await user_repository.user_exists(user_credentials.username):
        raise HTTPException(
            status_code=400,
            detail="Le nom d'utilisateur existe déjà."
        )

    # Hash the password with salt
    password_hash, salt = AuthService.hash_password(user_credentials.password)

    # Encrypt sensitive data
    encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)

    # Final user record
    user_record = {
        "username": user_credentials.username,
        "email": user_credentials.email,
        "account_type": "USER",
        "encrypted_auth": encrypted_auth
    }

    # Store user data
    try:
        await user_repository.add_user(user_record)

        return JSONResponse(content={
            "message": "Utilisateur enregistré avec succès.",
            "username": user_credentials.username
        })
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de l'enregistrement de l'utilisateur : {str(e)}"
        )


@router.post("/login")
async def login_user(login_credentials: LoginCredentials):
    """
    Authenticate a user

    Args:
        login_credentials: Username and password

    Returns:
        JSON response with login confirmation and user data
    """
    # Find user
    user_record = await user_repository.get_user_record(login_credentials.username)

    if not user_record:
        raise HTTPException(
            status_code=401,
            detail="Pseudonyme ou mot de passe incorrect."
        )

    # Decrypt and verify password
    try:
        auth_data = AuthService.decrypt_auth_data(user_record["encrypted_auth"])

        if not AuthService.verify_password(
            login_credentials.password,
            auth_data["password_hash"],
            auth_data["salt"]
        ):
            raise HTTPException(
                status_code=401,
                detail="Pseudonyme ou mot de passe incorrect."
            )

        secret_key = config.JWT_SECRET_KEY
        expiration = datetime.now() + timedelta(hours=1)
        token = jwt.encode(
        {
            "username": user_record["username"].lower(),
            "email": user_record["email"],
            "exp": expiration
        },
        secret_key,
        algorithm="HS256"
    )
        return JSONResponse(content={
            "message": "Vous êtes connecté !",
            "username": user_record["username"],
            "email": user_record["email"],
            "account_type": user_record["account_type"],
            "token": token
        })

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur interne lors de l'authentification : {str(e)}"
        )


# ==================== Document Endpoints ====================

@router.post("/documents")
async def create_document(document: Document):
    """
    Create a new document

    Args:
        document: The document data to create

    Returns:
        JSON response with the created document ID
    """
    try:
        document_data = document.model_dump()
        document_id = await document_repository.add_document(document_data)

        return JSONResponse(content={
            "message": "Document créé avec succès.",
            "document_id": document_id
        }, status_code=201)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la création du document : {str(e)}"
        )


@router.get("/documents/{document_id}")
async def get_document(document_id: str):
    """
    Get a document by its ID

    Args:
        document_id: The ID of the document to retrieve

    Returns:
        JSON response with the document data
    """
    document = await document_repository.get_document(document_id)

    if not document:
        raise HTTPException(
            status_code=404,
            detail="Document introuvable."
        )

    return JSONResponse(content=document)


@router.get("/documents")
async def get_all_documents():
    """
    Get all documents

    Returns:
        JSON response with list of all documents
    """
    try:
        documents = await document_repository.get_all_documents()
        return JSONResponse(content={
            "count": len(documents),
            "documents": documents
        })
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la récupération des documents : {str(e)}"
        )


@router.get("/documents/status/{status}")
async def get_documents_by_status(status: BookStatus):
    """
    Get documents filtered by moderation status

    Args:
        status: The moderation status to filter by (WAITING, IN_APPROVAL, OK, NOK)

    Returns:
        JSON response with list of documents matching the status
    """
    try:
        documents = await document_repository.get_documents_by_status(status.value)
        return JSONResponse(content={
            "status": status.value,
            "count": len(documents),
            "documents": documents
        })
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la récupération des documents par statut : {str(e)}"
        )


@router.get("/documents/uploader/{username}")
async def get_documents_by_uploader(username: str):
    """
    Get documents uploaded by a specific user

    Args:
        username: The username of the uploader

    Returns:
        JSON response with list of documents uploaded by the user
    """
    try:
        documents = await document_repository.get_documents_by_uploader(username)
        return JSONResponse(content={
            "uploader": username,
            "count": len(documents),
            "documents": documents
        })
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la récupération des documents par utilisateur : {str(e)}"
        )


@router.put("/documents/{document_id}")
async def update_document(document_id: str, updates: Dict):
    """
    Update a document by its ID

    Args:
        document_id: The ID of the document to update
        updates: Dictionary of fields to update

    Returns:
        JSON response with update confirmation
    """
    try:
        success = await document_repository.update_document(document_id, updates)

        if not success:
            raise HTTPException(
                status_code=404,
                detail="Document introuvable."
            )

        return JSONResponse(content={
            "message": "Document mis à jour avec succès.",
            "document_id": document_id
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la mise à jour du document : {str(e)}"
        )


@router.delete("/documents/{document_id}")
async def delete_document(document_id: str):
    """
    Delete a document by its ID

    Args:
        document_id: The ID of the document to delete

    Returns:
        JSON response with deletion confirmation
    """
    try:
        success = await document_repository.delete_document(document_id)

        if not success:
            raise HTTPException(
                status_code=404,
                detail="Document introuvable."
            )

        return JSONResponse(content={
            "message": "Document supprimé avec succès.",
            "document_id": document_id
        })
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la suppression du document : {str(e)}"
        )


@router.get("/documents/search")
async def search_documents(
    title: Optional[str] = Query(None, description="Titre à rechercher"),
    author: Optional[str] = Query(None, description="Auteur à rechercher")
):
    """
    Search documents by title and/or author

    Args:
        title: Optional title to search for
        author: Optional author to search for

    Returns:
        JSON response with list of matching documents
    """
    if not title and not author:
        raise HTTPException(
            status_code=400,
            detail="Au moins un critère de recherche (titre ou auteur) doit être fourni."
        )

    try:
        documents = await document_repository.search_documents(title=title, author=author)
        return JSONResponse(content={
            "search_criteria": {
                "title": title,
                "author": author
            },
            "count": len(documents),
            "documents": documents
        })
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la recherche de documents : {str(e)}"
        )


# ==================== Quarantine Endpoints (Admin Only) ====================

@router.get("/admin/quarantine")
async def get_quarantined_documents(authorization: Optional[str] = Header(None)):
    """
    Get all documents in quarantine (Admin only)

    Args:
        authorization: Authorization header with Bearer token

    Returns:
        JSON response with list of quarantined documents
    """
    # Verify admin token
    await verify_admin_token(authorization)

    try:
        quarantined_docs = await document_repository.get_all_quarantined_documents()
        return JSONResponse(content={
            "count": len(quarantined_docs),
            "documents": quarantined_docs
        })
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la récupération des documents en quarantaine : {str(e)}"
        )


@router.get("/admin/quarantine/{document_id}")
async def get_quarantined_document(
    document_id: str,
    authorization: Optional[str] = Header(None)
):
    """
    Get a specific quarantined document by ID (Admin only)

    Args:
        document_id: The ID of the document to retrieve
        authorization: Authorization header with Bearer token

    Returns:
        JSON response with the quarantined document data
    """
    # Verify admin token
    await verify_admin_token(authorization)

    try:
        document = await document_repository.get_quarantined_document(document_id)

        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document en quarantaine introuvable."
            )

        return JSONResponse(content=document)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la récupération du document en quarantaine : {str(e)}"
        )


@router.post("/admin/quarantine/{document_id}/moderate")
async def moderate_quarantined_document(
    document_id: str,
    action: str = Query(..., description="Action à effectuer : 'approve' ou 'reject'"),
    authorization: Optional[str] = Header(None)
):
    """
    Moderate a quarantined document (Admin only)
    - approve: Move document from quarantine to approved documents
    - reject: Delete document from quarantine

    Args:
        document_id: The ID of the document to moderate
        action: Action to perform ('approve' or 'reject')
        authorization: Authorization header with Bearer token

    Returns:
        JSON response with moderation result
    """
    # Verify admin token
    user_record = await verify_admin_token(authorization)

    if action not in ["approve", "reject"]:
        raise HTTPException(
            status_code=400,
            detail="Action invalide. Utilisez 'approve' ou 'reject'."
        )

    try:
        # Check if document exists in quarantine
        document = await document_repository.get_quarantined_document(document_id)
        if not document:
            raise HTTPException(
                status_code=404,
                detail="Document en quarantaine introuvable."
            )

        if action == "approve":
            # Move from quarantine to approved documents
            success = await document_repository.move_from_quarantine_to_approved(document_id)

            if not success:
                raise HTTPException(
                    status_code=500,
                    detail="Échec du déplacement du document vers les documents approuvés."
                )

            return JSONResponse(content={
                "message": "Document approuvé et déplacé vers les documents normaux.",
                "document_id": document_id,
                "action": "approved",
                "moderated_by": user_record["username"]
            })

        elif action == "reject":
            # Delete from quarantine
            success = await document_repository.delete_quarantined_document(document_id)

            if not success:
                raise HTTPException(
                    status_code=500,
                    detail="Échec de la suppression du document en quarantaine."
                )

            return JSONResponse(content={
                "message": "Document rejeté et supprimé de la base de données.",
                "document_id": document_id,
                "action": "rejected",
                "moderated_by": user_record["username"]
            })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la modération du document : {str(e)}"
        )


