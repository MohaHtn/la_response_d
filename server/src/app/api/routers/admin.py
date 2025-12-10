"""
Routes d'administration (gestion des utilisateurs)
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal, Dict, Any, List

from ..responses import APIResponse
from ..dependencies import get_admin_user
from ...infra.repositories import user_repository
from ...domain.services import AuthService
from datetime import datetime


router = APIRouter(prefix="/admin", tags=["admin"])


class UserUpdatePayload(BaseModel):
    email: Optional[EmailStr] = None
    account_type: Optional[Literal["USER", "MODERATOR", "ADMIN"]] = None
    password: Optional[str] = Field(default=None, min_length=1)


def _sanitize_user_record(user: Dict[str, Any]) -> Dict[str, Any]:
    """Retourne un dict sans champs sensibles (ex: encrypted_auth)."""
    return {
        "username": user.get("username"),
        "email": user.get("email"),
        "account_type": user.get("account_type"),
        "created_at": user.get("created_at"),
    }


@router.get("/users")
async def list_users(admin_user: dict = Depends(get_admin_user)):
    """
    Lister tous les utilisateurs (admin uniquement)
    Retourne: username, email, account_type, created_at.
    """
    users = await user_repository.get_all_users()

    # Assurer un created_at pour les anciens enregistrements
    sanitized: List[Dict[str, Any]] = []
    for u in users:
        if not u.get("created_at"):
            # Ne pas écrire en base, simplement retourner une valeur par défaut
            u = {**u, "created_at": None}
        sanitized.append(_sanitize_user_record(u))

    return APIResponse.success(data=sanitized, count=len(sanitized))


@router.patch("/users/{username}")
async def update_user(username: str, payload: UserUpdatePayload, admin_user: dict = Depends(get_admin_user)):
    """
    Mettre à jour un utilisateur (email, type de compte, mot de passe)
    """
    # Vérifier que l'utilisateur existe
    user = await user_repository.get_user_record(username)
    if not user:
        return APIResponse.error(message="Utilisateur introuvable", status_code=404)

    updates: Dict[str, Any] = {}

    if payload.email is not None:
        updates["email"] = str(payload.email)

    if payload.account_type is not None:
        updates["account_type"] = payload.account_type

    if payload.password is not None:
        # Recalculer et réencrypter les infos d'authentification
        pwd_hash, salt = AuthService.hash_password(payload.password)
        updates["encrypted_auth"] = AuthService.encrypt_auth_data(pwd_hash, salt)

    if not updates:
        return APIResponse.success(message="Aucune mise à jour à effectuer", data=_sanitize_user_record(user))

    success = await user_repository.update_user(username, updates)
    if not success:
        return APIResponse.error(message="Échec de la mise à jour de l'utilisateur", status_code=500)

    updated = await user_repository.get_user_record(username)
    return APIResponse.success(message="Utilisateur mis à jour", data=_sanitize_user_record(updated))


@router.delete("/users/{username}")
async def delete_user(username: str, admin_user: dict = Depends(get_admin_user)):
    """
    Supprimer un utilisateur (admin uniquement)
    """
    # Interdire de supprimer le dernier admin éventuellement? (non demandé)
    deleted = await user_repository.delete_user(username)
    if not deleted:
        return APIResponse.error(message="Utilisateur introuvable", status_code=404)

    return APIResponse.no_content(message="Utilisateur supprimé")


# --- Alias endpoints using singular path for compatibility ---
@router.get("/user")
async def list_users_alias(admin_user: dict = Depends(get_admin_user)):
    return await list_users(admin_user)


@router.patch("/user/{username}")
async def update_user_alias(username: str, payload: UserUpdatePayload, admin_user: dict = Depends(get_admin_user)):
    return await update_user(username, payload, admin_user)


@router.delete("/user/{username}")
async def delete_user_alias(username: str, admin_user: dict = Depends(get_admin_user)):
    return await delete_user(username, admin_user)
