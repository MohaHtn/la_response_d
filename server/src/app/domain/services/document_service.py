"""
Service de gestion des documents
"""
from typing import Dict, List, Optional
from ...infra.repositories import document_repository
from ...api.models import BookStatus


class DocumentService:
    """Service pour la gestion des documents"""

    @staticmethod
    async def create_document(document_data: Dict) -> str:
        """
        Créer un nouveau document

        Args:
            document_data: Données du document à créer

        Returns:
            ID du document créé
        """
        return await document_repository.add_document(document_data)

    @staticmethod
    async def get_document_by_id(document_id: str) -> Optional[Dict]:
        """
        Récupérer un document par son ID

        Args:
            document_id: ID du document

        Returns:
            Document ou None si introuvable
        """
        return await document_repository.get_document(document_id)

    @staticmethod
    async def get_all_documents() -> List[Dict]:
        """
        Récupérer tous les documents

        Returns:
            Liste de tous les documents
        """
        return await document_repository.get_all_documents()

    @staticmethod
    async def get_documents_by_status(status: str) -> List[Dict]:
        """
        Récupérer les documents filtrés par statut

        Args:
            status: Statut de modération (WAITING, IN_APPROVAL, OK, NOK)

        Returns:
            Liste des documents avec le statut spécifié
        """
        return await document_repository.get_documents_by_status(status)

    @staticmethod
    async def get_documents_by_uploader(username: str) -> List[Dict]:
        """
        Récupérer les documents uploadés par un utilisateur spécifique

        Args:
            username: Nom d'utilisateur de l'uploader

        Returns:
            Liste des documents uploadés par l'utilisateur
        """
        return await document_repository.get_documents_by_uploader(username)

    @staticmethod
    async def update_document(document_id: str, updates: Dict) -> bool:
        """
        Mettre à jour un document

        Args:
            document_id: ID du document à mettre à jour
            updates: Dictionnaire des champs à mettre à jour

        Returns:
            True si la mise à jour a réussi, False sinon
        """
        return await document_repository.update_document(document_id, updates)

    @staticmethod
    async def delete_document(document_id: str) -> bool:
        """
        Supprimer un document

        Args:
            document_id: ID du document à supprimer

        Returns:
            True si la suppression a réussi, False sinon
        """
        return await document_repository.delete_document(document_id)

    @staticmethod
    async def search_documents(
        title: Optional[str] = None,
        author: Optional[str] = None
    ) -> List[Dict]:
        """
        Rechercher des documents par titre et/ou auteur

        Args:
            title: Titre à rechercher (optionnel)
            author: Auteur à rechercher (optionnel)

        Returns:
            Liste des documents correspondants
        """
        return await document_repository.search_documents(title=title, author=author)

    @staticmethod
    async def get_all_quarantined_documents() -> List[Dict]:
        """
        Récupérer tous les documents en quarantaine

        Returns:
            Liste de tous les documents en quarantaine
        """
        return await document_repository.get_all_quarantined_documents()

    @staticmethod
    async def get_quarantined_document(document_id: str) -> Optional[Dict]:
        """
        Récupérer un document en quarantaine par son ID

        Args:
            document_id: ID du document

        Returns:
            Document en quarantaine ou None si introuvable
        """
        return await document_repository.get_quarantined_document(document_id)

    @staticmethod
    async def approve_quarantined_document(document_id: str) -> bool:
        """
        Approuver un document en quarantaine et le déplacer vers les documents normaux

        Args:
            document_id: ID du document à approuver

        Returns:
            True si l'opération a réussi, False sinon
        """
        return await document_repository.move_from_quarantine_to_approved(document_id)

    @staticmethod
    async def reject_quarantined_document(document_id: str) -> bool:
        """
        Rejeter et supprimer un document en quarantaine

        Args:
            document_id: ID du document à rejeter

        Returns:
            True si la suppression a réussi, False sinon
        """
        return await document_repository.delete_quarantined_document(document_id)

