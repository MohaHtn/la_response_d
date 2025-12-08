"""
Configuration module for application settings
"""
from pathlib import Path

class Config:
    """Configuration settings for the application"""

    # File paths
    BASE_DIR = Path(__file__).parent.parent.parent
    KEY_FILE = BASE_DIR / "key.key"
    USERS_FILE = BASE_DIR / "users.json"
    OCR_RESULT_FILE = BASE_DIR / "ocr_result.txt"
    # TODO: A stocker autre part un jour
    JWT_SECRET_KEY = "4c7004d38e046586ba9de4f54be233583abfa405101e54a36e4ccaa5583edd12"

    # Security settings
    PBKDF2_ITERATIONS = 100000
    HASH_ALGORITHM = 'sha256'
    SALT_LENGTH = 16

    # File upload settings
    MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024  # 200 MB
    ALLOWED_CONTENT_TYPES = ["application/pdf", "application/octet-stream"]

    # API settings
    API_PREFIX = "/api"
    API_TITLE = "La Réponse D"

    JWT_EXPIRATION_HOURS = 1

    @classmethod
    def get_key_file_path(cls) -> str:
        """Get the path to the encryption key file"""
        return str(cls.KEY_FILE)

    @classmethod
    def get_users_file_path(cls) -> str:
        """Get the path to the users database file"""
        return str(cls.USERS_FILE)

    @classmethod
    def get_ocr_result_path(cls) -> str:
        """Get the path to the OCR result file"""
        return str(cls.OCR_RESULT_FILE)


# Create a global config instance
config = Config()

