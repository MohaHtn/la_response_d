# Architecture du Module API

## Diagramme de l'architecture modulaire

```
┌─────────────────────────────────────────────────────────────┐
│                        app/main.py                          │
│                     (FastAPI Application)                   │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ imports router
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    app/api/__init__.py                      │
│                   (Module Entry Point)                      │
│  Exports: router, models, services, repositories            │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┬─────────────────┐
        │               │               │                 │
        ▼               ▼               ▼                 ▼
┌──────────────┐ ┌─────────────┐ ┌────────────┐ ┌──────────────┐
│  routes.py   │ │  models.py  │ │  auth.py   │ │   users.py   │
│              │ │             │ │            │ │              │
│ API Endpoints│ │ Pydantic    │ │ Auth Logic │ │ User Storage │
│              │ │ Validation  │ │ & Security │ │ & Retrieval  │
└──────┬───────┘ └─────────────┘ └─────┬──────┘ └──────┬───────┘
       │                               │                │
       │ uses                          │ uses           │
       │         ┌─────────────────────┘                │
       │         │                                      │
       │         ▼                                      │
       │  ┌──────────────┐                            │
       │  │ crypto_utils │                            │
       │  │              │                            │
       │  │ Encryption   │                            │
       │  │ Management   │                            │
       │  └──────────────┘                            │
       │                                               │
       └───────────────────┬───────────────────────────┘
                           │
                           ▼
                   ┌──────────────┐
                   │ pixtral.py   │
                   │              │
                   │ OCR/PDF      │
                   │ Processing   │
                   └──────────────┘
```

## Flux de données

### 1. Inscription d'un utilisateur (POST /api/register)

```
Client Request
    │
    ▼
routes.py (register_user)
    │
    ├──> models.py (UserCredentials validation)
    │
    ├──> users.py (check if user exists)
    │
    ├──> auth.py (hash_password)
    │       │
    │       └──> crypto_utils.py (encrypt auth data)
    │
    └──> users.py (add_user)
            │
            └──> JSON file storage
```

### 2. Connexion d'un utilisateur (POST /api/login)

```
Client Request
    │
    ▼
routes.py (login_user)
    │
    ├──> models.py (LoginCredentials validation)
    │
    ├──> users.py (get_user_record)
    │       │
    │       └──> JSON file storage
    │
    └──> auth.py (decrypt + verify_password)
            │
            └──> crypto_utils.py (decrypt auth data)
```

### 3. Upload PDF (POST /api/send book)

```
Client Request (PDF file)
    │
    ▼
routes.py (send_book)
    │
    ├──> File validation
    │
    └──> pixtral.py (process_pdf)
            │
            ├──> OCR processing
            ├──> Metadata extraction
            └──> Security detection
```

## Principes de conception

### Séparation des responsabilités (SRP)
Chaque module a une responsabilité unique et bien définie :
- **routes.py** : Gestion des requêtes HTTP
- **models.py** : Validation des données
- **auth.py** : Logique d'authentification
- **users.py** : Persistence des données
- **crypto_utils.py** : Chiffrement/déchiffrement

### Inversion de dépendances (DIP)
Les modules de haut niveau (routes) ne dépendent pas directement des détails d'implémentation.
Ils utilisent des services et repositories qui peuvent être facilement remplacés.

### Principe ouvert/fermé (OCP)
L'architecture est ouverte à l'extension (ajout de nouveaux modules) mais fermée à la modification (pas besoin de modifier les modules existants).

### Testabilité
Chaque module peut être testé indépendamment avec des mocks/stubs pour les dépendances.

## Avantages de cette architecture

1. **Maintenance facilitée** : Les bugs sont faciles à localiser
2. **Tests unitaires** : Chaque module peut être testé isolément
3. **Réutilisabilité** : Les services peuvent être utilisés dans d'autres contextes
4. **Scalabilité** : Facile d'ajouter de nouvelles fonctionnalités
5. **Collaboration** : Plusieurs développeurs peuvent travailler sur différents modules
6. **Documentation** : L'architecture claire facilite la compréhension du code

