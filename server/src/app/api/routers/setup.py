"""
Routes de configuration initiale (premier démarrage)
Permet de créer jusqu'à 3 administrateurs.
"""
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr, Field
from typing import List, Dict, Any

from ...domain.services import AuthService
from ...infra.repositories import user_repository


router = APIRouter(prefix="/setup", tags=["setup"])


class AdminCreate(BaseModel):
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)
    email: EmailStr


def _is_admin(user: Dict[str, Any]) -> bool:
    return user.get("account_type") == "ADMIN"


@router.get("/status")
async def get_setup_status():
    """
    Retourne l'état de configuration: nombre d'admins existants et si la configuration est requise.
    La configuration est considérée nécessaire tant que moins de 3 admins existent.
    """
    users = await user_repository.get_all_users()
    admins_count = sum(1 for u in users if _is_admin(u))
    needs_setup = admins_count < 3
    return {
        "admins_count": admins_count,
        "needs_setup": needs_setup,
        "remaining": max(0, 3 - admins_count),
    }


@router.post("/admins")
async def create_admins(admins: List[AdminCreate]):
    """
    Crée 1 à 3 administrateurs au maximum (total système limité à 3).
    Si un utilisateur existe déjà, il est promu ADMIN et son mot de passe est mis à jour.
    """
    # État actuel
    users = await user_repository.get_all_users()
    admins_count = sum(1 for u in users if _is_admin(u))
    remaining = max(0, 3 - admins_count)

    if remaining <= 0:
        return {"status": "ok", "created": 0, "message": "Le maximum de 3 admins est déjà atteint."}

    # Ne pas autoriser d'envoyer plus que nécessaire
    payload = admins[:remaining]

    created = []
    updated = []

    for admin in payload:
        # Hasher et chiffrer
        password_hash, salt = AuthService.hash_password(admin.password)
        encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)

        if await user_repository.user_exists(admin.username):
            await user_repository.update_user(
                admin.username,
                {
                    "email": str(admin.email),
                    "account_type": "ADMIN",
                    "encrypted_auth": encrypted_auth,
                },
            )
            updated.append(admin.username)
        else:
            await user_repository.add_user(
                {
                    "username": admin.username,
                    "email": str(admin.email),
                    "account_type": "ADMIN",
                    "encrypted_auth": encrypted_auth,
                }
            )
            created.append(admin.username)

    return {
        "status": "ok",
        "created": len(created),
        "updated": len(updated),
        "users": {"created": created, "updated": updated},
    }
