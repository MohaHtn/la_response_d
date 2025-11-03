# API Module - Architecture Modulaire

Ce module API a été restructuré de manière modulaire pour améliorer la maintenabilité, la lisibilité et la séparation des responsabilités.

## Structure du module

```
api/
├── __init__.py          # Point d'entrée du module, exporte les composants principaux
├── models.py            # Modèles Pydantic pour la validation des données
├── routes.py            # Routes et endpoints de l'API FastAPI
├── auth.py              # Logique d'authentification et hachage des mots de passe
├── users.py             # Gestion du stockage et récupération des utilisateurs
├── crypto_utils.py      # Utilitaires de chiffrement/déchiffrement
└── pixtral.py           # Traitement OCR des PDF
```

## Responsabilités des modules

### `models.py`
- **Responsabilité** : Définition des modèles de données pour la validation
- **Classes** :
  - `UserCredentials` : Données d'inscription (username, password, email)
  - `LoginCredentials` : Données de connexion (username, password)

### `crypto_utils.py`
- **Responsabilité** : Gestion du chiffrement des données sensibles
- **Classe** : `CryptoManager`
  - Chargement/génération automatique de la clé de chiffrement
  - Méthodes de chiffrement/déchiffrement avec Fernet
- **Instance globale** : `crypto_manager`

### `auth.py`
- **Responsabilité** : Logique d'authentification et sécurité
- **Classe** : `AuthService`
  - Hachage des mots de passe avec PBKDF2 + salt
  - Vérification des mots de passe
  - Chiffrement/déchiffrement des données d'authentification
- **Constantes** :
  - `ITERATIONS = 100000` (itérations PBKDF2)
  - `HASH_ALGORITHM = 'sha256'`

### `users.py`
- **Responsabilité** : Gestion du stockage et récupération des utilisateurs
- **Classe** : `UserRepository`
  - Chargement/sauvegarde des utilisateurs depuis/vers JSON
  - Vérification de l'existence d'un utilisateur
  - Récupération d'un utilisateur par nom
  - Ajout d'un nouvel utilisateur
- **Instance globale** : `user_repository`

### `routes.py`
- **Responsabilité** : Définition des endpoints de l'API
- **Endpoints** :
  - `POST /api/send book` : Upload et traitement OCR d'un PDF
  - `POST /api/register` : Inscription d'un nouvel utilisateur
  - `POST /api/login` : Authentification d'un utilisateur
- **Instance** : `router` (APIRouter FastAPI)

### `__init__.py`
- **Responsabilité** : Point d'entrée du module API
- **Exports** :
  - `router` : Le routeur principal FastAPI
  - `UserCredentials`, `LoginCredentials` : Modèles de données
  - `AuthService` : Service d'authentification
  - `user_repository` : Référentiel des utilisateurs
  - `crypto_manager` : Gestionnaire de chiffrement

## Avantages de cette architecture

1. **Séparation des responsabilités** : Chaque fichier a une responsabilité claire et unique
2. **Réutilisabilité** : Les composants peuvent être importés et utilisés indépendamment
3. **Testabilité** : Chaque module peut être testé unitairement de manière isolée
4. **Maintenabilité** : Les modifications sont localisées dans des fichiers spécifiques
5. **Lisibilité** : Le code est plus facile à comprendre avec des fichiers plus petits et focalisés
6. **Extensibilité** : Facile d'ajouter de nouveaux modules sans modifier les existants

## Utilisation

Pour utiliser l'API dans votre application FastAPI :

```python
from app.api import router

app = FastAPI()
app.include_router(router)
```

Pour utiliser les composants individuellement :

```python
from app.api import AuthService, user_repository, crypto_manager
from app.api.models import UserCredentials

# Exemple d'utilisation du service d'authentification
password_hash, salt = AuthService.hash_password("mon_mot_de_passe")

# Exemple d'utilisation du repository
user_exists = await user_repository.user_exists("john_doe")
```

## Dépendances

- `fastapi` : Framework web
- `pydantic` : Validation des données
- `cryptography` : Chiffrement (Fernet)
- Modules internes : `pixtral` pour le traitement OCR

## Sécurité

- Les mots de passe sont hachés avec PBKDF2-HMAC-SHA256 (100 000 itérations)
- Utilisation de salts aléatoires uniques pour chaque utilisateur
- Chiffrement des données sensibles avec Fernet (AES-128)
- Clé de chiffrement stockée de manière sécurisée dans `key.key`

