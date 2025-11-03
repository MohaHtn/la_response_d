"""
API module - exposes the main router and components
"""
from .routes import router
from .models import UserCredentials, LoginCredentials
from .auth import AuthService
from .users import user_repository
from .crypto_utils import crypto_manager
from .config import config

__all__ = [
    "router",
    "UserCredentials",
    "LoginCredentials",
    "AuthService",
    "user_repository",
    "crypto_manager",
    "config",
]
