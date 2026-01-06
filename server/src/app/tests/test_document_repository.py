import pytest
from unittest.mock import MagicMock, patch
from app.infra.repositories.document_repository import DocumentRepository
import json

@pytest.fixture
def mock_redis():
    with patch('app.infra.database.redis_manager.redis_manager.get_client') as mock:
        client = MagicMock()
        mock.return_value = client
        yield client

def test_get_document_key():
    repo = DocumentRepository()
    assert repo._get_document_key("123") == "document:123"

@pytest.mark.asyncio
async def test_get_document(mock_redis):
    repo = DocumentRepository()
    doc_data = {"id": "123", "title": "Test"}
    mock_redis.get.return_value = json.dumps(doc_data)

    result = await repo.get_document("123")
    
    assert result == doc_data
    mock_redis.get.assert_called_with("document:123")

@pytest.mark.asyncio
async def test_get_document_not_found(mock_redis):
    repo = DocumentRepository()
    mock_redis.get.return_value = None

    result = await repo.get_document("notfound")
    
    assert result is None

@pytest.mark.asyncio
async def test_add_document(mock_redis):
    repo = DocumentRepository()
    mock_redis.incr.return_value = 1
    
    doc_data = {"title": "New Doc"}
    
    # On mocke _generate_document_id pour avoir un ID prévisible si besoin
    # ou on laisse faire et on vérifie l'appel
    doc_id = await repo.add_document(doc_data)
    
    assert doc_id.startswith("doc_")
    assert mock_redis.set.called
    assert mock_redis.sadd.called
