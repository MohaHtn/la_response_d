"""
OCR package
"""
from .pixtral_service import process_pdf, get_client, MODEL, OCR_MODEL

__all__ = ["process_pdf", "get_client", "MODEL", "OCR_MODEL"]

