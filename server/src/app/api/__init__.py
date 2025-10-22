from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from .pixtral import process_pdf
from cryptography.fernet import Fernet
import json
import os
import base64
import hashlib

router = APIRouter(prefix="/api", tags=["api"])

MAX_SIZE_BYTES = 200 * 1024 * 1024  # 200 MB

class UserCredentials(BaseModel):
    username: str
    password: str
    email: EmailStr

class LoginCredentials(BaseModel):
    username: str
    password: str

# Initialize encryption key
try:
    with open('key.key', 'rb') as file:
        key = file.read()
except FileNotFoundError:
    # Generate and save a new key if it doesn't exist
    key = Fernet.generate_key()
    with open('key.key', 'wb') as file:
        file.write(key)

fernet = Fernet(key)

@router.post("/send-book")
@router.post("/send book")
async def send_book(file: UploadFile = File(...)):
    # Validate content type
    if file.content_type not in ("application/pdf", "application/octet-stream"):
        raise HTTPException(status_code=400, detail="Unsupported file type. Please upload a PDF.")

    # Read and enforce size limit
    data = await file.read()
    if len(data) > MAX_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large. Max 50 MB.")

    try:
        ocr = process_pdf(file.filename, data)
        with open("ocr_result.txt", "w", encoding="utf-8") as f:
            f.write(str(ocr))
    except Exception as e:
        # Map general errors to 500
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {e}")

    return JSONResponse(content=ocr)

@router.post("/register")
async def register_user(userCredentials: UserCredentials):
    # Check if user already exists
    if await user_exists(userCredentials.username):
        raise HTTPException(status_code=400, detail="Username already exists")

    # Generate a salt for password hashing
    salt = os.urandom(16)

    # Hash the password with salt
    password_hash = hashlib.pbkdf2_hmac('sha256',
                                       userCredentials.password.encode(),
                                       salt,
                                       100000)

    # Prepare user data (username and email unencrypted for lookup, password encrypted)
    user_data = {
        "username": userCredentials.username,
        "email": userCredentials.email,
        "password_hash": base64.urlsafe_b64encode(password_hash).decode(),
        "salt": base64.urlsafe_b64encode(salt).decode()
    }

    # Encrypt sensitive data only (password_hash and salt)
    sensitive_data = {
        "password_hash": user_data["password_hash"],
        "salt": user_data["salt"]
    }

    # Use the global Fernet key for encryption
    encrypted_sensitive_data = fernet.encrypt(json.dumps(sensitive_data).encode())

    # Final user record
    user_record = {
        "username": userCredentials.username,
        "email": userCredentials.email,
        "encrypted_auth": base64.urlsafe_b64encode(encrypted_sensitive_data).decode()
    }

    # Store user data
    try:
        users = await load_users()
        users.append(user_record)
        await save_users(users)

        return JSONResponse(content={
            "message": "User registered successfully",
            "username": userCredentials.username
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to register user: {str(e)}")

@router.post("/login")
async def login_user(loginCredentials: LoginCredentials):
    # Find user
    user_record = await get_user_record(loginCredentials.username)

    if not user_record:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Decrypt sensitive data
    try:
        encrypted_auth_data = base64.urlsafe_b64decode(user_record["encrypted_auth"])
        decrypted_auth = fernet.decrypt(encrypted_auth_data)
        auth_data = json.loads(decrypted_auth.decode())

        # Verify password
        stored_salt = base64.urlsafe_b64decode(auth_data["salt"])
        stored_password_hash = base64.urlsafe_b64decode(auth_data["password_hash"])

        # Hash the provided password with the stored salt
        provided_password_hash = hashlib.pbkdf2_hmac('sha256',
                                                    loginCredentials.password.encode(),
                                                    stored_salt,
                                                    100000)

        if provided_password_hash != stored_password_hash:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        return JSONResponse(content={
            "message": "Login successful",
            "username": user_record["username"],
            "email": user_record["email"]
        })

    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid username or password")

async def user_exists(username: str) -> bool:
    """Check if username already exists"""
    users = await load_users()
    return any(user["username"] == username for user in users)

async def get_user_record(username: str):
    """Get user record by username"""
    users = await load_users()
    for user in users:
        if user["username"] == username:
            return user
    return None

async def load_users():
    """Load users from JSON file"""
    try:
        with open('users.json', 'r') as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        return []

async def save_users(users):
    """Save users to JSON file"""
    with open('users.json', 'w') as file:
        json.dump(users, file, indent=2)
