"""
API module - exposes the main router and components
"""
from .models import UserCredentials, LoginCredentials
from .middleware import error_handler_middleware, logging_middleware
from .dependencies import get_current_user, get_admin_user, get_moderator_user
from .responses import APIResponse
from ..domain.services import AuthService
from ..infra.repositories import user_repository
from ..infra.security import crypto_manager
from ..infra.config import config

__all__ = [
    "UserCredentials",
    "LoginCredentials",
    "error_handler_middleware",
    "logging_middleware",
    "get_current_user",
    "get_admin_user",
    "get_moderator_user",
    "APIResponse",
    "AuthService",
    "user_repository",
    "crypto_manager",
    "config",
]
