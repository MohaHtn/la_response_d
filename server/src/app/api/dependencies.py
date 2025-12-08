"""
Dépendances réutilisables pour FastAPI
"""
from fastapi import Header, HTTPException, Depends
from typing import Optional, Dict
import jwt
from ..infra.config import config
from ..infra.repositories import user_repository


async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict:
    """
    Récupère l'utilisateur courant depuis le token JWT

    Args:
        authorization: Header Authorization avec Bearer token

    Returns:
        Données de l'utilisateur

    Raises:
        HTTPException: Si le token est invalide ou manquant
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Token d'authentification manquant"
        )

    print(authorization)

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Schéma d'authentification invalide. Utilisez 'Bearer <token>'"
            )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Format d'autorisation invalide"
        )

    try:
        payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("username")

        if not username:
            raise HTTPException(status_code=401, detail="Token invalide")

        user_record = await user_repository.get_user_record(username)

        if not user_record:
            raise HTTPException(status_code=401, detail="Utilisateur introuvable")

        return user_record

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


async def get_admin_user(
    current_user: Dict = Depends(get_current_user)
) -> Dict:
    """
    Vérifie que l'utilisateur courant est un admin

    Args:
        current_user: Utilisateur courant (injecté par get_current_user)

    Returns:
        Données de l'utilisateur admin

    Raises:
        HTTPException: Si l'utilisateur n'est pas admin
    """
    if current_user.get("account_type") != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Accès refusé. Droits d'administrateur requis"
        )

    return current_user


async def get_moderator_user(
    current_user: Dict = Depends(get_current_user)
) -> Dict:
    """
    Vérifie que l'utilisateur courant est un modérateur ou admin

    Args:
        current_user: Utilisateur courant (injecté par get_current_user)

    Returns:
        Données de l'utilisateur modérateur/admin

    Raises:
        HTTPException: Si l'utilisateur n'est ni modérateur ni admin
    """
    account_type = current_user.get("account_type")
    if account_type not in ["MODERATOR", "ADMIN"]:
        raise HTTPException(
            status_code=403,
            detail="Accès refusé. Droits de modérateur requis"
        )

    return current_user

