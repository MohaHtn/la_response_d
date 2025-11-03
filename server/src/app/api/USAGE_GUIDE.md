# Guide d'Utilisation - API Modulaire

Ce guide fournit des exemples pratiques d'utilisation de l'architecture modulaire.

## 📚 Table des matières

1. [Import des modules](#import-des-modules)
2. [Utilisation du service d'authentification](#utilisation-du-service-dauthentification)
3. [Utilisation du repository utilisateurs](#utilisation-du-repository-utilisateurs)
4. [Création de nouvelles routes](#création-de-nouvelles-routes)
5. [Configuration personnalisée](#configuration-personnalisée)
6. [Tests unitaires](#tests-unitaires)

---

## 🔌 Import des modules

### Import du router principal
```python
from app.api import router

# Utilisation dans FastAPI
from fastapi import FastAPI
app = FastAPI()
app.include_router(router)
```

### Import des services
```python
from app.api import (
    AuthService,
    user_repository,
    crypto_manager,
    config
)
```

### Import des modèles
```python
from app.api.models import UserCredentials, LoginCredentials
```

---

## 🔐 Utilisation du service d'authentification

### Hacher un mot de passe
```python
from app.api import AuthService

# Créer un hash avec un salt aléatoire
password = "user_password"
password_hash, salt = AuthService.hash_password(password)

# Le hash et le salt sont en bytes
print(f"Hash: {password_hash.hex()}")
print(f"Salt: {salt.hex()}")
```

### Vérifier un mot de passe
```python
# Vérifier si un mot de passe correspond
is_valid = AuthService.verify_password(
    password="user_password",
    stored_hash=password_hash,
    salt=salt
)

if is_valid:
    print("✅ Mot de passe correct")
else:
    print("❌ Mot de passe incorrect")
```

### Chiffrer les données d'authentification
```python
# Chiffrer le hash et le salt pour le stockage
encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)

# encrypted_auth est une string base64, prête pour le stockage JSON
print(f"Encrypted: {encrypted_auth}")
```

### Déchiffrer les données d'authentification
```python
# Récupérer le hash et le salt depuis les données chiffrées
auth_data = AuthService.decrypt_auth_data(encrypted_auth)

original_hash = auth_data["password_hash"]
original_salt = auth_data["salt"]
```

---

## 👥 Utilisation du repository utilisateurs

### Vérifier si un utilisateur existe
```python
from app.api import user_repository

# Fonction asynchrone
async def check_user():
    exists = await user_repository.user_exists("john_doe")
    if exists:
        print("L'utilisateur existe déjà")
    else:
        print("Nouvel utilisateur")
```

### Ajouter un nouvel utilisateur
```python
from app.api import user_repository, AuthService

async def create_user(username: str, password: str, email: str):
    # Hacher le mot de passe
    password_hash, salt = AuthService.hash_password(password)
    
    # Chiffrer les données sensibles
    encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)
    
    # Créer l'enregistrement utilisateur
    user_record = {
        "username": username,
        "email": email,
        "encrypted_auth": encrypted_auth
    }
    
    # Sauvegarder
    await user_repository.add_user(user_record)
    print(f"✅ Utilisateur {username} créé")
```

### Récupérer un utilisateur
```python
async def get_user(username: str):
    user_record = await user_repository.get_user_record(username)
    
    if user_record:
        print(f"Username: {user_record['username']}")
        print(f"Email: {user_record['email']}")
        return user_record
    else:
        print("Utilisateur non trouvé")
        return None
```

### Authentifier un utilisateur
```python
async def authenticate(username: str, password: str) -> bool:
    # Récupérer l'utilisateur
    user_record = await user_repository.get_user_record(username)
    
    if not user_record:
        return False
    
    # Déchiffrer les données d'authentification
    auth_data = AuthService.decrypt_auth_data(user_record["encrypted_auth"])
    
    # Vérifier le mot de passe
    return AuthService.verify_password(
        password,
        auth_data["password_hash"],
        auth_data["salt"]
    )
```

---

## 🌐 Création de nouvelles routes

### Ajouter un nouveau endpoint
```python
# Dans app/api/routes.py ou un nouveau fichier routes

from fastapi import APIRouter, HTTPException
from .models import UserCredentials  # Réutilisation des modèles
from .auth import AuthService        # Réutilisation des services
from .users import user_repository   # Réutilisation du repository

# Créer un nouveau router
profile_router = APIRouter(prefix="/api/profile", tags=["profile"])

@profile_router.get("/{username}")
async def get_user_profile(username: str):
    """Récupérer le profil d'un utilisateur"""
    user = await user_repository.get_user_record(username)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Retourner uniquement les données publiques
    return {
        "username": user["username"],
        "email": user["email"]
    }

@profile_router.put("/{username}/password")
async def change_password(username: str, new_password: str):
    """Changer le mot de passe d'un utilisateur"""
    user = await user_repository.get_user_record(username)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Hacher le nouveau mot de passe
    password_hash, salt = AuthService.hash_password(new_password)
    encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)
    
    # Mettre à jour (à implémenter dans le repository)
    # user["encrypted_auth"] = encrypted_auth
    # await user_repository.update_user(user)
    
    return {"message": "Password updated successfully"}
```

### Intégrer le nouveau router
```python
# Dans app/api/__init__.py
from .routes import router
from .profile_routes import profile_router  # Nouveau router

__all__ = ["router", "profile_router"]
```

```python
# Dans app/main.py
from app.api import router, profile_router

app.include_router(router)
app.include_router(profile_router)
```

---

## ⚙️ Configuration personnalisée

### Modifier la configuration
```python
# Créer une configuration personnalisée pour les tests
from app.api.config import Config

class TestConfig(Config):
    """Configuration pour les tests"""
    USERS_FILE = "/tmp/test_users.json"
    KEY_FILE = "/tmp/test_key.key"
    MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024  # 1 MB pour les tests

# Utiliser la config de test
test_config = TestConfig()
```

### Utiliser une configuration personnalisée
```python
from app.api.users import UserRepository
from app.api.crypto_utils import CryptoManager

# Repository avec fichier personnalisé
test_repo = UserRepository(data_file="/tmp/test_users.json")

# Gestionnaire de chiffrement avec clé personnalisée
test_crypto = CryptoManager(key_file="/tmp/test_key.key")
```

---

## 🧪 Tests unitaires

### Test d'un service
```python
import pytest
from app.api.auth import AuthService

def test_password_hashing():
    """Tester le hachage des mots de passe"""
    password = "test_password"
    hash1, salt1 = AuthService.hash_password(password)
    hash2, salt2 = AuthService.hash_password(password)
    
    # Différents salts = différents hashs
    assert salt1 != salt2
    assert hash1 != hash2

def test_password_verification():
    """Tester la vérification des mots de passe"""
    password = "correct_password"
    wrong = "wrong_password"
    
    password_hash, salt = AuthService.hash_password(password)
    
    assert AuthService.verify_password(password, password_hash, salt) is True
    assert AuthService.verify_password(wrong, password_hash, salt) is False
```

### Test d'un repository
```python
import pytest
from app.api.users import UserRepository

@pytest.mark.asyncio
async def test_user_operations(tmp_path):
    """Tester les opérations CRUD sur les utilisateurs"""
    # Utiliser un fichier temporaire
    test_file = tmp_path / "test_users.json"
    repo = UserRepository(str(test_file))
    
    # Tester l'ajout
    user = {
        "username": "test_user",
        "email": "test@example.com",
        "encrypted_auth": "encrypted"
    }
    await repo.add_user(user)
    
    # Tester l'existence
    assert await repo.user_exists("test_user") is True
    assert await repo.user_exists("other_user") is False
    
    # Tester la récupération
    retrieved = await repo.get_user_record("test_user")
    assert retrieved["username"] == "test_user"
    assert retrieved["email"] == "test@example.com"
```

### Test d'un endpoint
```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_endpoint():
    """Tester l'endpoint d'inscription"""
    response = client.post(
        "/api/register",
        json={
            "username": "new_user",
            "password": "secure_password",
            "email": "user@example.com"
        }
    )
    
    assert response.status_code == 200
    assert response.json()["username"] == "new_user"

def test_login_endpoint():
    """Tester l'endpoint de connexion"""
    # D'abord créer un utilisateur
    client.post(
        "/api/register",
        json={
            "username": "test_user",
            "password": "test_password",
            "email": "test@example.com"
        }
    )
    
    # Puis se connecter
    response = client.post(
        "/api/login",
        json={
            "username": "test_user",
            "password": "test_password"
        }
    )
    
    assert response.status_code == 200
    assert response.json()["message"] == "Login successful"
```

---

## 📖 Ressources supplémentaires

- **README.md** : Documentation complète du module
- **ARCHITECTURE.md** : Diagrammes et flux de données
- **REFACTORING_SUMMARY.md** : Résumé de la refactorisation
- **test_api.py** : Tests unitaires exemples
- **demo_api_modules.py** : Script de démonstration

---

## 🚀 Commandes utiles

### Lancer les tests
```bash
cd server/src
pytest app/api/test_api.py -v
```

### Lancer la démonstration
```bash
cd server/src
python3 demo_api_modules.py
```

### Démarrer le serveur
```bash
cd server/src
uvicorn app.main:app --reload
```

### Vérifier les imports
```bash
cd server/src
python3 -c "from app.api import router, config; print('✅ Imports OK')"
```

---

## 💡 Bonnes pratiques

1. **Toujours valider les entrées** avec les modèles Pydantic
2. **Utiliser les services** plutôt que dupliquer la logique
3. **Tester isolément** chaque module
4. **Documenter** les nouvelles fonctionnalités
5. **Respecter** la séparation des responsabilités

---

**Pour plus d'informations, consultez les fichiers de documentation dans `server/src/app/api/`**

