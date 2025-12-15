"""
Moderation routes (admin/moderator)
"""
from fastapi import APIRouter, Depends, Query, HTTPException, Body, Request
from typing import List, Dict, Any
from starlette.responses import JSONResponse
from ..models import BookStatus
from ..responses import APIResponse
from ...infra.i18n import get_lang, translate
from ..dependencies import get_admin_user, get_moderator_user
from ...infra.repositories import document_repository

router = APIRouter(prefix="/moderation", tags=["moderation"])


@router.get("/quarantine")
async def get_quarantine_documents(
    admin_user: dict = Depends(get_admin_user),
    request: Request = None,
):
    """
    Get all documents in quarantine (admin only)

    Args:
        admin_user: Admin user (injected)

    Returns:
        List of quarantined documents
    """
    documents = await document_repository.get_all_quarantined_documents()

    return APIResponse.success(
        data=documents,
        count=len(documents)
    )


@router.get("/quarantine/{document_id}")
async def get_quarantine_document(
    document_id: str,
    moderator_user: dict = Depends(get_moderator_user),
    request: Request = None,
):
    """
    Get a quarantined document by ID (admin only)

    Args:
        document_id: Document ID
        admin_user: Admin user (injected)

    Returns:
        Quarantined document
    """
    document = await document_repository.get_quarantined_document(document_id)

    if not document:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.quarantine_not_found", default="Quarantined document not found"),
            status_code=404
        )

    return APIResponse.success(data=document)


@router.post("/quarantine/{document_id}/approve")
async def approve_quarantine_document(
    document_id: str,
    admin_user: dict = Depends(get_admin_user),
    request: Request = None,
):
    """
    Approve a quarantined document (admin only)

    Args:
        document_id: Document ID
        admin_user: Admin user (injected)

    Returns:
        Approval confirmation
    """
    document = await document_repository.get_quarantined_document(document_id)

    if not document:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.quarantine_not_found", default="Quarantined document not found"),
            status_code=404
        )

    # Move from quarantine to approved documents
    success = await document_repository.move_from_quarantine_to_approved(document_id)

    if not success:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.approval_error", default="Error while approving document"),
            status_code=500
        )

    lang = get_lang(request) if request else "en"
    return APIResponse.success(
        message=translate(lang, "moderation.approved_moved", default="Document approved and moved to the library"),
        data={"document_id": document_id}
    )


@router.post("/quarantine/{document_id}/reject")
async def reject_quarantine_document(
    document_id: str,
    admin_user: dict = Depends(get_admin_user),
    request: Request = None,
):
    """
    Reject a quarantined document (admin only)

    Args:
        document_id: Document ID
        admin_user: Admin user (injected)

    Returns:
        Rejection confirmation
    """
    success = await document_repository.delete_quarantine_document(document_id)

    if not success:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.not_found_or_delete_failed", default="Document not found or deletion failed"),
            status_code=404
        )

    lang = get_lang(request) if request else "en"
    return APIResponse.success(
        message=translate(lang, "moderation.rejected_deleted", default="Document rejected and deleted"),
        data={"document_id": document_id}
    )


@router.get("/pending")
async def get_pending_documents(
    moderator_user: dict = Depends(get_moderator_user),
    request: Request = None,
):
    """
    Get documents pending moderation

    Args:
        moderator_user: Moderator/Admin user (injected)

    Returns:
        List of pending documents
    """
    documents = await document_repository.get_all_documents()

    # Filtrer les documents en attente
    pending_documents = [
        doc for doc in documents
        if doc.get("moderation", {}).get("approval_process", {}).get("status") == BookStatus.WAITING.value
    ]

    return APIResponse.success(
        data=pending_documents,
        count=len(pending_documents)
    )


