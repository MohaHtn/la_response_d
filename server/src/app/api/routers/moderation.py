"""
Routes pour la modération (admin/modérateur)
"""
from fastapi import APIRouter, Depends, Query, HTTPException, Body
from typing import List, Dict, Any
from starlette.responses import JSONResponse
from ..models import BookStatus
from ..responses import APIResponse
from ..dependencies import get_admin_user, get_moderator_user
from ...infra.repositories import document_repository

router = APIRouter(prefix="/moderation", tags=["moderation"])


@router.get("/quarantine")
async def get_quarantine_documents(
    admin_user: dict = Depends(get_admin_user)
):
    """
    Récupérer tous les documents en quarantaine (admin uniquement)

    Args:
        admin_user: Utilisateur admin (injecté)

    Returns:
        Liste des documents en quarantaine
    """
    documents = await document_repository.get_all_quarantined_documents()

    return APIResponse.success(
        data=documents,
        count=len(documents)
    )


@router.get("/quarantine/{document_id}")
async def get_quarantine_document(
    document_id: str,
    moderator_user: dict = Depends(get_moderator_user)
):
    """
    Récupérer un document en quarantaine par ID (admin uniquement)

    Args:
        document_id: ID du document
        admin_user: Utilisateur admin (injecté)

    Returns:
        Document en quarantaine
    """
    document = await document_repository.get_quarantined_document(document_id)

    if not document:
        return APIResponse.error(
            message="Document introuvable en quarantaine",
            status_code=404
        )

    return APIResponse.success(data=document)


