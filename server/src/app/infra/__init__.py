"""Infrastructure package placeholder."""
"""
Infrastructure layer - External dependencies and implementations
"""
from .config import config, Config
from .security import crypto_manager, CryptoManager
from .repositories import user_repository, UserRepository
from .database import redis_manager
from .ocr import process_pdf, get_client

__all__ = [
    "config",
    "Config",
    "crypto_manager",
    "CryptoManager",
    "user_repository",
    "UserRepository",
    "redis_manager",
    "process_pdf",
    "get_client",
]
