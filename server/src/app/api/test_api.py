"""
Tests unitaires pour les modules API
Démonstration de la testabilité de l'architecture modulaire
"""
import pytest
from app.api.auth import AuthService
from app.api.models import UserCredentials, LoginCredentials


class TestAuthService:
    """Tests pour le service d'authentification"""

    def test_hash_password_generates_salt(self):
        """Vérifie que le hachage génère un salt aléatoire"""
        password = "test_password_123"
        hash1, salt1 = AuthService.hash_password(password)
        hash2, salt2 = AuthService.hash_password(password)

        # Deux hachages du même mot de passe avec des salts différents
        # doivent produire des hashes différents
        assert salt1 != salt2
        assert hash1 != hash2

    def test_hash_password_with_same_salt(self):
        """Vérifie que le même salt produit le même hash"""
        password = "test_password_123"
        hash1, salt = AuthService.hash_password(password)
        hash2, _ = AuthService.hash_password(password, salt)

        assert hash1 == hash2

    def test_verify_password_correct(self):
        """Vérifie qu'un mot de passe correct est accepté"""
        password = "correct_password"
        password_hash, salt = AuthService.hash_password(password)

        assert AuthService.verify_password(password, password_hash, salt) is True

    def test_verify_password_incorrect(self):
        """Vérifie qu'un mot de passe incorrect est rejeté"""
        password = "correct_password"
        wrong_password = "wrong_password"
        password_hash, salt = AuthService.hash_password(password)

        assert AuthService.verify_password(wrong_password, password_hash, salt) is False

    def test_encrypt_decrypt_auth_data(self):
        """Vérifie le chiffrement/déchiffrement des données d'auth"""
        password = "test_password"
        password_hash, salt = AuthService.hash_password(password)

        # Chiffrer
        encrypted = AuthService.encrypt_auth_data(password_hash, salt)

        # Déchiffrer
        decrypted = AuthService.decrypt_auth_data(encrypted)

        assert decrypted["password_hash"] == password_hash
        assert decrypted["salt"] == salt


class TestModels:
    """Tests pour les modèles Pydantic"""

    def test_user_credentials_valid(self):
        """Vérifie la validation d'identifiants valides"""
        credentials = UserCredentials(
            username="john_doe",
            password="secure_password_123",
            email="john@example.com"
        )
        assert credentials.username == "john_doe"
        assert credentials.password == "secure_password_123"
        assert credentials.email == "john@example.com"

    def test_user_credentials_invalid_email(self):
        """Vérifie que les emails invalides sont rejetés"""
        with pytest.raises(ValueError):
            UserCredentials(
                username="john_doe",
                password="secure_password_123",
                email="invalid_email"
            )

    def test_login_credentials_valid(self):
        """Vérifie la validation des identifiants de connexion"""
        credentials = LoginCredentials(
            username="john_doe",
            password="password123"
        )
        assert credentials.username == "john_doe"
        assert credentials.password == "password123"


@pytest.mark.asyncio
class TestUserRepository:
    """Tests pour le repository utilisateur"""

    async def test_user_exists_empty_db(self, tmp_path):
        """Vérifie qu'un utilisateur n'existe pas dans une DB vide"""
        from app.api.users import UserRepository

        # Créer un repository avec un fichier temporaire
        test_file = tmp_path / "test_users.json"
        repo = UserRepository(str(test_file))

        exists = await repo.user_exists("john_doe")
        assert exists is False

    async def test_add_and_get_user(self, tmp_path):
        """Vérifie l'ajout et la récupération d'un utilisateur"""
        from app.api.users import UserRepository

        test_file = tmp_path / "test_users.json"
        repo = UserRepository(str(test_file))

        # Ajouter un utilisateur
        user_record = {
            "username": "john_doe",
            "email": "john@example.com",
            "encrypted_auth": "encrypted_data_here"
        }
        await repo.add_user(user_record)

        # Vérifier qu'il existe
        assert await repo.user_exists("john_doe") is True

        # Récupérer l'utilisateur
        retrieved = await repo.get_user_record("john_doe")
        assert retrieved["username"] == "john_doe"
        assert retrieved["email"] == "john@example.com"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

