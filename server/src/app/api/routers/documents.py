"""
Router pour la gestion des documents
"""
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Depends
from datetime import datetime
from ...domain.image_generator import PreviewImageGenerator
from ...infra.repositories import document_repository
from ...infra.config import config
from ...infra.ocr import process_pdf
from ..dependencies import get_current_user
from ..responses import APIResponse
from ..models import Document, DocumentMetadata, DocumentModeration, ApprovalProcess, DocumentUploader, DocumentMarkdown, BookStatus

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = None,
    author: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Upload et traitement d'un document PDF avec OCR

    Args:
        file: Fichier PDF à traiter
        title: Titre optionnel du document
        author: Auteur optionnel du document
        current_user: Utilisateur courant (injecté)

    Returns:
        Informations sur le document traité
    """
    # Valider le type de contenu
    if file.content_type not in config.ALLOWED_CONTENT_TYPES:
        return APIResponse.error(
            message="Type de fichier non supporté. Veuillez envoyer un PDF.",
            status_code=400
        )

    # Lire et vérifier la taille
    data = await file.read()
    if len(data) > config.MAX_FILE_SIZE_BYTES:
        return APIResponse.error(
            message=f"Fichier trop volumineux. Taille maximale : {config.MAX_FILE_SIZE_BYTES // (1024*1024)} Mo",
            status_code=413
        )

    try:
        filename = file.filename or "uploaded.pdf"

        # Traiter le PDF avec OCR
        # Note: process_pdf n'accepte pas le paramètre image_output_dir
        ocr_result = process_pdf(filename, data)

        # Extraire les données
        extracted_metadata = ocr_result.get("metadata", {})
        security_analysis = ocr_result.get("security_analysis", {})
        content_analysis = ocr_result.get("content_analysis", {})
        markdown_content = ocr_result.get("markdown", "")

        current_date = datetime.now().isoformat()

        # Normaliser les métadonnées
        metadata_author = extracted_metadata.get("author")
        if isinstance(metadata_author, list):
            metadata_author = ", ".join(metadata_author) if metadata_author else "Inconnu"
        elif not metadata_author:
            metadata_author = "Inconnu"

        parution_date_raw = extracted_metadata.get("date") or extracted_metadata.get("parution_date")
        parution_date = str(parution_date_raw) if parution_date_raw else "Date non disponible"

        doc_title = title or extracted_metadata.get("title") or filename
        doc_author = author or metadata_author

        # Générer l'image de prévisualisation
        preview_text, cover_image = PreviewImageGenerator.generate_from_markdown(
            markdown_content=markdown_content,
            title=doc_title,
            author=doc_author
        )

        # Vérifier la conformité
        is_compliant = True
        compliance_issues = []

        if security_analysis.get("has_security_prompts", False):
            is_compliant = False
            compliance_issues.append("Injection de prompt détectée")

        is_appropriate = content_analysis.get("is_appropriate", True)
        if not is_appropriate:
            is_compliant = False
            compliance_issues.append("Contenu inapproprié détecté")

        # Créer le document
        document = Document(
            metadata=DocumentMetadata(
                title=doc_title,
                author=doc_author,
                parution_date=parution_date,
                is_appropriate=is_appropriate,
                is_harmful=not is_appropriate,
                is_compliant=is_compliant
            ),
            uploader=DocumentUploader(
                username=current_user["username"],
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
            markdown=DocumentMarkdown(content=markdown_content),
            preview=preview_text,
            cover_image=cover_image
        )

        document_data = document.model_dump()
        document_data["security_analysis"] = security_analysis
        document_data["content_analysis"] = content_analysis
        document_data["compliance_issues"] = compliance_issues

        # Sauvegarder le document
        if not is_compliant:
            document_id = await document_repository.add_document_to_quarantine(document_data)
            status_message = "Document placé en quarantaine pour révision administrative."
        else:
            document_id = await document_repository.add_document(document_data)
            status_message = "Document traité avec succès. Aucune anomalie détectée par IA."

        return APIResponse.created(
            message=status_message,
            resource_id=document_id,
            data=document_data
        )

    except Exception as e:
        return APIResponse.error(
            message=f"Échec du traitement du document : {str(e)}",
            status_code=500
        )


@router.get("/{document_id}")
async def get_document(
    document_id: str,
):
    """
    Récupérer un document par son ID

    Args:
        document_id: ID du document
        current_user: Utilisateur courant (injecté)

    Returns:
        Données du document
    """
    document = await document_repository.get_document(document_id)

    if not document:
        return APIResponse.error(
            message="Document introuvable",
            status_code=404
        )

    return APIResponse.success(data=document)


@router.get("/")
async def list_documents(
        status: Optional[str] = None
):
    """
    Lister les documents

    Args:
        status: Filtrer par statut (optionnel)

    Returns:
        Liste des documents
    """
    documents = await document_repository.get_all_documents() or []

    if status:
        documents = [doc for doc in documents if doc.get("moderation", {}).get("approval_process", {}).get("status") == status]

    if not documents:
        return APIResponse.success(data=[], count=0, message="Aucun document trouvé")

    return APIResponse.success(data=documents, count=len(documents))


@router.get("/uploader/{username}")
async def get_documents_by_uploader(
    username: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Récupérer les documents d'un utilisateur spécifique

    Args:
        username: Nom d'utilisateur
        current_user: Utilisateur courant (injecté)

    Returns:
        Liste des documents de l'utilisateur
    """
    documents = await document_repository.get_documents_by_uploader(username)

    if not documents:
        return APIResponse.error(
            message=f"Aucun document trouvé pour l'utilisateur '{username}'",
            status_code=404
        )

    return APIResponse.success(
        data=documents,
        count=len(documents)
    )

