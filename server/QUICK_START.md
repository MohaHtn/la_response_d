# 🚀 Guide de Démarrage Rapide - Backend

## Installation

### Prérequis
- Python 3.8+
- Redis (pour la base de données)
- pip

### 1. Installer les dépendances

```bash
cd server
pip install -r requirements.txt
```

### 2. Configuration

Créer un fichier `.env` dans `server/` :

```env
# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here
JWT_EXPIRATION_HOURS=24

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# File Upload
MAX_FILE_SIZE_BYTES=209715200  # 200 MB
ALLOWED_CONTENT_TYPES=application/pdf

# OCR
PIXTRAL_API_KEY=your-pixtral-api-key

# Security
PBKDF2_ITERATIONS=100000
SALT_LENGTH=32
HASH_ALGORITHM=sha256
```

### 3. Démarrer Redis

```bash
# Windows (avec Docker)
docker run -d -p 6379:6379 redis

# Linux/Mac
redis-server
```

### 4. Lancer le serveur

```bash
# Mode développement
uvicorn src.app.main:app --reload

# Mode production
uvicorn src.app.main:app --host 0.0.0.0 --port 8000
```

Le serveur sera disponible sur **http://localhost:8000** 🎉

## 🧪 Tester l'API

### Health Check
```bash
curl http://localhost:8000/health
```

### Documentation Interactive
Ouvrez dans votre navigateur :
- **Swagger UI** : http://localhost:8000/docs
- **ReDoc** : http://localhost:8000/redoc

### Tester l'authentification

#### Inscription
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "password": "password123",
    "email": "test@example.com"
  }'
```

#### Connexion
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "password": "password123"
  }'
```

Réponse :
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "username": "test",
      "account_type": "USER"
    }
  }
}
```

### Upload de document
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:8000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/document.pdf" \
  -F "title=Mon Document" \
  -F "author=Auteur"
```

## 📁 Structure du Projet

```
server/
├── src/
│   └── app/
│       ├── api/              # Routes et API
│       │   ├── routers/      # Routes modulaires
│       │   ├── dependencies.py
│       │   ├── middleware.py
│       │   ├── responses.py
│       │   └── models.py
│       │
│       ├── domain/           # Logique métier
│       ├── infra/            # Infrastructure
│       └── main.py           # Point d'entrée
│
├── requirements.txt
└── .env
```

## 🔑 Endpoints Principaux

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

### Documents
- `POST /api/documents/upload` - Upload (authentifié)
- `GET /api/documents/{id}` - Récupérer (authentifié)
- `GET /api/documents/` - Lister (authentifié)

### Modération
- `GET /api/moderation/quarantine` - Quarantaine (admin)
- `POST /api/moderation/quarantine/{id}/approve` - Approuver (admin)
- `POST /api/moderation/quarantine/{id}/reject` - Rejeter (admin)
- `GET /api/moderation/pending` - En attente (modérateur)
- `POST /api/moderation/{id}/approve` - Approuver (modérateur)
- `POST /api/moderation/{id}/reject` - Rejeter (modérateur)

## 🛠️ Commandes Utiles

```bash
# Lancer avec rechargement automatique
uvicorn src.app.main:app --reload

# Lancer sur un port spécifique
uvicorn src.app.main:app --port 3000

# Mode production
uvicorn src.app.main:app --host 0.0.0.0 --workers 4

# Avec logs détaillés
uvicorn src.app.main:app --log-level debug

# Tests
pytest tests/

# Linter
flake8 src/
black src/
```

## 📝 Créer un Admin

```bash
cd server
python src/create_admin_user.py
```

Ou via l'API (si vous avez les droits) :
```python
# Modifier manuellement dans Redis
# Ou utiliser le script create_admin_user.py
```

## 🐛 Dépannage

### Redis non démarré
```bash
# Vérifier si Redis est actif
redis-cli ping
# Devrait retourner: PONG
```

### Port déjà utilisé
```bash
# Changer le port
uvicorn src.app.main:app --port 8001
```

### Erreur de token
```bash
# Vérifier JWT_SECRET_KEY dans .env
# Générer une nouvelle clé :
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Erreur d'import
```bash
# Réinstaller les dépendances
pip install -r requirements.txt --force-reinstall
```

## 📚 Documentation Complète

Consultez `BACKEND_REFACTORING.md` pour :
- Architecture détaillée
- Bonnes pratiques
- Exemples avancés
- Guide de migration

---

**Besoin d'aide ?** Consultez la documentation API sur `/docs` ! 🚀

