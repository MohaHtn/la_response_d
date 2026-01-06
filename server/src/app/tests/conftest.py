import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ajouter le chemin de src au PYTHONPATH
# On remonte de 2 niveaux depuis server/src/app/tests/ pour atteindre server/src/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')))

from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_headers():
    # Simulation d'un token ou autre si nécessaire
    return {"Authorization": "Bearer test-token"}
