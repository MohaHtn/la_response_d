"""
Configuration module for application settings
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
# Chemins possibles pour le fichier .env
current_dir = Path(__file__).parent

# Trouver le répertoire server/ en remontant depuis ce fichier
# Ce fichier est dans: server/src/app/infra/config/app_config.py
# Donc server/ est 5 niveaux au-dessus
server_dir = current_dir.parent.parent.parent.parent.parent
possible_env_paths = [
    server_dir / ".env",  # server/.env (chemin absolu depuis le fichier)
    Path.cwd() / ".env",  # Répertoire courant
    Path.cwd().parent / ".env",  # Répertoire parent du cwd (si on est dans src/)
    Path.cwd() / "server" / ".env",  # Si lancé depuis la racine du projet
]

env_loaded = False
for env_path in possible_env_paths:
    if env_path.exists():
        load_dotenv(dotenv_path=env_path, override=True)
        env_loaded = True
        break

if not env_loaded:
    # Essayer de charger sans chemin spécifique (cherche dans les parents)
    load_dotenv(override=True)
    print("⚠️  Fichier .env chargé depuis le chemin par défaut (ou non trouvé)")

class Config:
    """Configuration settings for the application"""

    # File paths
    BASE_DIR = Path(__file__).parent.parent.parent
    KEY_FILE = BASE_DIR / "key.key"
    USERS_FILE = BASE_DIR / "users.json"
    OCR_RESULT_FILE = BASE_DIR / "ocr_result.txt"

    # Security settings - UTILISER DES VARIABLES D'ENVIRONNEMENT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "CHANGEZ_MOI_EN_PRODUCTION")
    JWT_EXPIRATION_HOURS = int(os.getenv("JWT_EXPIRATION_HOURS", "24"))  # Durée de validité du token JWT (24h par défaut)

    # API Keys - JAMAIS en dur, toujours depuis l'environnement
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    PIXTRAL_API_KEY = os.getenv("PIXTRAL_API_KEY")

    # Security settings
    PBKDF2_ITERATIONS = 100000
    HASH_ALGORITHM = 'sha256'
    SALT_LENGTH = 16



    # File upload settings
    MAX_FILE_SIZE_BYTES = int(os.getenv("MAX_FILE_SIZE_MB", "200")) * 1024 * 1024
    ALLOWED_CONTENT_TYPES = ["application/pdf", "application/octet-stream"]

    IMAGE_OUTPUT_DIR = BASE_DIR / "img"

    # API settings
    API_PREFIX = "/api"
    API_TITLE = "La Réponse D"

    JWT_EXPIRATION_HOURS = 1

    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"

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

    @classmethod
    def validate_config(cls):
        """Valide que toutes les configurations critiques sont présentes"""
        errors = []

        if not cls.PIXTRAL_API_KEY:
            errors.append("PIXTRAL_API_KEY n'est pas définie")

        if not cls.GEMINI_API_KEY:
            errors.append("GEMINI_API_KEY n'est pas définie")

        if cls.JWT_SECRET_KEY == "CHANGEZ_MOI_EN_PRODUCTION" and cls.ENVIRONMENT == "production":
            errors.append("JWT_SECRET_KEY doit être changé en production")

        if errors:
            raise ValueError(f"Configuration invalide:\n" + "\n".join(f"  - {e}" for e in errors))


# Create a global config instance
config = Config()

# Valider la configuration au démarrage (seulement en développement pour éviter de bloquer)
if config.DEBUG:
    try:
        config.validate_config()
    except ValueError as e:
        print(f"⚠️  AVERTISSEMENT: {e}")


