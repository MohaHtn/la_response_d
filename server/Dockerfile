# Utilise une image Python officielle
FROM python:3.12-slim

# Définit le répertoire de travail
WORKDIR /app

# Installe les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copie le fichier requirements.txt
COPY requirements.txt .

# Installe les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie le code source
COPY server/src/ ./

# Nettoie les fichiers __pycache__ qui auraien²t pu être copiés
RUN find /app -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true && \
    find /app -name "*.pyc" -delete 2>/dev/null || true

# Expose le port 8000
EXPOSE 8000

# Variables d'environnement
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Vérification rapide des imports (optionnel - commentez si ça ralentit le build)
RUN python << 'EOF'
import sys
sys.path.insert(0, '/app')
try:
    from app.api.routers import auth_router
    print('✓ Imports OK')
except Exception as e:
    import traceback
    traceback.print_exc()
    print(f'✗ Erreur: {e}')
    sys.exit(1)
EOF

# Commande pour démarrer l'application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
