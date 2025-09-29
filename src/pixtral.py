import json
import os
from typing import Tuple, Dict, Any
from mistralai import Mistral

MODEL = "pixtral-large-latest"
OCR_MODEL = "mistral-ocr-latest"


def _load_api_key() -> str:
    """Loads the Pixtral/Mistral API key from apikey.json located in src/ directory.

    Searches relative to this file's directory to be robust to working directory.
    """
    here = os.path.dirname(__file__)
    path = os.path.join(here, "apikey.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)["apikeys"]["pixtral"]


def get_client() -> Mistral:
    """Create and return a Mistral client using the configured API key."""
    api_key = _load_api_key()
    return Mistral(api_key=api_key)



def process_pdf(file_name: str, content: bytes, include_image_base64: bool = True) -> Dict[str, Any]:
    """Uploads a PDF to Mistral OCR and returns the OCR response as a dict.

    Args:
        file_name: Original file name of the uploaded PDF.
        content: Raw bytes of the PDF file.
        include_image_base64: Whether to include page preview images in base64.

    Returns:
        Dict representation of the OCR response (compatible with json serialization).
    """
    client = get_client()

    uploaded_pdf = client.files.upload(
        file={
            "file_name": file_name or "uploaded_file.pdf",
            "content": content,
        },
        purpose="ocr",
    )

    signed_url = client.files.get_signed_url(file_id=uploaded_pdf.id)

    ocr_response = client.ocr.process(
        model=OCR_MODEL,
        document={
            "type": "document_url",
            "document_url": signed_url.url,
        },
        include_image_base64=include_image_base64,
    )

    # Return as a plain dict
    return ocr_response.model_dump()


__all__ = ["process_pdf", "get_client", "MODEL", "OCR_MODEL"]