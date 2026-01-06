"""
Cryptography utilities for secure data storage
"""
from cryptography.fernet import Fernet
import os
from ..config import config


class CryptoManager:
    """Manages encryption/decryption operations"""

    def __init__(self, key_file: str = None):
        """
        Initialize the crypto manager with a key file

        Args:
            key_file: Path to the encryption key file (uses config default if None)
        """
        self.key_file = key_file or config.get_key_file_path()
        self._fernet = None

    @property
    def fernet(self) -> Fernet:
        """Lazy-load the Fernet instance"""
        if self._fernet is None:
            key = self._load_or_generate_key()
            self._fernet = Fernet(key)
        return self._fernet

    def _load_or_generate_key(self) -> bytes:
        """Load existing key or generate a new one"""
        try:
            with open(self.key_file, 'rb') as file:
                key = file.read()
                if not key:
                    raise ValueError("Empty key file")
                return key
        except (FileNotFoundError, ValueError):
            # Generate and save a new key if it doesn't exist
            import logging
            logging.getLogger(__name__).warning(f"Encryption key not found or empty at {self.key_file}. Generating a new one. Existing encrypted data will be unreadable!")
            key = Fernet.generate_key()
            
            # Ensure directory exists
            os.makedirs(os.path.dirname(os.path.abspath(self.key_file)), exist_ok=True)
            
            with open(self.key_file, 'wb') as file:
                file.write(key)
            return key

    def encrypt(self, data: bytes) -> bytes:
        """Encrypt data"""
        return self.fernet.encrypt(data)

    def decrypt(self, encrypted_data: bytes) -> bytes:
        """Decrypt data"""
        return self.fernet.decrypt(encrypted_data)


# Global instance
crypto_manager = CryptoManager()

