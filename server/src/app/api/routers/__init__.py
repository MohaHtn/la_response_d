"""
Routers API - Points d'entrée des routes
"""
from .auth import router as auth_router
from .documents import router as documents_router
from .moderation import router as moderation_router

__all__ = [
    "auth_router",
    "documents_router",
    "moderation_router",
]

