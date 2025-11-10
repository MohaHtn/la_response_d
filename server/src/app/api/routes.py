"""
API routes for the application
"""
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from .models import UserCredentials, LoginCredentials
from ..infra.ocr import process_pdf
from ..infra.config import config
from ..domain.services import AuthService
from ..infra.repositories import user_repository

router = APIRouter(prefix="/api", tags=["api"])

@router.post("/send-book")
async def send_book(file: UploadFile = File(...)):
    """
    Upload and process a PDF file with OCR

    Args:
        file: The PDF file to process

    Returns:
        JSON response with OCR results
    """
    # Validate content type
    if file.content_type not in config.ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Please upload a PDF."
        )

    # Read and enforce size limit
    data = await file.read()
    if len(data) > config.MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="File too large. Max 200 MB."
        )

    try:
        filename = file.filename or "uploaded.pdf"
        ocr = process_pdf(filename, data)
        with open(config.get_ocr_result_path(), "w", encoding="utf-8") as f:
            f.write(str(ocr))
    except Exception as e:
        # Map general errors to 500
        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {e}"
        )

    return JSONResponse(content=ocr)


@router.post("/register")
async def register_user(user_credentials: UserCredentials):
    """
    Register a new user

    Args:
        user_credentials: Username, password, and email

    Returns:
        JSON response with registration confirmation
    """
    # Check if a user already exists
    if await user_repository.user_exists(user_credentials.username):
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    # Hash the password with salt
    password_hash, salt = AuthService.hash_password(user_credentials.password)

    # Encrypt sensitive data
    encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)

    # Final user record
    user_record = {
        "username": user_credentials.username,
        "email": user_credentials.email,
        "encrypted_auth": encrypted_auth
    }

    # Store user data
    try:
        await user_repository.add_user(user_record)

        return JSONResponse(content={
            "message": "User registered successfully",
            "username": user_credentials.username
        })
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to register user: {str(e)}"
        )


@router.post("/login")
async def login_user(login_credentials: LoginCredentials):
    """
    Authenticate a user

    Args:
        login_credentials: Username and password

    Returns:
        JSON response with login confirmation and user data
    """
    # Find user
    user_record = await user_repository.get_user_record(login_credentials.username)

    if not user_record:
        raise HTTPException(
            status_code=401,
            detail="Pseudonyme ou mot de passe incorrect."
        )

    # Decrypt and verify password
    try:
        auth_data = AuthService.decrypt_auth_data(user_record["encrypted_auth"])

        if not AuthService.verify_password(
            login_credentials.password,
            auth_data["password_hash"],
            auth_data["salt"]
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password"
            )

        return JSONResponse(content={
            "message": "Login successful",
            "username": user_record["username"],
            "email": user_record["email"]
        })

    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

