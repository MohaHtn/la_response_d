import pytest
from unittest.mock import MagicMock, patch
from app.infra.repositories.user_repository import UserRepository
import json

@pytest.fixture
def mock_redis():
    with patch('app.infra.database.redis_manager.redis_manager.get_client') as mock:
        client = MagicMock()
        mock.return_value = client
        yield client

@pytest.mark.asyncio
async def test_user_exists(mock_redis):
    repo = UserRepository()
    mock_redis.exists.return_value = True
    
    exists = await repo.user_exists("test_user")
    assert exists is True
    mock_redis.exists.assert_called_with("user:test_user")

@pytest.mark.asyncio
async def test_get_user_record_hash(mock_redis):
    repo = UserRepository()
    user_data = {"username": "test_user", "email": "test@example.com"}
    mock_redis.hgetall.return_value = user_data
    
    result = await repo.get_user_record("test_user")
    assert result == user_data
    mock_redis.hgetall.assert_called_with("user:test_user")

@pytest.mark.asyncio
async def test_add_user(mock_redis):
    repo = UserRepository()
    user_record = {"username": "NewUser", "email": "new@example.com"}
    
    await repo.add_user(user_record)
    
    mock_redis.hset.assert_called()
    mock_redis.sadd.assert_called_with("usernames", "newuser")
