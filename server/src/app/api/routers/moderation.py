"""
Routes pour la modération (admin/modérateur)
"""
from fastapi import APIRouter, Depends
from typing import List
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
    documents = await document_repository.get_quarantine_documents()

    return APIResponse.success(
        data=documents,
        count=len(documents)
    )


@router.get("/quarantine/{document_id}")
async def get_quarantine_document(
    document_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """
    Récupérer un document en quarantaine par ID (admin uniquement)

    Args:
        document_id: ID du document
        admin_user: Utilisateur admin (injecté)

    Returns:
        Document en quarantaine
    """
    document = await document_repository.get_quarantine_document(document_id)

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
    document = await document_repository.get_quarantine_document(document_id)

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
        data={"document_id": document_id}
    )

