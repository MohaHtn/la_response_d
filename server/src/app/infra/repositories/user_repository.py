"""
User data management and storage
"""
import json
from typing import List, Dict, Optional
from ..config import config


class UserRepository:
    """Repository for user data operations"""

    def __init__(self, data_file: str = None):
        """
        Initialize the user repository

        Args:
            data_file: Path to the JSON file storing user data (uses config default if None)
        """
        self.data_file = data_file or config.get_users_file_path()

    async def load_users(self) -> List[Dict]:
        """
        Load users from the JSON file

        Returns:
            List of user records
        """
        try:
            with open(self.data_file, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            return []
        except json.JSONDecodeError:
            return []

    async def save_users(self, users: List[Dict]) -> None:
        """
        Save users to the JSON file

        Args:
            users: List of user records to save
        """
        with open(self.data_file, 'w') as file:
            json.dump(users, file, indent=2)

    async def user_exists(self, username: str) -> bool:
        """
        Check if username already exists

        Args:
            username: The username to check

        Returns:
            True if user exists, False otherwise
        """
        users = await self.load_users()
        return any(user["username"] == username for user in users)

    async def get_user_record(self, username: str) -> Optional[Dict]:
        """
        Get user record by username

        Args:
            username: The username to search for

        Returns:
            User record if found, None otherwise
        """
        users = await self.load_users()
        for user in users:
            if user["username"] == username:
                return user
        return None

    async def add_user(self, user_record: Dict) -> None:
        """
        Add a new user record

        Args:
            user_record: The user record to add
        """
        users = await self.load_users()
        users.append(user_record)
        await self.save_users(users)


# Global instance
user_repository = UserRepository()

