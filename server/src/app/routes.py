from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import json
import os
from .api.pixtral import process_pdf as mistral_process_pdf

router = APIRouter()

@router.post("/api/send-book")
async def process_pdf(file: UploadFile = File(...)):
    """
    Endpoint pour traiter un PDF et retourner une analyse complète avec métadonnées,
    analyse de sécurité, analyse de contenu et markdown fusionné via Mistral.
    """

    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Le fichier doit être un PDF")

    try:
        # Lire le contenu du fichier
        content = await file.read()

        # Traitement via Mistral avec toutes les analyses
        result = mistral_process_pdf(
            file_name=file.filename,
            content=content,
            include_image_base64=True,  # Inclure les aperçus d'images
            return_markdown=True,       # Retourner le markdown fusionné
            embed_data_uris=True,       # Embarquer les images en data URI
            image_output_dir="ocr_images"  # Dossier de sortie pour les images
        )

        return JSONResponse(content=result)

    except FileNotFoundError as e:
        raise HTTPException(
            status_code=500,
            detail="Fichier de configuration API manquant. Vérifiez que apikey.json existe."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors du traitement du PDF: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Endpoint de vérification de santé du service"""
    return {"status": "healthy", "service": "pdf-processor"}
