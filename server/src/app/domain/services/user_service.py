"""
Service de gestion des utilisateurs
"""
from typing import Dict
from datetime import datetime, timedelta
import jwt
from ...infra.config import config
from ...infra.repositories import user_repository
from .auth_service import AuthService


class UserService:
    """Service pour la gestion des utilisateurs"""

    @staticmethod
    async def register_user(username: str, email: str, password: str) -> Dict:
        """
        Enregistrer un nouvel utilisateur

        Args:
            username: Nom d'utilisateur
            email: Email de l'utilisateur
            password: Mot de passe en clair

        Returns:
            Dictionnaire avec les informations de l'utilisateur créé

        Raises:
            ValueError: Si l'utilisateur existe déjà
        """
        # Vérifier si l'utilisateur existe déjà
        if await user_repository.user_exists(username):
            raise ValueError("Le nom d'utilisateur existe déjà")

        # Hasher le mot de passe avec salt
        password_hash, salt = AuthService.hash_password(password)

        # Chiffrer les données sensibles
        encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)

        # Créer l'enregistrement utilisateur
        user_record = {
            "username": username,
            "email": email,
            "account_type": "USER",
            "encrypted_auth": encrypted_auth
        }

        # Sauvegarder l'utilisateur
        await user_repository.add_user(user_record)

        return {
            "username": username,
            "email": email,
            "account_type": "USER"
        }

    @staticmethod
    async def authenticate_user(username: str, password: str) -> Dict:
        """
        Authentifier un utilisateur et générer un token JWT

        Args:
            username: Nom d'utilisateur
            password: Mot de passe en clair

        Returns:
            Dictionnaire avec token JWT et informations utilisateur

        Raises:
            ValueError: Si les identifiants sont incorrects
        """
        # Récupérer l'utilisateur
        user_record = await user_repository.get_user_record(username)

        if not user_record:
            raise ValueError("Pseudonyme ou mot de passe incorrect")

        # Déchiffrer et vérifier le mot de passe
        try:
            auth_data = AuthService.decrypt_auth_data(user_record["encrypted_auth"])

            if not AuthService.verify_password(
                password,
                auth_data["password_hash"],
                auth_data["salt"]
            ):
                raise ValueError("Pseudonyme ou mot de passe incorrect")

            # Générer le token JWT
            secret_key = config.JWT_SECRET_KEY
            expiration = datetime.now() + timedelta(hours=1)
            token = jwt.encode(
                {
                    "username": user_record["username"].lower(),
                    "email": user_record["email"],
                    "exp": expiration
                },
                secret_key,
                algorithm="HS256"
            )

            return {
                "token": token,
                "username": user_record["username"],
                "email": user_record["email"],
                "account_type": user_record["account_type"]
            }

        except Exception as e:
            raise ValueError(f"Erreur lors de l'authentification : {str(e)}")

    @staticmethod
    async def verify_admin_token(authorization: str) -> Dict:
        """
        Vérifier le token JWT et s'assurer que l'utilisateur est admin

        Args:
            authorization: Header Authorization avec Bearer token

        Returns:
            Données de l'utilisateur admin

        Raises:
            ValueError: Si le token est invalide ou l'utilisateur n'est pas admin
        """
        if not authorization:
            raise ValueError("Token d'authentification manquant")

        # Extraire le token du format "Bearer <token>"
        try:
            scheme, token = authorization.split()
            if scheme.lower() != "bearer":
                raise ValueError("Schéma d'authentification invalide. Utilisez 'Bearer <token>'")
        except ValueError:
            raise ValueError("Format d'autorisation invalide")

        # Vérifier le token
        try:
            payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=["HS256"])
            username = payload.get("username")

            if not username:
                raise ValueError("Token invalide")

            # Récupérer l'utilisateur pour vérifier son type de compte
            user_record = await user_repository.get_user_record(username)

            if not user_record:
                raise ValueError("Utilisateur introuvable")

            if user_record.get("account_type") != "ADMIN":
                raise ValueError("Accès refusé. Droits d'administrateur requis")

            return user_record

        except jwt.ExpiredSignatureError:
            raise ValueError("Token expiré")
        except jwt.InvalidTokenError:
            raise ValueError("Token invalide")

