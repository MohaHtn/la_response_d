"""
User data management and storage with Redis
"""
import json
from typing import Dict, Optional, List
from ..database.redis_manager import redis_manager


class UserRepository:
    """Repository for user data operations using Redis"""

    USER_KEY_PREFIX = "user:"
    USERNAME_INDEX = "usernames"

    def __init__(self):
        """Initialize the user repository with Redis"""
        self.redis_client = redis_manager.get_client()

    def _get_user_key(self, username: str) -> str:
        """
        Generate Redis key for a user

        Args:
            username: The username

        Returns:
            Redis key string
        """
        return f"{self.USER_KEY_PREFIX}{username.lower()}"

    async def user_exists(self, username: str) -> bool:
        """
        Check if username already exists

        Args:
            username: The username to check

        Returns:
            True if user exists, False otherwise
        """
        key = self._get_user_key(username)
        return bool(self.redis_client.exists(key))

    async def get_user_record(self, username: str) -> Optional[Dict]:
        """
        Get user record by username

        Args:
            username: The username to search for

        Returns:
            User record if found, None otherwise
        """
        key = self._get_user_key(username)
        
        try:
            user_data = self.redis_client.hgetall(key)
            if not user_data:
                return None

            # S'assurer que toutes les valeurs sont des strings (decode_responses=True devrait le faire)
            # Mais on vérifie quand même au cas où
            decoded_data = {}
            for field, value in user_data.items():
                if isinstance(value, bytes):
                    decoded_data[field] = value.decode('utf-8')
                else:
                    decoded_data[field] = value

            return decoded_data
        except Exception as e:
            # Gérer le cas où la clé contient un autre type (ex: string au lieu de hash)
            if "WRONGTYPE" in str(e):
                # Essayer de récupérer comme string (ancien format)
                try:
                    string_data = self.redis_client.get(key)
                    if string_data:
                        # Convertir de JSON string vers dict
                        user_data = json.loads(string_data)
                        
                        # Migrer vers le nouveau format hash
                        self.redis_client.delete(key)  # Supprimer l'ancienne clé
                        self.redis_client.hset(key, mapping=user_data)  # Recréer comme hash
                        
                        return user_data
                except (json.JSONDecodeError, TypeError):
                    pass
            
            # Si aucune récupération possible, retourner None
            return None

    async def add_user(self, user_record: Dict) -> None:
        """
        Add a new user record

        Args:
            user_record: The user record to add
        """
        username = user_record["username"]
        key = self._get_user_key(username)

        # Store user data as a hash
        self.redis_client.hset(key, mapping=user_record)

        # Add username to the index set
        self.redis_client.sadd(self.USERNAME_INDEX, username.lower())

    async def get_all_users(self) -> List[Dict]:
        """
        Get all user records

        Returns:
            List of all user records
        """
        usernames = self.redis_client.smembers(self.USERNAME_INDEX)
        users = []

        for username in usernames:
            user_data = await self.get_user_record(username)
            if user_data:
                users.append(user_data)

        return users

    async def delete_user(self, username: str) -> bool:
        """
        Delete a user record

        Args:
            username: The username to delete

        Returns:
            True if user was deleted, False if user didn't exist
        """
        key = self._get_user_key(username)
        result = self.redis_client.delete(key)

        if result > 0:
            self.redis_client.srem(self.USERNAME_INDEX, username.lower())
            return True

        return False

    async def update_user(self, username: str, updates: Dict) -> bool:
        """
        Update user record fields

        Args:
            username: The username to update
            updates: Dictionary of fields to update

        Returns:
            True if user was updated, False if user didn't exist
        """
        if not await self.user_exists(username):
            return False

        key = self._get_user_key(username)
        self.redis_client.hset(key, mapping=updates)
        return True


# Global instance
user_repository = UserRepository()

