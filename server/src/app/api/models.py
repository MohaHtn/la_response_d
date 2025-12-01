"""
Models for API request/response validation
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from enum import Enum


class BookStatus(str, Enum):
    """Book moderation status"""
    WAITING = "WAITING"
    IN_APPROVAL = "IN_APPROVAL"
    OK = "OK"
    NOK = "NOK"


class UserCredentials(BaseModel):
    """User registration credentials"""
    username: str
    password: str
    email: EmailStr


class LoginCredentials(BaseModel):
    """User login credentials"""
    username: str
    password: str


class DocumentMetadata(BaseModel):
    """Document metadata"""
    title: str
    author: str
    parution_date: str
    is_appropriate: str
    is_harmful: bool


class DocumentUploader(BaseModel):
    """Document uploader information"""
    username: str
    upload_date: str


class ApprovalProcess(BaseModel):
    """Approval process information"""
    status: BookStatus
    date: str
    details: str


class DocumentModeration(BaseModel):
    """Document moderation information"""
    approval_process: ApprovalProcess
    approved_by: List[str]


class DocumentMarkdown(BaseModel):
    """Document markdown content"""
    content: str


class Document(BaseModel):
    """Complete document model"""
    metadata: DocumentMetadata
    uploader: DocumentUploader
    moderation: DocumentModeration
    markdown: DocumentMarkdown

    # Optional ID field for internal use
    document_id: Optional[str] = None
    # Optional preview field (first 300 chars of markdown)
    preview: Optional[str] = None
    # Optional cover image field (base64 encoded preview image)
    cover_image: Optional[str] = None


