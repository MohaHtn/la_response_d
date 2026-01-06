import pytest
import os
import base64
from app.domain.services.auth_service import AuthService
from unittest.mock import patch, MagicMock

def test_hash_password():
    password = "test_password"
    pwd_hash, salt = AuthService.hash_password(password)
    
    assert isinstance(pwd_hash, bytes)
    assert isinstance(salt, bytes)
    assert len(salt) == 16 # Default salt length in config

def test_verify_password():
    password = "test_password"
    pwd_hash, salt = AuthService.hash_password(password)
    
    assert AuthService.verify_password(password, pwd_hash, salt) is True
    assert AuthService.verify_password("wrong_password", pwd_hash, salt) is False

def test_encrypt_decrypt_auth_data():
    password_hash = b"some_hash"
    salt = b"some_salt"
    
    # Mocking crypto_manager to avoid file operations
    with patch('app.domain.services.auth_service.crypto_manager') as mock_crypto:
        mock_crypto.encrypt.return_value = b"encrypted_stuff"
        mock_crypto.decrypt.return_value = b'{"password_hash": "c29tZV9oYXNo", "salt": "c29tZV9zYWx0"}'
        
        encrypted = AuthService.encrypt_auth_data(password_hash, salt)
        assert isinstance(encrypted, str)
        
        decrypted = AuthService.decrypt_auth_data(encrypted)
        assert decrypted["password_hash"] == password_hash
        assert decrypted["salt"] == salt
