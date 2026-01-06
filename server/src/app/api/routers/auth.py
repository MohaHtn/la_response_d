"""
Authentication routes
"""
from fastapi import APIRouter, HTTPException, Request
from ..models import UserCredentials, LoginCredentials
from ...domain.services import AuthService
from ...infra.repositories import user_repository
from ...infra.config import config
from ..responses import APIResponse
from datetime import datetime, timedelta, timezone
import jwt
from ...infra.i18n import get_lang, translate

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register")
async def register_user(user_credentials: UserCredentials, request: Request):
    """
    Register a new user

    Args:
        user_credentials: Credentials (username, password, email)

    Returns:
        Registration confirmation
    """
    # Check if the user already exists
    if await user_repository.user_exists(user_credentials.username):
        lang = get_lang(request)
        return APIResponse.error(
            message=translate(lang, "auth.username_exists", default="Username already exists"),
            status_code=400
        )

    # Hash password with salt
    password_hash, salt = AuthService.hash_password(user_credentials.password)

    # Encrypt sensitive data
    encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)

    # Create user record
    user_record = {
        "username": user_credentials.username,
        "email": user_credentials.email,
        "encrypted_auth": encrypted_auth,
        "account_type": "USER",
        "created_at": datetime.now().isoformat()
    }

    # Save in Redis
    await user_repository.save_user(user_record)

    lang = get_lang(request)
    return APIResponse.created(
        message=translate(lang, "auth.registered", default="User registered successfully"),
        data={
            "username": user_credentials.username,
            "email": user_credentials.email,
            "account_type": "USER"
        }
    )


@router.post("/login")
async def login_user(login_credentials: LoginCredentials, request: Request):
    """
    User login

    Args:
        login_credentials: Credentials (username, password)

    Returns:
        JWT token and user info
    """
    # Fetch user
    user_record = await user_repository.get_user_record(login_credentials.username)

    lang = get_lang(request)
    if not user_record:
        return APIResponse.error(
            message=translate(lang, "auth.invalid_credentials", default="Invalid username or password"),
            status_code=401
        )

    # Decrypt auth data
    try:
        if "encrypted_auth" not in user_record or not user_record["encrypted_auth"]:
             raise ValueError("Missing authentication data for this user.")
             
        auth_data = AuthService.decrypt_auth_data(user_record["encrypted_auth"])
    except Exception as e:
        # Log the error for debugging
        import logging
        logging.getLogger(__name__).error(f"Authentication error for user {login_credentials.username}: {str(e)}")
        
        return APIResponse.error(
            message=translate(lang, "auth.verify_error", default="Error while verifying credentials"),
            status_code=500,
            detail=str(e) if config.DEBUG else None
        )

    # Verify password
    if not AuthService.verify_password(
        login_credentials.password,
        auth_data["password_hash"],
        auth_data["salt"]
    ):
        return APIResponse.error(
            message=translate(lang, "auth.invalid_credentials", default="Invalid username or password"),
            status_code=401
        )

    # Create JWT token
    token_data = {
        "username": user_record["username"],
        "account_type": user_record["account_type"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=config.JWT_EXPIRATION_HOURS)
    }

    token = jwt.encode(token_data, config.JWT_SECRET_KEY, algorithm="HS256")

    return APIResponse.success(
        message=translate(lang, "auth.login_success", default="Login successful"),
        data={
            "token": token,
            "user": {
                "username": user_record["username"],
                "email": user_record.get("email"),
                "account_type": user_record["account_type"]
            }
        }
    )


@router.post("/logout")
async def logout_user(request: Request):
    """
    Logout (mostly client-side)

    Returns:
        Logout confirmation
    """
    lang = get_lang(request)
    return APIResponse.success(message=translate(lang, "auth.logout_success", default="Logout successful"))

