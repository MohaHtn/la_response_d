"""
Models for API request/response validation
"""
from pydantic import BaseModel, EmailStr


class UserCredentials(BaseModel):
    """User registration credentials"""
    username: str
    password: str
    email: EmailStr


class LoginCredentials(BaseModel):
    """User login credentials"""
    username: str
    password: str

