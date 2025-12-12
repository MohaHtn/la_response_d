"""
Custom middlewares for FastAPI
"""
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from typing import Callable
import time
import logging
from ..infra.i18n import get_lang, translate

logger = logging.getLogger(__name__)


async def error_handler_middleware(request: Request, call_next: Callable):
    """
    Middleware to handle errors consistently
    """
    # Let OPTIONS (CORS preflight) requests pass through
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
        # Preserve CORS headers on error
        origin = request.headers.get("origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        return response
    except Exception as e:
        logger.error(f"Unhandled error: {str(e)}", exc_info=True)
        lang = get_lang(request)
        response = JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": translate(lang, "errors.internal", default="Internal server error"),
                "detail": str(e) if logger.level == logging.DEBUG else None
            }
        )
        # Preserve CORS headers on error
        origin = request.headers.get("origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        return response


async def logging_middleware(request: Request, call_next: Callable):
    """
    Middleware to log requests
    """
    # Let OPTIONS (CORS preflight) requests pass without detailed logging
    if request.method == "OPTIONS":
        response = await call_next(request)
        return response

    start_time = time.time()

    logger.info(f"Request start: {request.method} {request.url.path}")

    response = await call_next(request)

    process_time = time.time() - start_time
    logger.info(
        f"Request end: {request.method} {request.url.path} "
        f"- Status: {response.status_code} - Duration: {process_time:.2f}s"
    )

    response.headers["X-Process-Time"] = str(process_time)
    return response

