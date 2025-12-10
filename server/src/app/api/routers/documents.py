"""
Router pour la gestion des documents
"""
from typing import Optional, AsyncGenerator
from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import StreamingResponse
from datetime import datetime
from uuid import uuid4
import asyncio
import json

from ...domain.image_generator import PreviewImageGenerator
from ...infra.repositories import document_repository
from ...infra.config import config
from ...infra.ocr import process_pdf
from ...infra.database.redis_manager import redis_manager
from ..dependencies import get_current_user
from ..responses import APIResponse
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
    current_user: dict = Depends(get_current_user)
):
    """
    Upload d'un PDF et lancement asynchrone du traitement avec suivi temps réel (SSE)
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

    # Créer un job et démarrer une tâche asynchrone
    job_id = str(uuid4())
    _set_progress(job_id, status="queued", stage="init", progress=0)

    filename = file.filename or "uploaded.pdf"

    # Démarrer le traitement sans bloquer la réponse
    asyncio.create_task(
        _process_document_job_async(
            job_id=job_id,
            filename=filename,
            data=data,
            title=title,
            author=author,
            username=current_user["username"],
        )
    )

    # Répondre immédiatement avec 202 et le job_id
    return APIResponse.success(
        message="Traitement lancé",
        status_code=202,
        data={"job_id": job_id}
    )


async def _process_document_job_async(
    job_id: str,
    filename: str,
    data: bytes,
    title: Optional[str],
    author: Optional[str],
    username: str,
):
    try:
        _set_progress(job_id, status="processing", stage="ocr:start", progress=5)

        # Callback pour relayer la progression interne de process_pdf vers le SSE
        def _on_progress(stage: str, progress: int | None = None, **kwargs):
            payload = {"status": "processing", "stage": stage}
            if progress is not None:
                payload["progress"] = progress
            payload.update(kwargs)
            _set_progress(job_id, **payload)

        # Étape OCR (potentiellement longue) - exécuter hors de la boucle événementielle
        ocr_result = await asyncio.to_thread(
            process_pdf,
            filename,
            data,
            # include_image_base64 par défaut True
            on_progress=_on_progress,
        )

        _set_progress(job_id, status="processing", stage="ocr:done", progress=40)

        # Extraction des données issues de l'OCR
        _set_progress(job_id, status="processing", stage="extraction:start", progress=45)
        extracted_metadata = ocr_result.get("metadata", {})
        security_analysis = ocr_result.get("security_analysis", {})
        content_analysis = ocr_result.get("content_analysis", {})
        markdown_content = ocr_result.get("markdown", "")
        _set_progress(job_id, status="processing", stage="extraction:done", progress=50)

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
        _set_progress(job_id, status="processing", stage="security:start", progress=52)
        has_security_prompts = bool(security_analysis.get("has_security_prompts", False))
        _set_progress(job_id, status="processing", stage="security:done", progress=55, has_security_prompts=has_security_prompts)

        # Vérification du caractère approprié du contenu
        _set_progress(job_id, status="processing", stage="appropriateness:start", progress=57)
        is_appropriate = content_analysis.get("is_appropriate", True)
        _set_progress(job_id, status="processing", stage="appropriateness:done", progress=60, is_appropriate=is_appropriate)

        # Diffuser le markdown et les analyses au client avant les étapes de preview/persist
        _set_progress(
            job_id,
            status="processing",
            stage="deliver:markdown",
            progress=65,
            markdown=markdown_content,
            extracted_metadata=extracted_metadata,
            security_analysis=security_analysis,
            content_analysis=content_analysis,
        )

        _set_progress(job_id, status="processing", stage="preview", progress=75)
        # Générer l'image de prévisualisation
        preview_text, cover_image = PreviewImageGenerator.generate_from_markdown(
            markdown_content=markdown_content,
            title=doc_title,
            author=doc_author
        )

        # Vérifier la conformité
        _set_progress(job_id, status="processing", stage="compliance", progress=80)
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
        _set_progress(job_id, status="processing", stage="persist", progress=90)
        if not is_compliant:
            document_id = await document_repository.add_document_to_quarantine(document_data)
        else:
            document_id = await document_repository.add_document(document_data)

        # Nouvelle dernière étape: envoi de la réponse finale au client avant la complétion
        _set_progress(
            job_id,
            status="processing",
            stage="deliver:final",
            progress=98,
            document_id=document_id,
        )

        # Événement terminal (sans message utilisateur spécifique)
        _set_progress(job_id, status="done", stage="complete", progress=100, document_id=document_id)
    except Exception as e:
        _set_progress(job_id, status="error", stage="failed", progress=100, error=str(e))


@router.get("/status/stream/{job_id}")
async def stream_status(job_id: str) -> StreamingResponse:
    """
    SSE: diffuse l'état du job en temps réel jusqu'à completion/erreur.
    Cette route ne requiert pas d'auth header afin de permettre EventSource (qui ne supporte pas les headers).
    Assurez-vous que job_id n'est pas divulgué et est non devinable (UUID).
    """

    async def event_generator() -> AsyncGenerator[bytes, None]:
        history_index = 0
        max_iterations = 600  # Timeout de 10 minutes (600 * 1s)
        iterations = 0

        while iterations < max_iterations:
            iterations += 1
            # Récupérer toutes les nouvelles entrées depuis le dernier index
            new_entries, history_index = _get_progress_history(job_id, history_index)

            for entry in new_entries:
                payload = json.dumps(entry)
                yield f"data: {payload}\n\n".encode("utf-8")

                # Vérifier si c'est la fin
                if entry.get("status") in {"done", "error"}:
                    return

            # Heartbeat pour garder la connexion ouverte
            yield b": keep-alive\n\n"
            await asyncio.sleep(0.3)  # Poll plus fréquemment pour réduire la latence

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
        status: Optional[str] = None,
        uploader: Optional[str] = None,
):
    """
    Lister les documents

    Args:
        status: Filtrer par statut (optionnel)
        uploader: Filtrer par nom d'uploader (optionnel)

    Returns:
        Liste des documents
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

