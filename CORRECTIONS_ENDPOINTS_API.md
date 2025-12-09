# Corrections des Endpoints API - Quarantine

## Date
2 décembre 2025

## Problème Initial
L'endpoint `/api/moderation/quarantine` retournait une erreur 404 Not Found.

## Causes Identifiées

### 1. Noms de méthodes incorrects dans le repository
Le fichier `moderation.py` appelait des méthodes qui n'existaient pas dans `document_repository.py` :

- ❌ `get_quarantine_documents()` → ✅ `get_all_quarantined_documents()`
- ❌ `get_quarantine_document()` → ✅ `get_quarantined_document()`
- ❌ `delete_quarantine_document()` → ✅ `delete_quarantined_document()`

### 2. Préfixes d'URL manquants
Les routers n'avaient pas le préfixe `/api` alors que le client faisait des appels vers `/api/*` :

- ❌ `prefix="/moderation"` → ✅ `prefix="/api/moderation"`
- ❌ `prefix="/auth"` → ✅ `prefix="/api/auth"`
- ❌ `prefix="/documents"` → ✅ `prefix="/api/documents"`

### 3. URLs incorrectes côté client
Certains fichiers client utilisaient `/api/admin/quarantine` au lieu de `/api/moderation/quarantine`.

## Fichiers Modifiés

### Backend (Python/FastAPI)

#### 1. `server/src/app/api/routers/moderation.py`
```python
# Corrections des noms de méthodes
- await document_repository.get_quarantine_documents()
+ await document_repository.get_all_quarantined_documents()

- await document_repository.get_quarantine_document(document_id)
+ await document_repository.get_quarantined_document(document_id)

- await document_repository.delete_quarantine_document(document_id)
+ await document_repository.delete_quarantined_document(document_id)

# Ajout du préfixe /api
- router = APIRouter(prefix="/moderation", tags=["moderation"])
+ router = APIRouter(prefix="/api/moderation", tags=["moderation"])
```

#### 2. `server/src/app/api/routers/auth.py`
```python
# Ajout du préfixe /api
- router = APIRouter(prefix="/auth", tags=["authentication"])
+ router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Correction de l'import manquant
- from datetime import datetime, timedelta
+ from datetime import datetime, timedelta, timezone
```

#### 3. `server/src/app/api/routers/documents.py`
```python
# Ajout du préfixe /api
- router = APIRouter(prefix="/documents", tags=["documents"])
+ router = APIRouter(prefix="/api/documents", tags=["documents"])
```

### Frontend (React)

#### 1. `client/src/pages/QuarantinePage.jsx`
```javascript
// Correction de l'URL
- fetch(`http://localhost:8000/api/admin/quarantine/${document_id}/moderate?action=${action}`)
+ fetch(`http://localhost:8000/api/moderation/quarantine/${document_id}/moderate?action=${action}`)
```

#### 2. `client/src/components/ModeratorValidationTable.jsx`
```javascript
// Correction de l'URL
- const url = `http://localhost:8000/api/admin/quarantine/${bookId}`;
+ const url = `http://localhost:8000/api/moderation/quarantine/${bookId}`;
```

## Endpoints Maintenant Disponibles

Tous les endpoints sont désormais accessibles avec le préfixe `/api` :

### Modération
- `GET /api/moderation/quarantine` - Liste tous les documents en quarantaine
- `GET /api/moderation/quarantine/{document_id}` - Récupère un document en quarantaine
- `POST /api/moderation/quarantine/{document_id}/approve` - Approuve un document
- `POST /api/moderation/quarantine/{document_id}/reject` - Rejette un document
- `POST /api/moderation/quarantine/{document_id}/moderate` - Modère un document (approve/reject)
- `GET /api/moderation/pending` - Liste les documents en attente
- `POST /api/moderation/{document_id}/approve` - Approuve un document normal
- `POST /api/moderation/{document_id}/reject` - Rejette un document normal

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Documents
- `GET /api/documents` - Liste tous les documents
- `GET /api/documents/{document_id}` - Récupère un document
- `GET /api/documents/uploader/{username}` - Documents d'un utilisateur

### Upload
- `POST /api/send-book` - Upload d'un PDF

## Vérification

Pour vérifier que tout fonctionne :

1. **Redémarrer le serveur FastAPI** si nécessaire
2. **Tester l'endpoint** :
   ```bash
   curl -H "Authorization: Bearer <token>" http://localhost:8000/api/moderation/quarantine
   ```
3. **Vérifier dans le client React** que la page Quarantine charge correctement

## Notes Importantes

- Le serveur doit être redémarré pour que les changements prennent effet
- Tous les endpoints nécessitent une authentification (token JWT)
- Les endpoints de quarantine nécessitent un rôle Admin
- Les endpoints de modération nécessitent un rôle Modérateur ou Admin

## Prochaines Étapes

Si le serveur est déjà en cours d'exécution, il faut le redémarrer pour appliquer les changements :

```bash
cd server
python -m uvicorn src.app.main:app --reload --port 8000
```

Ou avec l'outil de développement approprié.

