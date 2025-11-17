"""
API routes for the application
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import JSONResponse
from .models import UserCredentials, LoginCredentials, Document, BookStatus
from ..infra.ocr import process_pdf
from ..infra.config import config
from ..domain.services import AuthService
from ..infra.repositories import user_repository, document_repository
from datetime import datetime, timedelta
from typing import Optional, Dict
import jwt

router = APIRouter(prefix="/api", tags=["api"])

@router.post("/send-book")
async def send_book(file: UploadFile = File(...)):
    """
    Upload and process a PDF file with OCR

    Args:
        file: The PDF file to process

    Returns:
        JSON response with OCR results
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
        ocr = process_pdf(filename, data)
        with open(config.get_ocr_result_path(), "w", encoding="utf-8") as f:
            f.write(str(ocr))
    except Exception as e:
        # Map general errors to 500
        raise HTTPException(
            status_code=500,
            detail=f"Échec du traitement OCR : {e}"
        )

    return JSONResponse(content=ocr)


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


