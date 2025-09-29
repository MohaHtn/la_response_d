from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from src.pixtral import process_pdf

router = APIRouter(prefix="/api", tags=["api"])

MAX_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB

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
    except Exception as e:
        # Map general errors to 500
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {e}")

    return JSONResponse(content=ocr)
