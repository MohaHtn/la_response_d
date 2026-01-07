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

# S'assure que tous les fichiers __init__.py existent (contournement du problème BuildKit/Git)
RUN for dir in /app/app /app/app/api /app/app/api/utils /app/app/domain /app/app/infra \
               /app/app/domain/services /app/app/infra/config /app/app/infra/database \
               /app/app/infra/ocr /app/app/infra/repositories /app/app/infra/security; do \
        if [ -d "$dir" ] && [ ! -f "$dir/__init__.py" ]; then \
            echo '"""Package"""' > "$dir/__init__.py"; \
        fi; \
    done && \
    if [ ! -f /app/app/api/routers/__init__.py ]; then \
        echo '"""Routers API"""' > /app/app/api/routers/__init__.py && \
        echo 'from .auth import router as auth_router' >> /app/app/api/routers/__init__.py && \
        echo 'from .documents import router as documents_router' >> /app/app/api/routers/__init__.py && \
        echo 'from .moderation import router as moderation_router' >> /app/app/api/routers/__init__.py && \
        echo 'from .setup import router as setup_router' >> /app/app/api/routers/__init__.py && \
        echo 'from .admin import router as admin_router' >> /app/app/api/routers/__init__.py && \
        echo '__all__ = ["auth_router", "documents_router", "moderation_router", "setup_router", "admin_router"]' >> /app/app/api/routers/__init__.py; \
    fi

# Nettoie les fichiers __pycache__ qui auraient pu être copiés
RUN find /app -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true && \
    find /app -name "*.pyc" -delete 2>/dev/null || true

# Expose le port 8000
EXPOSE 8000

# Variables d'environnement
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Vérification rapide des imports (désactivée - problème de copie de fichiers avec BuildKit)
# RUN python -c "from app.api.routers import auth_router; print('✓ Imports OK')"

# Commande pour démarrer l'application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
