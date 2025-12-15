"""
Router pour la gestion des documents
"""
from typing import Optional, AsyncGenerator
from fastapi import APIRouter, UploadFile, File, Depends, Request
from fastapi.responses import StreamingResponse
from datetime import datetime
from uuid import uuid4
import asyncio
import json
import os
import tempfile

from ...domain.image_generator import PreviewImageGenerator
from ...infra.repositories import document_repository
from ...infra.config import config
from ...infra.ocr import process_pdf
from ...infra.database.redis_manager import redis_manager
from ..dependencies import get_current_user
from ..responses import APIResponse
from ...infra.i18n import get_lang, translate
from ..models import Document, DocumentMetadata, DocumentModeration, ApprovalProcess, DocumentUploader, DocumentMarkdown, BookStatus

router = APIRouter(prefix="/documents", tags=["documents"])

# Progress tracking in Redis for background jobs
_JOB_KEY = "doc:job:{job_id}"
_JOB_HISTORY_KEY = "doc:job:history:{job_id}"
_JOB_HISTORY_INDEX_KEY = "doc:job:history_idx:{job_id}"

def _set_progress(job_id: str, **payload) -> None:
    """Stocke la progression actuelle ET l'ajoute à l'historique pour le SSE."""
    client = redis_manager.get_client()
    data = {"job_id": job_id, **payload}
    json_data = json.dumps(data)
    # État courant (pour compatibilité)
    client.set(_JOB_KEY.format(job_id=job_id), json_data, ex=60 * 60)
    # Historique : ajouter à une liste pour que le SSE puisse lire toutes les étapes
    client.rpush(_JOB_HISTORY_KEY.format(job_id=job_id), json_data)
    client.expire(_JOB_HISTORY_KEY.format(job_id=job_id), 60 * 60)


def _push_progress(job_id: str, lang: str, **payload) -> None:
    """Ajoute les libellés traduits à la progression puis stocke.

    Conserve les champs techniques `status` et `stage` pour compatibilité
    et ajoute `status_label`, `stage_label` ainsi que `lang`.
    """
    try:
        if "status" in payload:
            payload["status_label"] = translate(
                lang, f"sse.status.{payload['status']}", default=str(payload["status"]) or ""
            )
        if "stage" in payload:
            payload["stage_label"] = translate(
                lang, f"sse.stage.{payload['stage']}", default=str(payload["stage"]) or ""
            )
    except Exception:
        # En cas d'erreur de traduction, ne pas bloquer l'émission
        pass
    payload["lang"] = lang
    _set_progress(job_id, **payload)

def _clear_job(job_id: str) -> None:
    """Supprime les clés Redis associées à un job donné."""
    client = redis_manager.get_client()
    try:
        client.delete(_JOB_KEY.format(job_id=job_id))
        client.delete(_JOB_HISTORY_KEY.format(job_id=job_id))
        client.delete(_JOB_HISTORY_INDEX_KEY.format(job_id=job_id))
    except Exception:
        # Nettoyage best-effort: ignorer les erreurs de suppression
        pass

async def _cleanup_job_later(job_id: str, delay_seconds: float = 1.0) -> None:
    """Planifie la suppression des clés du job après un léger délai pour laisser
    le temps au SSE de livrer le dernier événement au client."""
    try:
        await asyncio.sleep(delay_seconds)
    finally:
        _clear_job(job_id)

def _get_progress(job_id: str) -> Optional[dict]:
    """Récupère l'état courant (pour usage ponctuel)."""
    client = redis_manager.get_client()
    raw = client.get(_JOB_KEY.format(job_id=job_id))
    return json.loads(raw) if raw else None

