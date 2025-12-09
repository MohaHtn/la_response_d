"""
Upload router - Legacy endpoint for send-book
Handles PDF upload and OCR processing
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Header
from fastapi.responses import JSONResponse
from ...infra.ocr import process_pdf
from ...infra.config import config
from ...domain.image_generator import PreviewImageGenerator
from ...infra.repositories import document_repository
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/api", tags=["upload"])


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
    from ...domain.services import DocumentProcessingService, FileValidationService

    try:
        # 1. Valider et lire le fichier
        data, filename = await FileValidationService.validate_and_read_file(
            file,
            config.ALLOWED_CONTENT_TYPES,
            config.MAX_FILE_SIZE_BYTES
        )

        # 2. Traiter le PDF avec OCR
        ocr_result = process_pdf(filename, data)

        # Sauvegarder le résultat OCR
        with open(config.get_ocr_result_path(), "w", encoding="utf-8") as f:
            f.write(str(ocr_result))

        # 3. Extraire les données de l'OCR
        extracted_metadata = ocr_result.get("metadata", {})
        security_analysis = ocr_result.get("security_analysis", {})
        content_analysis = ocr_result.get("content_analysis", {})
        markdown_content = ocr_result.get("markdown", "")

        # 4. Normaliser les métadonnées
        metadata_author, parution_date = DocumentProcessingService.normalize_metadata(
            extracted_metadata
        )

        # 5. Déterminer le titre et l'auteur finaux
        doc_title = title or extracted_metadata.get("title") or filename
        doc_author = author or metadata_author

        # 6. Générer la prévisualisation
        preview_text, cover_image = PreviewImageGenerator.generate_from_markdown(
            markdown_content=markdown_content,
            title=doc_title,
            author=doc_author
        )

        # 7. Vérifier la conformité
        is_compliant, compliance_issues = DocumentProcessingService.determine_compliance(
            security_analysis,
            content_analysis
        )

        # 8. Créer le modèle Document
        document = DocumentProcessingService.create_document_model(
            title=doc_title,
            author=doc_author,
            parution_date=parution_date,
            username=username,
            markdown_content=markdown_content,
            content_analysis=content_analysis,
            is_compliant=is_compliant,
            compliance_issues=compliance_issues,
            preview_text=preview_text,
            cover_image=cover_image
        )

        # 9. Enrichir avec les analyses
        document_data = DocumentProcessingService.enrich_document_data(
            document.model_dump(),
            security_analysis,
            content_analysis,
            compliance_issues
        )

        # 10. Sauvegarder le document
        if not is_compliant:
            document_id = await document_repository.add_document_to_quarantine(document_data)
        else:
            document_id = await document_repository.add_document(document_data)

        # 11. Préparer les métadonnées pour la réponse
        normalized_metadata = DocumentProcessingService.prepare_response_metadata(
            extracted_metadata,
            doc_title,
            doc_author,
            parution_date,
            username
        )

        # 12. Construire la réponse complète
        response_content = DocumentProcessingService.build_success_response(
            is_compliant=is_compliant,
            document_id=document_id,
            title=doc_title,
            author=doc_author,
            username=username,
            current_date=datetime.now().isoformat(),
            compliance_issues=compliance_issues,
            markdown_content=markdown_content,
            normalized_metadata=normalized_metadata,
            security_analysis=security_analysis,
            content_analysis=content_analysis,
            ocr_result=ocr_result
        )

        return JSONResponse(content=response_content)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec du traitement OCR ou de la création du document : {e}"
        )

