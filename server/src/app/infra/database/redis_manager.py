"""
Redis connection and management
"""
import os
import redis
from typing import Optional


class RedisManager:
    """Manager for Redis connections and operations"""

    def __init__(self, host: str = 'localhost', port: int = 6379, db: int = 0, password: Optional[str] = None):
        """
        Initialize Redis connection

        Args:
            host: Redis server host
            port: Redis server port
            db: Redis database number
            password: Redis password (optional)
        """
        # Allow configuration via environment variables when available
        # Defaults preserve local dev behavior.
        self.host = os.getenv('REDIS_HOST', host)
        try:
            self.port = int(os.getenv('REDIS_PORT', str(port)))
        except ValueError:
            self.port = port
        try:
            self.db = int(os.getenv('REDIS_DB', str(db)))
        except ValueError:
            self.db = db
        env_password = os.getenv('REDIS_PASSWORD')
        self.password = env_password if env_password is not None else password
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

