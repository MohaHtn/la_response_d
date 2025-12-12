"""
Reusable dependencies for FastAPI
"""
from fastapi import Header, HTTPException, Depends
from typing import Optional, Dict
import jwt
from ..infra.config import config
from ..infra.repositories import user_repository


async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict:
    """
    Get current user from JWT token

    Args:
        authorization: Authorization header with Bearer token

    Returns:
        User data

    Raises:
        HTTPException: If token is invalid or missing
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Missing authentication token in request."
        )

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication scheme. Use 'Bearer <token>'"
            )
    except ValueError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization format"
        )

    try:
        payload = jwt.decode(token, config.JWT_SECRET_KEY, algorithms=["HS256"])
        username = payload.get("username")

        if not username:
            raise HTTPException(status_code=401, detail="Invalid token.")

        user_record = await user_repository.get_user_record(username)

        if not user_record:
            raise HTTPException(status_code=401, detail="User not found.")

        return user_record

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token.")


async def get_admin_user(
    current_user: Dict = Depends(get_current_user)
) -> Dict:
    """
    Check that the current user is an admin

    Args:
        current_user: Current user (injected by get_current_user)

    Returns:
        Admin user data

    Raises:
        HTTPException: If the user is not admin
    """
    if current_user.get("account_type") != "ADMIN":
        raise HTTPException(
            status_code=403,
            detail="Access denied. Administrator rights required"
        )

    return current_user


async def get_moderator_user(
    current_user: Dict = Depends(get_current_user)
) -> Dict:
    """
    Check that the current user is a moderator or admin

    Args:
        current_user: Current user (injected by get_current_user)

    Returns:
        Moderator/Admin user data

    Raises:
        HTTPException: If the user is neither moderator nor admin
    """
    account_type = current_user.get("account_type")
    if account_type not in ["MODERATOR", "ADMIN"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied. Moderator rights required"
        )

    return current_user