@router.post("/quarantine/{document_id}/approve")
async def approve_quarantine_document(
    document_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """
    Approuver un document en quarantaine (admin uniquement)

    Args:
        document_id: ID du document
        admin_user: Utilisateur admin (injecté)

    Returns:
        Confirmation d'approbation
    """
    document = await document_repository.get_quarantined_document(document_id)

    if not document:
        return APIResponse.error(
            message="Document introuvable en quarantaine",
            status_code=404
        )

    # Déplacer de la quarantaine vers les documents approuvés
    success = await document_repository.move_from_quarantine_to_approved(document_id)

    if not success:
        return APIResponse.error(
            message="Erreur lors de l'approbation du document",
            status_code=500
        )

    return APIResponse.success(
        message="Document approuvé et déplacé vers la bibliothèque",
        data={"document_id": document_id}
    )


@router.post("/quarantine/{document_id}/reject")
async def reject_quarantine_document(
    document_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """
    Rejeter un document en quarantaine (admin uniquement)

    Args:
        document_id: ID du document
        admin_user: Utilisateur admin (injecté)

    Returns:
        Confirmation de rejet
    """
    success = await document_repository.delete_quarantine_document(document_id)

    if not success:
        return APIResponse.error(
            message="Document introuvable ou erreur lors de la suppression",
            status_code=404
        )

    return APIResponse.success(
        message="Document rejeté et supprimé",
        data={"document_id": document_id}
    )


@router.get("/pending")
async def get_pending_documents(
    moderator_user: dict = Depends(get_moderator_user)
):
    """
    Récupérer les documents en attente de modération

    Args:
        moderator_user: Utilisateur modérateur/admin (injecté)

    Returns:
        Liste des documents en attente
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
    moderator_user: dict = Depends(get_moderator_user)
):
    """
    Approuver un document (modérateur/admin)

    Args:
        document_id: ID du document
        moderator_user: Utilisateur modérateur/admin (injecté)

    Returns:
        Confirmation d'approbation
    """
    document = await document_repository.get_document(document_id)

    if not document:
        return APIResponse.error(
            message="Document introuvable",
            status_code=404
        )

    # Mettre à jour le statut
    document["moderation"]["approval_process"]["status"] = BookStatus.OK.value
    document["moderation"]["approved_by"].append(moderator_user["username"])

    success = await document_repository.update_document(document_id, document)

    if not success:
        return APIResponse.error(
            message="Erreur lors de l'approbation",
            status_code=500
        )

    return APIResponse.success(
        message="Document approuvé",
        data={"document_id": document_id}
    )


@router.post("/{document_id}/reject")
async def reject_document(
    document_id: str,
    moderator_user: dict = Depends(get_moderator_user)
):
    """
    Rejeter un document (modérateur/admin)

    Args:
        document_id: ID du document
        moderator_user: Utilisateur modérateur/admin (injecté)

    Returns:
        Confirmation de rejet
    """
    document = await document_repository.get_document(document_id)

    if not document:
        return APIResponse.error(
            message="Document introuvable",
            status_code=404
        )

    # Mettre à jour le statut
    document["moderation"]["approval_process"]["status"] = BookStatus.NOK.value

    success = await document_repository.update_document(document_id, document)

    if not success:
        return APIResponse.error(
            message="Erreur lors du rejet",
            status_code=500
        )

    return APIResponse.success(
        message="Document rejeté",
        data={
            "document_id": document_id,
            "rejected_by": moderator_user["username"]
        }
    )


@router.post("/quarantine/{document_id}/moderate")
async def moderate_quarantined_document(
    document_id: str,
    action: str = Query(..., description="Action à effectuer : 'approve' ou 'reject'"),
    admin_user: dict = Depends(get_admin_user)
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
                "moderated_by": admin_user["username"]
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
                "moderated_by": admin_user["username"]
            })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Échec de la modération du document : {str(e)}"
        )


# ==================== New endpoints for quarantine validation workflow ====================

@router.post("/quarantine/{document_id}/validate")
async def validate_quarantined_document(
    document_id: str,
    moderator_user: dict = Depends(get_moderator_user)
):
    """
    Un modérateur valide un document en quarantaine (ajout dans la liste `approved_by`).
    Ne publie pas le document automatiquement: la publication se fait avec un endpoint dédié
    quand au moins 3 validations sont atteintes.
    """
    # Charger le document en quarantaine
    document = await document_repository.get_quarantined_document(document_id)
    if not document:
        return APIResponse.error(
            message="Document en quarantaine introuvable",
            status_code=404
        )

    username = moderator_user.get("username")
    moderation = document.setdefault("moderation", {})
    approved_by: List[str] = moderation.setdefault("approved_by", [])
    approval_process = moderation.setdefault("approval_process", {"status": BookStatus.WAITING.value})

    if username and username not in approved_by:
        approved_by.append(username)
        approval_process["date"] = approval_process.get("date") or None

    # Conserver le statut en WAITING tant que 3 validations ne sont pas atteintes
    if len(approved_by) >= 3:
        approval_process["status"] = BookStatus.IN_QUARANTINE.value  # prêt à publier (flag visuel côté client)

    success = await document_repository.update_quarantined_document(document_id, document)
    if not success:
        return APIResponse.error(
            message="Échec de la mise à jour du document en quarantaine",
            status_code=500
        )

    return APIResponse.success(
        message="Validation enregistrée",
        data={
            "document_id": document_id,
            "approved_by": approved_by
        }
    )


@router.patch("/quarantine/{document_id}")
async def update_quarantined_document(
    document_id: str,
    updates: Dict[str, Any] = Body(..., description="Champs à mettre à jour: metadata.*, content, etc."),
    moderator_user: dict = Depends(get_moderator_user)
):
    """
    Modifier les métadonnées et/ou le contenu d'un document en quarantaine (modérateur ou admin).
    """
    # Optionnel: validation légère des champs autorisés
    allowed_keys = {"metadata", "content", "preview", "moderation"}
    sanitized_updates: Dict[str, Any] = {k: v for k, v in updates.items() if k in allowed_keys}

    if not sanitized_updates:
        return APIResponse.error(
            message="Aucun champ valide à mettre à jour",
            status_code=400
        )

    success = await document_repository.update_quarantined_document(document_id, sanitized_updates)
    if not success:
        return APIResponse.error(
            message="Document en quarantaine introuvable ou mise à jour impossible",
            status_code=404
        )

    return APIResponse.success(
        message="Document en quarantaine mis à jour",
        data={"document_id": document_id}
    )


@router.post("/quarantine/{document_id}/publish")
async def publish_quarantined_document(
    document_id: str,
    moderator_user: dict = Depends(get_moderator_user)
):
    """
    Publier (déplacer hors de quarantaine) un document si au moins 3 modérateurs l'ont validé.
    Accessible aux modérateurs et admins.
    """
    document = await document_repository.get_quarantined_document(document_id)
    if not document:
        return APIResponse.error(
            message="Document en quarantaine introuvable",
            status_code=404
        )

    approved_by = document.get("moderation", {}).get("approved_by", []) or []
    if len(approved_by) < 3:
        return APIResponse.error(
            message="Publication impossible: moins de 3 validations",
            status_code=400
        )

    success = await document_repository.move_from_quarantine_to_approved(document_id)
    if not success:
        return APIResponse.error(
            message="Échec de la publication du document",
            status_code=500
        )

    return APIResponse.success(
        message="Document publié",
        data={"document_id": document_id}
    )
