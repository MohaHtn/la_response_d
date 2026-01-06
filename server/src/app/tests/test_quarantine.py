"""
Tests pour les endpoints de quarantaine
"""
import pytest
from unittest.mock import MagicMock, patch
import json
from app.infra.repositories.document_repository import DocumentRepository
from app.api.models import BookStatus
from datetime import datetime

@pytest.fixture
def mock_redis():
    with patch('app.infra.database.redis_manager.redis_manager.get_client') as mock:
        client = MagicMock()
        mock.return_value = client
        yield client

@pytest.mark.asyncio
async def test_quarantine_functionality(mock_redis):
    """Test complet de la fonctionnalité de quarantaine"""
    document_repository = DocumentRepository()
    
    # 1. Créer un document conforme (normal)
    compliant_doc = {
        "document_id": "test_doc_compliant_001",
        "metadata": {
            "title": "Document Conforme",
            "author": "Auteur Test",
            "parution_date": "2023",
            "is_appropriate": True,
            "is_harmful": False,
            "is_compliant": True
        },
        "uploader": {
            "username": "test_user",
            "upload_date": datetime.now().isoformat()
        },
        "moderation": {
            "approval_process": {
                "status": BookStatus.WAITING.value,
                "date": datetime.now().isoformat(),
                "details": ""
            },
            "approved_by": []
        },
        "markdown": {
            "content": "# Contenu du document conforme"
        },
        "in_quarantine": False
    }

    # Simulation Redis pour add_document
    mock_redis.exists.return_value = False
    
    doc_id_compliant = await document_repository.add_document(compliant_doc)
    assert doc_id_compliant == "test_doc_compliant_001"

    # Simulation Redis pour get_document
    mock_redis.get.return_value = json.dumps(compliant_doc)
    retrieved_compliant = await document_repository.get_document(doc_id_compliant)
    assert retrieved_compliant is not None
    assert retrieved_compliant["metadata"]["title"] == "Document Conforme"

    # 2. Créer un document non conforme (quarantaine)
    non_compliant_doc = {
        "document_id": "test_doc_quarantine_001",
        "metadata": {
            "title": "Document Non Conforme",
            "author": "Auteur Suspect",
            "parution_date": "2023",
            "is_appropriate": False,
            "is_harmful": True,
            "is_compliant": False
        },
        "uploader": {
            "username": "test_user",
            "upload_date": datetime.now().isoformat()
        },
        "moderation": {
            "approval_process": {
                "status": BookStatus.WAITING.value,
                "date": datetime.now().isoformat(),
                "details": "Injection de prompt détectée"
            },
            "approved_by": []
        },
        "markdown": {
            "content": "# Contenu suspect"
        },
        "in_quarantine": True
    }

    doc_id_quarantine = await document_repository.add_document_to_quarantine(non_compliant_doc)
    assert doc_id_quarantine == "test_doc_quarantine_001"

    # Simuler qu'il n'est pas dans les documents normaux mais en quarantaine
    def redis_get(key):
        if key == "document:test_doc_quarantine_001":
            return None
        if key == "quarantine:test_doc_quarantine_001":
            return json.dumps(non_compliant_doc)
        return json.dumps(compliant_doc)
        
    mock_redis.get.side_effect = redis_get
    
    retrieved_normal = await document_repository.get_document(doc_id_quarantine)
    assert retrieved_normal is None
    
    retrieved_quarantine = await document_repository.get_quarantined_document(doc_id_quarantine)
    assert retrieved_quarantine is not None
    assert retrieved_quarantine["metadata"]["title"] == "Document Non Conforme"
    assert retrieved_quarantine["in_quarantine"] == True

    # 3. Récupérer tous les documents en quarantaine
    mock_redis.smembers.return_value = ["test_doc_quarantine_001"]
    all_quarantined = await document_repository.get_all_quarantined_documents()
    assert len(all_quarantined) == 1
    assert all_quarantined[0]["document_id"] == "test_doc_quarantine_001"

    # 5. Test d'approbation (déplacement vers documents normaux)
    mock_redis.delete.return_value = 1
    success_approve = await document_repository.move_from_quarantine_to_approved(doc_id_quarantine)
    assert success_approve == True

    # 6. Test de rejet (suppression)
    success_reject = await document_repository.delete_quarantined_document(doc_id_quarantine)
    assert success_reject == True


@pytest.mark.asyncio
async def test_quarantine_edge_cases(mock_redis):
    """Test des cas limites"""
    document_repository = DocumentRepository()

    # Test 1 : Approuver un document qui n'existe pas
    mock_redis.get.return_value = None
    result = await document_repository.move_from_quarantine_to_approved("doc_inexistant_999")
    assert result == False

    # Test 2 : Supprimer un document qui n'existe pas
    mock_redis.delete.return_value = 0
    result = await document_repository.delete_quarantined_document("doc_inexistant_999")
    assert result == False

    # Test 3 : Récupérer un document inexistant
    result = await document_repository.get_quarantined_document("doc_inexistant_999")
    assert result is None