@router.post("/{document_id}/approve")
async def approve_document(
    document_id: str,
    moderator_user: dict = Depends(get_moderator_user),
    request: Request = None,
):
    """
    Approve a document (moderator/admin)

    Args:
        document_id: Document ID
        moderator_user: Moderator/Admin user (injected)

    Returns:
        Approval confirmation
    """
    document = await document_repository.get_document(document_id)

    if not document:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.doc_not_found", default="Document not found"),
            status_code=404
        )

    # Update status
    document["moderation"]["approval_process"]["status"] = BookStatus.OK.value
    document["moderation"]["approved_by"].append(moderator_user["username"])

    success = await document_repository.update_document(document_id, document)

    if not success:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.error_approval", default="Error during approval"),
            status_code=500
        )

    lang = get_lang(request) if request else "en"
    return APIResponse.success(
        message=translate(lang, "moderation.approved", default="Document approved"),
        data={"document_id": document_id}
    )


@router.post("/{document_id}/reject")
async def reject_document(
    document_id: str,
    moderator_user: dict = Depends(get_moderator_user),
    request: Request = None,
):
    """
    Reject a document (moderator/admin) and delete it

    Args:
        document_id: Document ID
        moderator_user: Moderator/Admin user (injected)

    Returns:
        Rejection confirmation (deleted)
    """
    document = await document_repository.get_document(document_id)

    if not document:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.doc_not_found", default="Document not found"),
            status_code=404
        )

    # Delete the document from normal storage
    success = await document_repository.delete_document(document_id)

    if not success:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.not_found_or_delete_failed", default="Document not found or deletion failed"),
            status_code=404
        )

    lang = get_lang(request) if request else "en"
    return APIResponse.success(
        message=translate(lang, "moderation.rejected_deleted", default="Document rejected and deleted"),
        data={
            "document_id": document_id,
            "rejected_by": moderator_user["username"]
        }
    )


@router.post("/quarantine/{document_id}/moderate")
async def moderate_quarantined_document(
    document_id: str,
    action: str = Query(..., description="Action to perform: 'approve' or 'reject'"),
    admin_user: dict = Depends(get_admin_user),
    request: Request = None,
):
    """
    Moderate a quarantined document (Admin only)
    - approve: Move document from quarantine to approved documents
    - reject: Delete document from quarantine

    Args:
        document_id: The ID of the document to moderate
        action: Action to perform ('approve' or 'reject')
        admin_user: Admin user (injected)

    Returns:
        JSON response with moderation result
    """
    lang = get_lang(request) if request else "en"
    if action not in ["approve", "reject"]:
        raise HTTPException(
            status_code=400,
            detail=translate(lang, "moderation.invalid_action", default="Invalid action. Use 'approve' or 'reject'.")
        )

    try:
        # Check if document exists in quarantine
        document = await document_repository.get_quarantined_document(document_id)
        if not document:
            raise HTTPException(
                status_code=404,
                detail=translate(lang, "moderation.quarantine_not_found", default="Quarantined document not found.")
            )

        if action == "approve":
            # Move from quarantine to approved documents
            success = await document_repository.move_from_quarantine_to_approved(document_id)

            if not success:
                raise HTTPException(
                    status_code=500,
                    detail=translate(lang, "moderation.failed_move", default="Failed to move document to approved documents.")
                )

            return JSONResponse(content={
                "message": translate(lang, "moderation.approved_moved", default="Document approved and moved to the library"),
                "document_id": document_id,
                "action": "approved",
                "moderated_by": admin_user["username"]
            })

        elif action == "reject":
            # Delete from quarantine
            success = await document_repository.delete_quarantined_document(document_id)

            if not success:
                raise HTTPException(
                    status_code=500,
                    detail=translate(lang, "moderation.failed_delete", default="Failed to delete quarantined document.")
                )

            return JSONResponse(content={
                "message": translate(lang, "moderation.rejected_deleted", default="Document rejected and deleted"),
                "document_id": document_id,
                "action": "rejected",
                "moderated_by": admin_user["username"]
            })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=translate(lang, "moderation.moderation_failed", default=f"Failed to moderate document: {str(e)}").format(error=str(e))
        )


