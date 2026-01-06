import pytest
from unittest.mock import MagicMock, patch, AsyncMock
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def mock_user_repo():
    with patch('app.api.routers.setup.user_repository') as mock:
        yield mock

@pytest.mark.asyncio
async def test_get_setup_status_needs_setup(client, mock_user_repo):
    # Simuler qu'il n'y a aucun utilisateur
    mock_user_repo.get_all_users = AsyncMock(return_value=[])
    
    response = client.get("/setup/status")
    
    assert response.status_code == 200
    data = response.json()
    assert data["needs_setup"] is True
    assert data["admins_count"] == 0
    assert data["remaining"] == 3

@pytest.mark.asyncio
async def test_get_setup_status_no_setup_needed(client, mock_user_repo):
    # Simuler qu'il y a déjà 3 admins
    mock_user_repo.get_all_users = AsyncMock(return_value=[
        {"username": "admin1", "account_type": "ADMIN"},
        {"username": "admin2", "account_type": "ADMIN"},
        {"username": "admin3", "account_type": "ADMIN"},
    ])
    
    response = client.get("/setup/status")
    
    assert response.status_code == 200
    data = response.json()
    assert data["needs_setup"] is False
    assert data["admins_count"] == 3
    assert data["remaining"] == 0

@pytest.mark.asyncio
async def test_create_admins_success(client, mock_user_repo):
    # Simuler qu'il n'y a pas d'admins
    mock_user_repo.get_all_users = AsyncMock(return_value=[])
    mock_user_repo.user_exists = AsyncMock(return_value=False)
    mock_user_repo.add_user = AsyncMock()
    
    admin_data = [
        {"username": "admin1", "email": "admin1@example.com", "password": "password123"},
        {"username": "admin2", "email": "admin2@example.com", "password": "password123"}
    ]
    
    with patch('app.api.routers.setup.AuthService') as mock_auth:
        mock_auth.hash_password.return_value = ("hash", "salt")
        mock_auth.encrypt_auth_data.return_value = "encrypted"
        
        response = client.post("/setup/admins", json=admin_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["created"] == 2
    assert mock_user_repo.add_user.call_count == 2

@pytest.mark.asyncio
async def test_create_admins_limit_reached(client, mock_user_repo):
    # Simuler qu'il y a déjà 3 admins
    mock_user_repo.get_all_users = AsyncMock(return_value=[
        {"username": "admin1", "account_type": "ADMIN"},
        {"username": "admin2", "account_type": "ADMIN"},
        {"username": "admin3", "account_type": "ADMIN"},
    ])
    mock_user_repo.add_user = AsyncMock()
    
    admin_data = [
        {"username": "admin4", "email": "admin4@example.com", "password": "password123"}
    ]
    
    response = client.post("/setup/admins", json=admin_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["created"] == 0
    assert "maximum de 3 admins" in data["message"]
    assert mock_user_repo.add_user.call_count == 0
