"""
Configuration module for API settings
"""
from pathlib import Path


class Config:
    """Configuration settings for the API module"""

    # File paths
    BASE_DIR = Path(__file__).parent
    KEY_FILE = BASE_DIR.parent / "key.key"
    USERS_FILE = BASE_DIR.parent / "users.json"
    OCR_RESULT_FILE = BASE_DIR.parent / "ocr_result.txt"

    # Security settings
    PBKDF2_ITERATIONS = 100000
    HASH_ALGORITHM = 'sha256'
    SALT_LENGTH = 16

    # File upload settings
    MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024  # 200 MB
    ALLOWED_CONTENT_TYPES = ["application/pdf", "application/octet-stream"]

    # API settings
    API_PREFIX = "/api"
    API_TITLE = "la_response_d API"

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

