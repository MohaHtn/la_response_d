"""Infrastructure package placeholder."""
"""
Infrastructure layer - External dependencies and implementations
"""
from .config import config, Config
from .security import crypto_manager, CryptoManager
from .repositories import user_repository, UserRepository
from .ocr import process_pdf, get_client

__all__ = [
    "config",
    "Config",
    "crypto_manager",
    "CryptoManager",
    "user_repository",
    "UserRepository",
    "process_pdf",
    "get_client",
]
