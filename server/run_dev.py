#!/usr/bin/env python
"""
Script de démarrage rapide pour le serveur en mode développement
"""
import os
import sys
from pathlib import Path

# Add the src directory to Python path
src_dir = Path(__file__).parent / "src"
sys.path.insert(0, str(src_dir))

# Check if .env file exists
env_file = Path(__file__).parent / ".env"
if not env_file.exists():
    print("⚠️  Attention : Le fichier .env n'existe pas.")
    print("   Copiez .env.example en .env et configurez les variables nécessaires.")
    print("   Exemple : cp .env.example .env")

# Import and run the application
if __name__ == "__main__":
    import uvicorn

    print("🚀 Démarrage du serveur en mode développement...")
    print("📝 Variables d'environnement chargées depuis .env")
    print("🔗 Le serveur sera accessible sur http://localhost:8000")
    print("📚 Documentation API : http://localhost:8000/docs")
    print("")

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

