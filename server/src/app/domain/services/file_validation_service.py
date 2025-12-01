"""
Service de validation des fichiers uploadés
"""
from fastapi import HTTPException
from typing import Tuple


class FileValidationService:
    """Service pour valider les fichiers uploadés"""

    @staticmethod
    def validate_file_type(content_type: str, allowed_types: list) -> None:
        """
        Valide le type MIME du fichier

        Args:
            content_type: Type MIME du fichier
            allowed_types: Liste des types autorisés

        Raises:
            HTTPException: Si le type n'est pas autorisé
        """
        if content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Type de fichier non supporté. Veuillez envoyer un PDF."
            )

    @staticmethod
    def validate_file_size(data: bytes, max_size: int) -> None:
        """
        Valide la taille du fichier

        Args:
            data: Données du fichier
            max_size: Taille maximale en bytes

        Raises:
            HTTPException: Si le fichier est trop volumineux
        """
        if len(data) > max_size:
            max_size_mb = max_size // (1024 * 1024)
            raise HTTPException(
                status_code=413,
                detail=f"Fichier trop volumineux. Taille maximale : {max_size_mb} Mo."
            )

    @staticmethod
    async def validate_and_read_file(
        file,
        allowed_types: list,
        max_size: int
    ) -> Tuple[bytes, str]:
        """
        Valide et lit un fichier uploadé

        Args:
            file: Fichier uploadé (UploadFile)
            allowed_types: Types MIME autorisés
            max_size: Taille maximale en bytes

        Returns:
            Tuple (data, filename)

        Raises:
            HTTPException: Si la validation échoue
        """
        # Valider le type
        FileValidationService.validate_file_type(file.content_type, allowed_types)

        # Lire et valider la taille
        data = await file.read()
        FileValidationService.validate_file_size(data, max_size)

        filename = file.filename or "uploaded.pdf"

        return data, filename

