"""
Réponses standardisées pour l'API
"""
from typing import Any, Dict, Optional, List
from fastapi.responses import JSONResponse


class APIResponse:
    """Classe pour créer des réponses API standardisées"""

    @staticmethod
    def success(
        data: Any = None,
        message: str = "Opération réussie",
        status_code: int = 200,
        **kwargs
    ) -> JSONResponse:
        """
        Crée une réponse de succès standardisée

        Args:
            data: Données à retourner
            message: Message de succès
            status_code: Code de statut HTTP
            **kwargs: Données supplémentaires

        Returns:
            JSONResponse avec format standardisé
        """
        content = {
            "success": True,
            "message": message,
            **kwargs
        }

        if data is not None:
            content["data"] = data

        return JSONResponse(status_code=status_code, content=content)

    @staticmethod
    def error(
        message: str,
        status_code: int = 400,
        errors: Optional[List[str]] = None,
        **kwargs
    ) -> JSONResponse:
        """
        Crée une réponse d'erreur standardisée

        Args:
            message: Message d'erreur principal
            status_code: Code de statut HTTP
            errors: Liste d'erreurs détaillées
            **kwargs: Données supplémentaires

        Returns:
            JSONResponse avec format standardisé
        """
        content = {
            "success": False,
            "error": message,
            **kwargs
        }

        if errors:
            content["errors"] = errors

        return JSONResponse(status_code=status_code, content=content)

    @staticmethod
    def created(
        data: Any = None,
        message: str = "Ressource créée avec succès",
        resource_id: Optional[str] = None,
        **kwargs
    ) -> JSONResponse:
        """
        Crée une réponse de création (201) standardisée

        Args:
            data: Données à retourner
            message: Message de succès
            resource_id: ID de la ressource créée
            **kwargs: Données supplémentaires

        Returns:
            JSONResponse avec format standardisé
        """
        content = {
            "success": True,
            "message": message,
            **kwargs
        }

        if resource_id:
            content["id"] = resource_id

        if data is not None:
            content["data"] = data

        return JSONResponse(status_code=201, content=content)

    @staticmethod
    def no_content(message: str = "Opération réussie") -> JSONResponse:
        """
        Crée une réponse sans contenu (204)

        Args:
            message: Message de succès

        Returns:
            JSONResponse vide
        """
        return JSONResponse(
            status_code=204,
            content={"success": True, "message": message}
        )

