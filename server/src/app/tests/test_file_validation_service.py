import pytest
from fastapi import HTTPException
from app.domain.services.file_validation_service import FileValidationService
from unittest.mock import MagicMock
import asyncio

def test_validate_file_type_success():
    # Succès : type autorisé
    FileValidationService.validate_file_type("application/pdf", ["application/pdf"])

def test_validate_file_type_failure():
    # Échec : type non autorisé
    with pytest.raises(HTTPException) as excinfo:
        FileValidationService.validate_file_type("text/plain", ["application/pdf"])
    assert excinfo.value.status_code == 400
    assert "Type de fichier non supporté" in excinfo.value.detail

def test_validate_file_size_success():
    # Succès : taille inférieure au max
    FileValidationService.validate_file_size(b"some data", 100)

def test_validate_file_size_failure():
    # Échec : taille supérieure au max
    with pytest.raises(HTTPException) as excinfo:
        FileValidationService.validate_file_size(b"too much data", 5)
    assert excinfo.value.status_code == 413
    assert "Fichier trop volumineux" in excinfo.value.detail

@pytest.mark.asyncio
async def test_validate_and_read_file():
    # Mock d'un objet UploadFile
    mock_file = MagicMock()
    mock_file.content_type = "application/pdf"
    mock_file.filename = "test.pdf"
    
    # Simuler le comportement asynchrone de read()
    future = asyncio.Future()
    future.set_result(b"pdf content")
    mock_file.read.return_value = future

    data, filename = await FileValidationService.validate_and_read_file(
        mock_file, ["application/pdf"], 100
    )

    assert data == b"pdf content"
    assert filename == "test.pdf"
    mock_file.read.assert_called_once()
