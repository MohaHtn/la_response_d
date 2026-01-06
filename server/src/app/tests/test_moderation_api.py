import pytest
from unittest.mock import MagicMock, patch
from app.main import app
from app.api.dependencies import get_current_user

# Mock de la dépendance get_current_user pour les tests
async def override_get_admin_user():
    return {"username": "admin", "account_type": "ADMIN"}

@pytest.mark.asyncio
async def test_get_quarantine_documents(client):
    # On remplace la dépendance par notre mock
    app.dependency_overrides[get_current_user] = override_get_admin_user
    
    with patch('app.infra.repositories.document_repository.DocumentRepository.get_all_quarantined_documents') as mock_get_all:
        mock_get_all.return_value = []
        
        response = client.get("/moderation/quarantine")
        assert response.status_code == 200
        assert response.json()["success"] is True
        assert response.json()["data"] == []

    # Nettoyage
    app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_get_quarantine_documents_forbidden(client):
    # Simuler un utilisateur non admin
    async def override_get_normal_user():
        return {"username": "user", "account_type": "USER"}
    
    app.dependency_overrides[get_current_user] = override_get_normal_user
    
    response = client.get("/moderation/quarantine")
    assert response.status_code == 403
    
    app.dependency_overrides.clear()
