"""
Middleware personnalisés pour FastAPI
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Callable
import time
import logging

logger = logging.getLogger(__name__)


async def error_handler_middleware(request: Request, call_next: Callable):
    """
    Middleware pour gérer les erreurs de manière cohérente
    """
    # Laisser passer les requêtes OPTIONS (CORS preflight)
    if request.method == "OPTIONS":
        response = await call_next(request)
        return response

    try:
        response = await call_next(request)
        return response
    except HTTPException as e:
        response = JSONResponse(
            status_code=e.status_code,
            content={
                "success": False,
                "error": e.detail,
                "status_code": e.status_code
            }
        )
        # Préserver les headers CORS en cas d'erreur
        origin = request.headers.get("origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
    except Exception as e:
        logger.error(f"Erreur non gérée: {str(e)}", exc_info=True)
        response = JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": "Erreur interne du serveur",
                "detail": str(e) if logger.level == logging.DEBUG else None
            }
        )
        # Préserver les headers CORS en cas d'erreur
        origin = request.headers.get("origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        return response


async def logging_middleware(request: Request, call_next: Callable):
    """
    Middleware pour logger les requêtes
    """
    # Laisser passer les requêtes OPTIONS (CORS preflight) sans logging détaillé
    if request.method == "OPTIONS":
        response = await call_next(request)
        return response

    start_time = time.time()

    logger.info(f"Début requête: {request.method} {request.url.path}")

    response = await call_next(request)

    process_time = time.time() - start_time
    logger.info(
        f"Fin requête: {request.method} {request.url.path} "
        f"- Status: {response.status_code} - Durée: {process_time:.2f}s"
    )

    response.headers["X-Process-Time"] = str(process_time)
    return response

