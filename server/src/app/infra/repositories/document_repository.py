"""
Document data management and storage with Redis
"""
from typing import Dict, Optional, List
import json
from datetime import datetime
from ..database.redis_manager import redis_manager


class DocumentRepository:
    """Repository for document data operations using Redis"""

    DOCUMENT_KEY_PREFIX = "document:"
    DOCUMENT_INDEX = "document_ids"
    DOCUMENT_BY_STATUS_INDEX = "documents:status:"
    DOCUMENT_BY_UPLOADER_INDEX = "documents:uploader:"
    DOCUMENT_COUNTER = "document:counter"

    def __init__(self):
        """Initialize the document repository with Redis"""
        self.redis_client = redis_manager.get_client()

    def _get_document_key(self, document_id: str) -> str:
        """
        Generate Redis key for a document

        Args:
            document_id: The document ID

        Returns:
            Redis key string
        """
        return f"{self.DOCUMENT_KEY_PREFIX}{document_id}"

    def _generate_document_id(self) -> str:
        """
        Generate a unique document ID

        Returns:
            Document ID string
        """
        counter = self.redis_client.incr(self.DOCUMENT_COUNTER)
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        return f"doc_{timestamp}_{counter}"

    async def document_exists(self, document_id: str) -> bool:
        """
        Check if document already exists

        Args:
            document_id: The document ID to check

        Returns:
            True if document exists, False otherwise
        """
        key = self._get_document_key(document_id)
        return bool(self.redis_client.exists(key))

    async def get_document(self, document_id: str) -> Optional[Dict]:
        """
        Get document by ID

        Args:
            document_id: The document ID to search for

        Returns:
            Document data if found, None otherwise
        """
        key = self._get_document_key(document_id)
        document_json = self.redis_client.get(key)

        if not document_json:
            return None

        return json.loads(document_json)

    async def add_document(self, document_data: Dict) -> str:
        """
        Add a new document record

        Args:
            document_data: The document data to add

        Returns:
            The generated document ID
        """
        # Generate a unique ID if not provided
        document_id = document_data.get("document_id") or self._generate_document_id()
        document_data["document_id"] = document_id

        key = self._get_document_key(document_id)

        # Store document data as JSON string
        self.redis_client.set(key, json.dumps(document_data))

        # Add document ID to the index set
        self.redis_client.sadd(self.DOCUMENT_INDEX, document_id)

        # Add to status index
        status = document_data.get("moderation", {}).get("approval_process", {}).get("status")
        if status:
            status_key = f"{self.DOCUMENT_BY_STATUS_INDEX}{status}"
            self.redis_client.sadd(status_key, document_id)

        # Add to uploader index
        uploader = document_data.get("uploader", {}).get("username")
        if uploader:
            uploader_key = f"{self.DOCUMENT_BY_UPLOADER_INDEX}{uploader.lower()}"
            self.redis_client.sadd(uploader_key, document_id)

        return document_id

    async def get_all_documents(self) -> List[Dict]:
        """
        Get all document records

        Returns:
            List of all document records
        """
        document_ids = self.redis_client.smembers(self.DOCUMENT_INDEX)
        documents = []

        for doc_id in document_ids:
            document_data = await self.get_document(doc_id)
            if document_data:
                documents.append(document_data)

        return documents

    async def get_documents_by_status(self, status: str) -> List[Dict]:
        """
        Get documents by moderation status

        Args:
            status: The status to filter by (WAITING, IN_APPROVAL, OK, NOK)

        Returns:
            List of documents with the specified status
        """
        status_key = f"{self.DOCUMENT_BY_STATUS_INDEX}{status}"
        document_ids = self.redis_client.smembers(status_key)
        documents = []

        for doc_id in document_ids:
            document_data = await self.get_document(doc_id)
            if document_data:
                documents.append(document_data)

        return documents

    async def get_documents_by_uploader(self, username: str) -> List[Dict]:
        """
        Get documents uploaded by a specific user

        Args:
            username: The username of the uploader

        Returns:
            List of documents uploaded by the user
        """
        uploader_key = f"{self.DOCUMENT_BY_UPLOADER_INDEX}{username.lower()}"
        document_ids = self.redis_client.smembers(uploader_key)
        documents = []

        for doc_id in document_ids:
            document_data = await self.get_document(doc_id)
            if document_data:
                documents.append(document_data)

        return documents

    async def update_document(self, document_id: str, updates: Dict) -> bool:
        """
        Update document record

        Args:
            document_id: The document ID to update
            updates: Dictionary of fields to update

        Returns:
            True if document was updated, False if document didn't exist
        """
        if not await self.document_exists(document_id):
            return False

        # Get existing document
        document_data = await self.get_document(document_id)
        if not document_data:
            return False

        # Remove from old status index if status is being updated
        old_status = document_data.get("moderation", {}).get("approval_process", {}).get("status")
        new_status = updates.get("moderation", {}).get("approval_process", {}).get("status")

        if new_status and new_status != old_status:
            # Remove from old status index
            if old_status:
                old_status_key = f"{self.DOCUMENT_BY_STATUS_INDEX}{old_status}"
                self.redis_client.srem(old_status_key, document_id)

            # Add to new status index
            new_status_key = f"{self.DOCUMENT_BY_STATUS_INDEX}{new_status}"
            self.redis_client.sadd(new_status_key, document_id)

        # Merge updates with existing data
        self._deep_update(document_data, updates)

        # Save updated document
        key = self._get_document_key(document_id)
        self.redis_client.set(key, json.dumps(document_data))

        return True

    def _deep_update(self, base_dict: Dict, update_dict: Dict) -> None:
        """
        Recursively update a dictionary

        Args:
            base_dict: The dictionary to update
            update_dict: The dictionary with updates
        """
        for key, value in update_dict.items():
            if isinstance(value, dict) and key in base_dict and isinstance(base_dict[key], dict):
                self._deep_update(base_dict[key], value)
            else:
                base_dict[key] = value

    async def delete_document(self, document_id: str) -> bool:
        """
        Delete a document record

        Args:
            document_id: The document ID to delete

        Returns:
            True if document was deleted, False if document didn't exist
        """
        # Get document to access status and uploader info
        document_data = await self.get_document(document_id)
        if not document_data:
            return False

        key = self._get_document_key(document_id)
        result = self.redis_client.delete(key)

        if result > 0:
            # Remove from main index
            self.redis_client.srem(self.DOCUMENT_INDEX, document_id)

            # Remove from status index
            status = document_data.get("moderation", {}).get("approval_process", {}).get("status")
            if status:
                status_key = f"{self.DOCUMENT_BY_STATUS_INDEX}{status}"
                self.redis_client.srem(status_key, document_id)

            # Remove from uploader index
            uploader = document_data.get("uploader", {}).get("username")
            if uploader:
                uploader_key = f"{self.DOCUMENT_BY_UPLOADER_INDEX}{uploader.lower()}"
                self.redis_client.srem(uploader_key, document_id)

            return True

        return False

    async def search_documents(self, title: Optional[str] = None, author: Optional[str] = None) -> List[Dict]:
        """
        Search documents by title or author (simple text matching)

        Args:
            title: Optional title to search for
            author: Optional author to search for

        Returns:
            List of matching documents
        """
        all_documents = await self.get_all_documents()
        results = []

        for doc in all_documents:
            metadata = doc.get("metadata", {})
            doc_title = metadata.get("title", "").lower()
            doc_author = metadata.get("author", "").lower()

            match = True
            if title and title.lower() not in doc_title:
                match = False
            if author and author.lower() not in doc_author:
                match = False

            if match:
                results.append(doc)

        return results


# Global instance
document_repository = DocumentRepository()