def _get_progress_history(job_id: str, from_index: int = 0) -> tuple[list[dict], int]:
    """
    Récupère l'historique des progressions depuis un index donné.
    Retourne (liste des nouvelles entrées, nouvel index).
    """
    client = redis_manager.get_client()
    history_key = _JOB_HISTORY_KEY.format(job_id=job_id)
    # Récupérer toutes les entrées depuis from_index
    entries = client.lrange(history_key, from_index, -1)
    new_entries = [json.loads(e) for e in entries] if entries else []
    new_index = from_index + len(new_entries)
    return new_entries, new_index


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: Optional[str] = None,
    author: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    request: Request = None,
):
    """
    Upload a PDF and start async processing with real-time tracking (SSE)
    """
    # Validate content type
    lang = get_lang(request) if request else "en"
    if file.content_type not in config.ALLOWED_CONTENT_TYPES:
        return APIResponse.error(
            message=translate(lang, "documents.unsupported_type", default="Unsupported file type. Please send a PDF."),
            status_code=400
        )

    # Write the file in chunks to disk and check size progressively
    max_size = config.MAX_FILE_SIZE_BYTES
    total = 0
    tmp_file_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp_file_path = tmp.name
            while True:
                chunk = await file.read(1024 * 1024)  # 1 MiB
                if not chunk:
                    break
                total += len(chunk)
                if total > max_size:
                    tmp.close()
                    os.remove(tmp_file_path)
                    return APIResponse.error(
                        message=translate(lang, "documents.file_too_large", default="File too large. Max size: {size} MB").format(size=(config.MAX_FILE_SIZE_BYTES // (1024*1024))),
                        status_code=413
                    )
                tmp.write(chunk)
    except Exception:
        if tmp_file_path and os.path.exists(tmp_file_path):
            try:
                os.remove(tmp_file_path)
            except Exception:
                pass
        raise

    # Create a job and start an async task
    job_id = str(uuid4())
    _push_progress(job_id, lang, status="queued", stage="init", progress=0)

    filename = file.filename or "uploaded.pdf"

    # Start processing without blocking the response
    asyncio.create_task(
        _process_document_job_async(
            job_id=job_id,
            filename=filename,
            file_path=tmp_file_path,
            title=title,
            author=author,
            username=current_user["username"],
            lang=lang,
        )
    )

    # Immediately respond with 202 and the job_id
    return APIResponse.success(
        message=translate(lang, "documents.processing_started", default="Processing started"),
        status_code=202,
        data={"job_id": job_id}
    )


async def _process_document_job_async(
    job_id: str,
    filename: str,
    file_path: str,
    title: Optional[str],
    author: Optional[str],
    username: str,
    lang: str,
):
    try:
        _push_progress(job_id, lang, status="processing", stage="ocr:start", progress=5)

        # Callback to relay internal progress from process_pdf to SSE
        def _on_progress(stage: str, progress: int | None = None, **kwargs):
            payload = {"status": "processing", "stage": stage}
            if progress is not None:
                payload["progress"] = progress
            payload.update(kwargs)
            _push_progress(job_id, lang, **payload)

        # OCR step (potentially long) - run out of the event loop
        ocr_result = await asyncio.to_thread(
            process_pdf,
            # utilisation d'arguments nommés pour éviter les erreurs d'ordre
            file_name=filename,
            file_path=file_path,
            on_progress=_on_progress,
            include_image_base64=True,
        )

        _push_progress(job_id, lang, status="processing", stage="ocr:done", progress=40)

        # Extract data from OCR output
        _push_progress(job_id, lang, status="processing", stage="extraction:start", progress=45)
        extracted_metadata = ocr_result.get("metadata", {})
        security_analysis = ocr_result.get("security_analysis", {})
        content_analysis = ocr_result.get("content_analysis", {})
        markdown_content = ocr_result.get("markdown", "")
        _push_progress(job_id, lang, status="processing", stage="extraction:done", progress=50)

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

        # Détection d'indices d'injection de prompt (sécurité)
        _push_progress(job_id, lang, status="processing", stage="security:start", progress=52)
        has_security_prompts = bool(security_analysis.get("has_security_prompts", False))
        _push_progress(job_id, lang, status="processing", stage="security:done", progress=55, has_security_prompts=has_security_prompts)

        # Vérification du caractère approprié du contenu
        _push_progress(job_id, lang, status="processing", stage="appropriateness:start", progress=57)
        is_appropriate = content_analysis.get("is_appropriate", True)
        _push_progress(job_id, lang, status="processing", stage="appropriateness:done", progress=60, is_appropriate=is_appropriate)

        # Diffuser une mise à jour légère (sans gros contenus)
        _push_progress(
            job_id,
            lang,
            status="processing",
            stage="deliver:markdown",
            progress=65,
            extracted_metadata={
                "title": extracted_metadata.get("title"),
                "author": extracted_metadata.get("author"),
                "date": extracted_metadata.get("date") or extracted_metadata.get("parution_date"),
            },
            has_security_prompts=bool(security_analysis.get("has_security_prompts", False)),
            is_appropriate=content_analysis.get("is_appropriate", True),
        )

        _push_progress(job_id, lang, status="processing", stage="preview", progress=75)
        # Générer l'image de prévisualisation
        preview_text, cover_image = PreviewImageGenerator.generate_from_markdown(
            markdown_content=markdown_content,
            title=doc_title,
            author=doc_author
        )

        # Vérifier la conformité
        _push_progress(job_id, lang, status="processing", stage="compliance", progress=80)
        is_compliant = True
        compliance_issues = []

        if has_security_prompts:
            is_compliant = False
            compliance_issues.append("Injection de prompt détectée")

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
                username=username,
                upload_date=current_date
            ),
            moderation=DocumentModeration(
                approval_process=ApprovalProcess(
                    status=BookStatus.OK if is_compliant else BookStatus.IN_APPROVAL,
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
        _push_progress(job_id, lang, status="processing", stage="persist", progress=90)
        if not is_compliant:
            document_id = await document_repository.add_document_to_quarantine(document_data)
        else:
            document_id = await document_repository.add_document(document_data)

        # New final step: send final response to client before completion
        _push_progress(
            job_id,
            lang,
            status="processing",
            stage="deliver:final",
            progress=98,
            document_id=document_id,
        )

        # Événement terminal (sans message utilisateur spécifique)
        _push_progress(job_id, lang, status="done", stage="complete", progress=100, document_id=document_id)
        # Schedule job cleanup in Redis after a short delay
        asyncio.create_task(_cleanup_job_later(job_id))
    except Exception as e:
        _push_progress(job_id, lang, status="error", stage="failed", progress=100, error=str(e))
        # Cleanup also on error
        asyncio.create_task(_cleanup_job_later(job_id))
    finally:
        # Temp file cleanup
        try:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
        except Exception:
            pass


@router.get("/status/stream/{job_id}")
async def stream_status(job_id: str) -> StreamingResponse:
    """
    SSE: stream job status in real time until completion/error.
    This route does not require auth headers to allow EventSource (which doesn't support custom headers).
    Make sure job_id is not disclosed and is unguessable (UUID).
    """

    async def event_generator() -> AsyncGenerator[bytes, None]:
        history_index = 0
        max_iterations = 600  # 10-minute timeout (600 * 1s)
        iterations = 0

        while iterations < max_iterations:
            iterations += 1
            # Fetch all new entries since last index
            new_entries, history_index = _get_progress_history(job_id, history_index)

            for entry in new_entries:
                payload = json.dumps(entry)
                yield f"data: {payload}\n\n".encode("utf-8")

                # Check if it's the end
                if entry.get("status") in {"done", "error"}:
                    return

            # Heartbeat to keep the connection alive
            yield b": keep-alive\n\n"
            await asyncio.sleep(0.3)  # Poll more frequently to reduce latency

    return StreamingResponse(event_generator(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no"  # utile avec certains reverse proxies
    })


@router.get("/{document_id}")
async def get_document(
    document_id: str,
):
    """
    Get a document by its ID

    Args:
        document_id: Document ID
        current_user: Current user (injected)

    Returns:
        Document data
    """
    document = await document_repository.get_document(document_id)

    # If not found in approved documents, check quarantine
    if not document:
        quarantined = await document_repository.get_quarantined_document(document_id)
        if quarantined:
            # Ensure the flag is properly set
            quarantined["in_quarantine"] = True
            return APIResponse.success(
                data=quarantined,
                message=translate("en", "documents.found_in_quarantine", default="Document found in quarantine")
            )

        return APIResponse.error(
            message=translate("en", "documents.not_found", default="Document not found"),
            status_code=404
        )

    return APIResponse.success(data=document)


@router.get("/")
async def list_documents(
        status: Optional[str] = None,
        uploader: Optional[str] = None,
):
    """
    List documents

    Args:
        status: Filter by status (optional)
        uploader: Filter by uploader username (optional)

    Returns:
        List of documents
    """
    documents = await document_repository.get_all_documents() or []

    if status:
        documents = [doc for doc in documents if doc.get("moderation", {}).get("approval_process", {}).get("status") == status]

    if uploader:
        documents = [doc for doc in documents if doc.get("uploader", {}).get("username") == uploader]

    # Trier par date d'upload décroissante si disponible
    def _parse_date(d: Optional[str]):
        try:
            return datetime.fromisoformat(d) if d else datetime.min
        except Exception:
            return datetime.min

    documents.sort(key=lambda d: _parse_date(d.get("uploader", {}).get("upload_date")), reverse=True)

    if not documents:
        return APIResponse.success(data=[], count=0, message=translate("en", "documents.none_found", default="No documents found"))

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