# ==================== New endpoints for quarantine validation workflow ====================

@router.post("/quarantine/{document_id}/validate")
async def validate_quarantined_document(
    document_id: str,
    moderator_user: dict = Depends(get_moderator_user),
    request: Request = None,
):
    """
    A moderator validates a quarantined document (adds username to `approved_by`).
    Does not publish the document automatically: publishing is done with a dedicated endpoint
    when at least 3 validations are reached.
    """
    # Charger le document en quarantaine
    document = await document_repository.get_quarantined_document(document_id)
    if not document:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.quarantine_not_found", default="Quarantined document not found"),
            status_code=404
        )

    username = moderator_user.get("username")
    moderation = document.setdefault("moderation", {})
    approved_by: List[str] = moderation.setdefault("approved_by", [])
    approval_process = moderation.setdefault("approval_process", {"status": BookStatus.WAITING.value})

    if username and username not in approved_by:
        approved_by.append(username)
        approval_process["date"] = approval_process.get("date") or None

    # Keep status as WAITING until 3 validations are reached
    if len(approved_by) >= 3:
        approval_process["status"] = BookStatus.IN_QUARANTINE.value  # ready to publish (visual flag client-side)

    success = await document_repository.update_quarantined_document(document_id, document)
    if not success:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.q_update_failed", default="Failed to update quarantined document"),
            status_code=500
        )

    lang = get_lang(request) if request else "en"
    return APIResponse.success(
        message=translate(lang, "moderation.validation_saved", default="Validation saved"),
        data={
            "document_id": document_id,
            "approved_by": approved_by
        }
    )


@router.patch("/quarantine/{document_id}")
async def update_quarantined_document(
    document_id: str,
    updates: Dict[str, Any] = Body(..., description="Champs à mettre à jour: metadata.*, content, etc."),
    moderator_user: dict = Depends(get_moderator_user),
    request: Request = None,
):
    """
    Update metadata and/or content of a quarantined document (moderator or admin).
    """
    # Optional: light validation of allowed fields
    allowed_keys = {"metadata", "content", "preview", "moderation"}
    sanitized_updates: Dict[str, Any] = {k: v for k, v in updates.items() if k in allowed_keys}

    if not sanitized_updates:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.no_valid_fields", default="No valid fields to update"),
            status_code=400
        )

    success = await document_repository.update_quarantined_document(document_id, sanitized_updates)
    if not success:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.q_update_failed", default="Failed to update quarantined document"),
            status_code=404
        )

    lang = get_lang(request) if request else "en"
    return APIResponse.success(
        message=translate(lang, "moderation.q_updated", default="Quarantined document updated"),
        data={"document_id": document_id}
    )


@router.post("/quarantine/{document_id}/publish")
async def publish_quarantined_document(
    document_id: str,
    moderator_user: dict = Depends(get_moderator_user),
    request: Request = None,
):
    """
    Publish (move out of quarantine) a document if at least 3 moderators validated it.
    Accessible to moderators and admins.
    """
    document = await document_repository.get_quarantined_document(document_id)
    if not document:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.quarantine_not_found", default="Quarantined document not found"),
            status_code=404
        )

    approved_by = document.get("moderation", {}).get("approved_by", []) or []
    if len(approved_by) < 3:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.publishing_not_allowed", default="Publishing not allowed: fewer than 3 validations"),
            status_code=400
        )

    success = await document_repository.move_from_quarantine_to_approved(document_id)
    if not success:
        lang = get_lang(request) if request else "en"
        return APIResponse.error(
            message=translate(lang, "moderation.publish_failed", default="Failed to publish document"),
            status_code=500
        )

    lang = get_lang(request) if request else "en"
    return APIResponse.success(
        message=translate(lang, "moderation.published", default="Document published"),
        data={"document_id": document_id}
    )
