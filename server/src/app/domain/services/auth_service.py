"""
Authentication service - Business logic for authentication
"""
import hashlib
import os
import base64
import json
from typing import Dict, Tuple
from ...infra.security import crypto_manager
from ...infra.config import config


class AuthService:
    """Service for authentication operations"""

    ITERATIONS = config.PBKDF2_ITERATIONS
    HASH_ALGORITHM = config.HASH_ALGORITHM

    @staticmethod
    def hash_password(password: str, salt: bytes = None) -> Tuple[bytes, bytes]:
        """
        Hash a password with a salt using PBKDF2

        Args:
            password: The password to hash
            salt: Optional salt (generated if not provided)

        Returns:
            Tuple of (password_hash, salt)
        """
        if salt is None:
            salt = os.urandom(config.SALT_LENGTH)

        password_hash = hashlib.pbkdf2_hmac(
            AuthService.HASH_ALGORITHM,
            password.encode(),
            salt,
            AuthService.ITERATIONS
        )

        return password_hash, salt

    @staticmethod
    def verify_password(password: str, stored_hash: bytes, salt: bytes) -> bool:
        """
        Verify a password against a stored hash

        Args:
            password: The password to verify
            stored_hash: The stored password hash
            salt: The salt used for hashing

        Returns:
            True if password matches, False otherwise
        """
        computed_hash, _ = AuthService.hash_password(password, salt)
        return computed_hash == stored_hash

    @staticmethod
    def encrypt_auth_data(password_hash: bytes, salt: bytes) -> str:
        """
        Encrypt authentication data (password hash and salt)

        Args:
            password_hash: The password hash
            salt: The salt

        Returns:
            Base64-encoded encrypted data
        """
        sensitive_data = {
            "password_hash": base64.urlsafe_b64encode(password_hash).decode(),
            "salt": base64.urlsafe_b64encode(salt).decode()
        }

        encrypted = crypto_manager.encrypt(json.dumps(sensitive_data).encode())
        return base64.urlsafe_b64encode(encrypted).decode()

    @staticmethod
    def decrypt_auth_data(encrypted_auth: str) -> Dict[str, bytes]:
        """
        Decrypt authentication data

        Args:
            encrypted_auth: Base64-encoded encrypted data

        Returns:
            Dictionary with 'password_hash' and 'salt' as bytes
        """
        encrypted_bytes = base64.urlsafe_b64decode(encrypted_auth)
        decrypted = crypto_manager.decrypt(encrypted_bytes)
        auth_data = json.loads(decrypted.decode())

        return {
            "password_hash": base64.urlsafe_b64decode(auth_data["password_hash"]),
            "salt": base64.urlsafe_b64decode(auth_data["salt"])
        }

