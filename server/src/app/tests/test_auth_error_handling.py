
import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.mark.asyncio
async def test_login_decryption_failure(client):
    # Simuler un utilisateur dont les données ne peuvent pas être déchiffrées
    # (par exemple, suite à un changement de clé secrète)
    mock_user = {
        "username": "admin",
        "encrypted_auth": "invalid_encrypted_data",
        "account_type": "ADMIN"
    }
    
    with patch('app.api.routers.auth.user_repository.get_user_record', new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_user
        
        # On s'attend à ce que AuthService.decrypt_auth_data lève une exception
        # ou que le router gère l'erreur de déchiffrement
        response = client.post("/auth/login", json={"username": "admin", "password": "password123"})
        
        assert response.status_code == 500
        data = response.json()
        assert data["success"] is False
        assert "error" in data
        # En mode DEBUG (qui est True dans .env), on devrait avoir les détails
        assert "detail" in data
        assert "Decryption failed" in data["detail"] or "InvalidToken" in data["detail"]

@pytest.mark.asyncio
async def test_login_missing_auth_data(client):
    # Simuler un utilisateur avec des données d'auth manquantes
    mock_user = {
        "username": "broken_user",
        "encrypted_auth": "",
        "account_type": "USER"
    }
    
    with patch('app.api.routers.auth.user_repository.get_user_record', new_callable=AsyncMock) as mock_get:
        mock_get.return_value = mock_user
        
        response = client.post("/auth/login", json={"username": "broken_user", "password": "password123"})
        
        assert response.status_code == 500
        data = response.json()
        assert "Missing authentication data" in data["detail"]
