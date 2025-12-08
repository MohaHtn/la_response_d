"""
Routes pour l'authentification
"""
from fastapi import APIRouter, HTTPException
from ..models import UserCredentials, LoginCredentials
from ...domain.services import AuthService
from ...infra.repositories import user_repository
from ...infra.config import config
from ..responses import APIResponse
from datetime import datetime, timedelta, timezone
import jwt

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register")
async def register_user(user_credentials: UserCredentials):
    """
    Inscription d'un nouvel utilisateur

    Args:
        user_credentials: Identifiants (username, password, email)

    Returns:
        Confirmation d'inscription
    """
    # Vérifier si l'utilisateur existe déjà
    if await user_repository.user_exists(user_credentials.username):
        return APIResponse.error(
            message="Le nom d'utilisateur existe déjà",
            status_code=400
        )

    # Hasher le mot de passe avec salt
    password_hash, salt = AuthService.hash_password(user_credentials.password)

    # Chiffrer les données sensibles
    encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)

    # Créer l'enregistrement utilisateur
    user_record = {
        "username": user_credentials.username,
        "email": user_credentials.email,
        "encrypted_auth": encrypted_auth,
        "account_type": "USER",
        "created_at": datetime.now().isoformat()
    }

    # Sauvegarder dans Redis
    await user_repository.save_user(user_record)

    return APIResponse.created(
        message="Utilisateur enregistré avec succès",
        data={
            "username": user_credentials.username,
            "email": user_credentials.email,
            "account_type": "USER"
        }
    )


@router.post("/login")
async def login_user(login_credentials: LoginCredentials):
    """
    Connexion d'un utilisateur

    Args:
        login_credentials: Identifiants (username, password)

    Returns:
        Token JWT et informations utilisateur
    """
    # Récupérer l'utilisateur
    user_record = await user_repository.get_user_record(login_credentials.username)

    if not user_record:
        return APIResponse.error(
            message="Nom d'utilisateur ou mot de passe incorrect",
            status_code=401
        )

    # Déchiffrer les données d'authentification
    try:
        auth_data = AuthService.decrypt_auth_data(user_record["encrypted_auth"])
    except Exception:
        return APIResponse.error(
            message="Erreur lors de la vérification des identifiants",
            status_code=500
        )

    # Vérifier le mot de passe
    if not AuthService.verify_password(
        login_credentials.password,
        auth_data["password_hash"],
        auth_data["salt"]
    ):
        return APIResponse.error(
            message="Nom d'utilisateur ou mot de passe incorrect",
            status_code=401
        )

    # Créer le token JWT
    token_data = {
        "username": user_record["username"],
        "account_type": user_record.get("account_type", "USER"),
        "exp": datetime.now(timezone.utc) + timedelta(hours=config.JWT_EXPIRATION_HOURS)
    }

    token = jwt.encode(token_data, config.JWT_SECRET_KEY, algorithm="HS256")

    return APIResponse.success(
        message="Connexion réussie",
        data={
            "token": token,
            "user": {
                "username": user_record["username"],
                "email": user_record.get("email"),
                "account_type": user_record.get("account_type", "USER")
            }
        }
    )


@router.post("/logout")
async def logout_user():
    """
    Déconnexion (côté client principalement)

    Returns:
        Confirmation de déconnexion
    """
    return APIResponse.success(message="Déconnexion réussie")

