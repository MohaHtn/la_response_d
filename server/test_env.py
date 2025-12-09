"""Test de chargement de la configuration"""
from dotenv import load_dotenv
import os
from pathlib import Path

# Charger le .env
env_path = Path(__file__).parent / ".env"
print(f"Chemin .env: {env_path}")
print(f"Existe: {env_path.exists()}")

load_dotenv(env_path)

print(f"\nPIXTRAL_API_KEY: {os.getenv('PIXTRAL_API_KEY')}")
print(f"GEMINI_API_KEY: {os.getenv('GEMINI_API_KEY')}")
print(f"JWT_SECRET_KEY: {os.getenv('JWT_SECRET_KEY')}")

# Test import du module
print("\n--- Test import module ---")
import sys
sys.path.insert(0, 'src')
from app.infra.config import config

print(f"config.PIXTRAL_API_KEY: {config.PIXTRAL_API_KEY}")
print(f"config.GEMINI_API_KEY: {config.GEMINI_API_KEY}")
print(f"config.JWT_SECRET_KEY: {config.JWT_SECRET_KEY}")

