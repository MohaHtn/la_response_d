"""
    return APIResponse.success(data=documents)

        documents = [doc for doc in documents if doc.get("moderation", {}).get("approval_process", {}).get("status") == status]
    if status:

    documents = await document_repository.get_all_documents()
    """
        Liste des documents
    Returns:

        status: Filtrer par statut (optionnel)
        current_user: Utilisateur courant (injecté)
    Args:

    Lister les documents
    """
):
    status: Optional[str] = None
    current_user: dict = Depends(get_current_user),
async def list_documents(
@router.get("/")


    return APIResponse.success(data=document)
    
        )
            status_code=404
            message="Document introuvable",
        return APIResponse.error(
    if not document:
    
    document = await document_repository.get_document(document_id)
    """
        Données du document
    Returns:

        current_user: Utilisateur courant (injecté)
        document_id: ID du document
    Args:

    Récupérer un document par son ID
    """
):
    current_user: dict = Depends(get_current_user)
    document_id: str,
async def get_document(
@router.get("/{document_id}")


        )
            status_code=500
            message=f"Échec du traitement du document : {str(e)}",
        return APIResponse.error(
    except Exception as e:
        
        )
            }
                "metadata": extracted_metadata
                "preview": preview_text,
                "compliance_issues": compliance_issues,
                "is_compliant": is_compliant,
                "status": "quarantined" if not is_compliant else "approved",
                "author": doc_author,
                "title": doc_title,
                "document_id": document_id,
            data={
            resource_id=document_id,
            message=status_message,
        return APIResponse.created(
        
            status_message = "Document traité avec succès"
            document_id = await document_repository.add_document(document_data)
        else:
            status_message = "Document placé en quarantaine pour révision administrative"
            document_id = await document_repository.add_document_to_quarantine(document_data)
        if not is_compliant:
        # Sauvegarder le document
        
        document_data["compliance_issues"] = compliance_issues
        document_data["content_analysis"] = content_analysis
        document_data["security_analysis"] = security_analysis
        document_data = document.model_dump()
        
        )
            cover_image=cover_image
            preview=preview_text,
            markdown=DocumentMarkdown(content=markdown_content),
            ),
                approved_by=[]
                ),
                    details="; ".join(compliance_issues) if not is_compliant else ""
                    date=current_date,
                    status=BookStatus.WAITING,
                approval_process=ApprovalProcess(
            moderation=DocumentModeration(
            ),
                upload_date=current_date
                username=current_user["username"],
            uploader=DocumentUploader(
            ),
                is_harmful=not is_appropriate
                is_appropriate=str(is_appropriate),
                parution_date=parution_date,
                author=doc_author,
                title=doc_title,
            metadata=DocumentMetadata(
        document = Document(
        # Créer le document
        
            compliance_issues.append("Contenu inapproprié détecté")
            is_compliant = False
        if not is_appropriate:
        is_appropriate = content_analysis.get("is_appropriate", True)
        
            compliance_issues.append("Injection de prompt détectée")
            is_compliant = False
        if security_analysis.get("has_security_prompts", False):
        
        compliance_issues = []
        is_compliant = True
        # Vérifier la conformité
        
        )
            author=doc_author
            title=doc_title,
            markdown_content=markdown_content,
        preview_text, cover_image = PreviewImageGenerator.generate_from_markdown(
        # Générer l'image de prévisualisation
        
        doc_author = author or metadata_author
        doc_title = title or extracted_metadata.get("title") or filename
        
        parution_date = str(parution_date_raw) if parution_date_raw else ""
        parution_date_raw = extracted_metadata.get("date") or extracted_metadata.get("parution_date")
        
            metadata_author = "Inconnu"
        elif not metadata_author:
            metadata_author = ", ".join(metadata_author) if metadata_author else "Inconnu"
        if isinstance(metadata_author, list):
        metadata_author = extracted_metadata.get("author")
        # Normaliser les métadonnées
        
        current_date = datetime.now().isoformat()
        
        markdown_content = ocr_result.get("markdown", "")
        content_analysis = ocr_result.get("content_analysis", {})
        security_analysis = ocr_result.get("security_analysis", {})
        extracted_metadata = ocr_result.get("metadata", {})
        # Extraire les données
        
        ocr_result = process_pdf(filename, data)
        # Traiter le PDF avec OCR
        
        filename = file.filename or "uploaded.pdf"
    try:
    
        )
            status_code=413
            message=f"Fichier trop volumineux. Taille maximale : {config.MAX_FILE_SIZE_BYTES // (1024*1024)} Mo",
        return APIResponse.error(
    if len(data) > config.MAX_FILE_SIZE_BYTES:
    data = await file.read()
    # Lire et vérifier la taille
    
        )
            status_code=400
            message="Type de fichier non supporté. Veuillez envoyer un PDF",
        return APIResponse.error(
    if file.content_type not in config.ALLOWED_CONTENT_TYPES:
    # Valider le type de contenu
    """
        Informations sur le document traité
    Returns:

        current_user: Utilisateur courant (injecté)
        author: Auteur optionnel du document
        title: Titre optionnel du document
        file: Fichier PDF à traiter
    Args:

    Upload et traitement d'un document PDF avec OCR
    """
):
    current_user: dict = Depends(get_current_user)
    author: Optional[str] = None,
    title: Optional[str] = None,
    file: UploadFile = File(...),
async def upload_document(
@router.post("/upload")


router = APIRouter(prefix="/documents", tags=["documents"])

from datetime import datetime
from ...domain.image_generator import PreviewImageGenerator
from ...infra.repositories import document_repository
from ...infra.config import config
from ...infra.ocr import process_pdf
from ..dependencies import get_current_user
from ..responses import APIResponse
from ..models import Document, DocumentMetadata, DocumentUploader, DocumentModeration, ApprovalProcess, BookStatus, DocumentMarkdown
from typing import Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Header, Depends
"""
Routes pour la gestion des documents

"""

@router.post("/documents")
async def create_document(
    document: Document,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new document

    Args:
        document: The document data to create
        current_user: Current user (injected)

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


@router.get("/documents")
async def get_all_documents(
    current_user: dict = Depends(get_current_user)
):
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
async def get_documents_by_status(
    status: BookStatus,
    current_user: dict = Depends(get_current_user)
):
    """
    Get documents filtered by moderation status

    Args:
        status: The moderation status to filter by (WAITING, IN_APPROVAL, OK, NOK)
        current_user: Current user (injected)

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
async def get_documents_by_uploader(
    username: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get documents uploaded by a specific user

    Args:
        username: The username of the uploader
        current_user: Current user (injected)

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


@router.get("/documents/search")
async def search_documents(
    title: Optional[str] = Query(None, description="Titre à rechercher"),
    author: Optional[str] = Query(None, description="Auteur à rechercher"),
    current_user: dict = Depends(get_current_user)
):
    """
    Search documents by title and/or author

    Args:
        title: Optional title to search for
        author: Optional author to search for
        current_user: Current user (injected)

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
