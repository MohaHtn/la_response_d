"""
Redis connection and management
"""
import redis
from typing import Optional
from ..config import config


class RedisManager:
    """Manager for Redis connections and operations"""

    def __init__(self, host: str = None, port: int = None, db: int = None, password: Optional[str] = None):
        """
        Initialize Redis connection

        Args:
            host: Redis server host (defaults to config)
            port: Redis server port (defaults to config)
            db: Redis database number (defaults to config)
            password: Redis password (optional, defaults to config)
        """
        self.host = host or config.REDIS_HOST
        self.port = port or config.REDIS_PORT
        self.db = db or config.REDIS_DB
        self.password = password or config.REDIS_PASSWORD
        self._client: Optional[redis.Redis] = None

    def get_client(self) -> redis.Redis:
        """
        Get Redis client instance

        Returns:
            Redis client instance
        """
        if self._client is None:
            self._client = redis.Redis(
                host=self.host,
                port=self.port,
                db=self.db,
                password=self.password,
                decode_responses=True
            )
        return self._client  # type: ignore

    def close(self):
        """Close Redis connection"""
        if self._client:
            self._client.close()
            self._client = None

    def ping(self) -> bool:
        """
        Check if Redis connection is alive

        Returns:
            True if connection is alive, False otherwise
        """
        try:
            return bool(self.get_client().ping())
        except Exception:
            return False


# Global instance
redis_manager = RedisManager()

