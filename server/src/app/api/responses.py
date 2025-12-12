"""
Standardized API responses
"""
from typing import Any, Dict, Optional, List
from fastapi.responses import JSONResponse


class APIResponse:
    """Classe pour créer des réponses API standardisées"""

    @staticmethod
    def success(
        data: Any = None,
        message: str = "Operation successful",
        status_code: int = 200,
        **kwargs
    ) -> JSONResponse:
        """
        Create a standardized success response

        Args:
            data: Data to return
            message: Success message
            status_code: HTTP status code
            **kwargs: Additional data

        Returns:
            JSONResponse with standardized format
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
        Create a standardized error response

        Args:
            message: Main error message
            status_code: HTTP status code
            errors: Detailed errors list
            **kwargs: Additional data

        Returns:
            JSONResponse with standardized format
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
        message: str = "Resource created successfully",
        resource_id: Optional[str] = None,
        **kwargs
    ) -> JSONResponse:
        """
        Create a standardized creation (201) response

        Args:
            data: Data to return
            message: Success message
            resource_id: ID of the created resource
            **kwargs: Additional data

        Returns:
            JSONResponse with standardized format
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
    def no_content(message: str = "Operation successful") -> JSONResponse:
        """
        Create a no-content response (204)

        Args:
            message: Success message

        Returns:
            Empty JSONResponse
        """
        return JSONResponse(
            status_code=204,
            content={"success": True, "message": message}
        )

