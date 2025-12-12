"""
Administration routes (user management)
"""
from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal, Dict, Any, List

from ..responses import APIResponse
from ...infra.i18n import get_lang, translate
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
    List all users (admin only)
    Returns: username, email, account_type, created_at.
    """
    users = await user_repository.get_all_users()

    # Ensure created_at for legacy records
    sanitized: List[Dict[str, Any]] = []
    for u in users:
        if not u.get("created_at"):
            # Do not write back, just return a default value
            u = {**u, "created_at": None}
        sanitized.append(_sanitize_user_record(u))

    return APIResponse.success(data=sanitized, count=len(sanitized))


@router.patch("/users/{username}")
async def update_user(username: str, payload: UserUpdatePayload, admin_user: dict = Depends(get_admin_user), request: Request = None):
    """
    Update a user (email, account type, password)
    """
    # Check user exists
    user = await user_repository.get_user_record(username)
    lang = get_lang(request) if request else "en"
    if not user:
        return APIResponse.error(message=translate(lang, "admin.user_not_found", default="User not found"), status_code=404)

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
        return APIResponse.success(message=translate(lang, "admin.nothing_to_update", default="Nothing to update"), data=_sanitize_user_record(user))

    success = await user_repository.update_user(username, updates)
    if not success:
        return APIResponse.error(message=translate(lang, "admin.update_failed", default="Failed to update user"), status_code=500)

    updated = await user_repository.get_user_record(username)
    return APIResponse.success(message=translate(lang, "admin.user_updated", default="User updated"), data=_sanitize_user_record(updated))


@router.delete("/users/{username}")
async def delete_user(username: str, admin_user: dict = Depends(get_admin_user), request: Request = None):
    """
    Delete a user (admin only)
    """
    # Optionally, prevent deleting the last admin (not required)
    deleted = await user_repository.delete_user(username)
    lang = get_lang(request) if request else "en"
    if not deleted:
        return APIResponse.error(message=translate(lang, "admin.user_not_found", default="User not found"), status_code=404)

    return APIResponse.no_content(message=translate(lang, "admin.user_deleted", default="User deleted"))


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
