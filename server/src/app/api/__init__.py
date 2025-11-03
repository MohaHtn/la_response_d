"""
API module - exposes the main router and components
"""
from .routes import router
from .models import UserCredentials, LoginCredentials
from ..domain.services import AuthService
from ..infra.repositories import user_repository
from ..infra.security import crypto_manager
from ..infra.config import config

__all__ = [
    "router",
    "UserCredentials",
    "LoginCredentials",
    "AuthService",
    "user_repository",
    "crypto_manager",
    "config",
]
