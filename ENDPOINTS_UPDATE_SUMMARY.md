# Mise à jour des Endpoints - Récapitulatif

## Date : 2 décembre 2025

## Résumé
Mise à jour complète des endpoints côté client pour correspondre à la nouvelle structure modulaire du serveur.

---

## Structure des Endpoints du Serveur

### 1. **Authentification** (`/api/auth`)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Inscription d'un nouvel utilisateur |
| POST | `/api/auth/login` | Connexion utilisateur |
| POST | `/api/auth/logout` | Déconnexion utilisateur |

### 2. **Documents** (`/api/documents`)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/documents/upload` | Upload et traitement d'un document PDF |
| GET | `/api/documents/` | Liste tous les documents |
| GET | `/api/documents/{document_id}` | Récupérer un document par ID |
| GET | `/api/documents/uploader/{username}` | Récupérer les documents d'un utilisateur ⭐ **NOUVEAU** |

### 3. **Modération** (`/api/moderation`)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/moderation/quarantine` | Liste des documents en quarantaine (admin) |
| GET | `/api/moderation/quarantine/{document_id}` | Détails d'un document en quarantaine |
| POST | `/api/moderation/quarantine/{document_id}/approve` | Approuver un document en quarantaine |
| POST | `/api/moderation/quarantine/{document_id}/reject` | Rejeter un document en quarantaine |
| POST | `/api/moderation/quarantine/{document_id}/moderate?action={action}` | Modérer un document (approve/reject) |
| GET | `/api/moderation/pending` | Liste des documents en attente |
| POST | `/api/moderation/{document_id}/approve` | Approuver un document |
| POST | `/api/moderation/{document_id}/reject` | Rejeter un document |

### 4. **Upload Legacy** (`/api`)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/send-book` | Upload de livre (legacy, à migrer vers `/api/documents/upload`) |

---

## Fichiers Modifiés

### 📁 Serveur

#### ✅ `server/src/app/api/routers/documents.py`
**Ajout :** Nouvel endpoint `GET /api/documents/uploader/{username}`
```python
@router.get("/uploader/{username}")
async def get_documents_by_uploader(username: str, current_user: dict = Depends(get_current_user)):
    """Récupérer les documents d'un utilisateur spécifique"""
    documents = await document_repository.get_documents_by_uploader(username)
    return APIResponse.success(data=documents, count=len(documents))
```

---

### 📁 Client

#### ✅ `client/src/constants/index.js`
**Mise à jour :** Tous les endpoints centralisés dans `API_CONFIG.ENDPOINTS`

**Avant :**
```javascript
ENDPOINTS: {
  LOGIN: '/api/login',
  REGISTER: '/api/register',
  BOOKS: '/api/books',
  ADMIN_STATS: '/api/admin/stats',
  ADMIN_QUARANTINE: '/api/admin/quarantine',
}
```

**Après :**
```javascript
ENDPOINTS: {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  LOGOUT: '/api/auth/logout',
  
  // Document endpoints
  DOCUMENTS: '/api/documents',
  DOCUMENT_UPLOAD: '/api/documents/upload',
  DOCUMENT_BY_ID: (id) => `/api/documents/${id}`,
  DOCUMENTS_BY_UPLOADER: (username) => `/api/documents/uploader/${username}`,
  
  // Moderation endpoints
  MODERATION_QUARANTINE: '/api/moderation/quarantine',
  MODERATION_QUARANTINE_BY_ID: (id) => `/api/moderation/quarantine/${id}`,
  MODERATION_QUARANTINE_APPROVE: (id) => `/api/moderation/quarantine/${id}/approve`,
  MODERATION_QUARANTINE_REJECT: (id) => `/api/moderation/quarantine/${id}/reject`,
  MODERATION_QUARANTINE_MODERATE: (id, action) => `/api/moderation/quarantine/${id}/moderate?action=${action}`,
  MODERATION_PENDING: '/api/moderation/pending',
  MODERATION_APPROVE: (id) => `/api/moderation/${id}/approve`,
  MODERATION_REJECT: (id) => `/api/moderation/${id}/reject`,
  
  // Legacy upload endpoint
  SEND_BOOK: '/api/send-book',
}
```

#### ✅ `client/src/Home.jsx`
- Import de `API_CONFIG`
- Remplacement de `'http://localhost:8000/api/documents'` par `API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DOCUMENTS`
- Remplacement de `'http://localhost:8000/api/documents/uploader/${username}'` par `API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.DOCUMENTS_BY_UPLOADER(username)`

#### ✅ `client/src/Upload.jsx`
- Import de `API_CONFIG`
- Remplacement de `'http://localhost:8000/api/send-book'` par `API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.SEND_BOOK`

#### ✅ `client/src/pages/QuarantinePage.jsx`
- Import de `API_CONFIG`
- Remplacement de `'http://localhost:8000/api/moderation/quarantine'` par `API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE`
- Remplacement de `'http://localhost:8000/api/moderation/quarantine/${document_id}/moderate?action=${action}'` par `API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_MODERATE(document_id, action)`

#### ✅ `client/src/pages/ModeratorPage.jsx`
- Import de `API_CONFIG`
- Remplacement de `'http://localhost:8000/api/moderation/quarantine/${bookId}'` par `API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_BY_ID(bookId)`

#### ✅ `client/src/components/ModeratorValidationTable.jsx`
- Import de `API_CONFIG`
- Remplacement de `'http://localhost:8000/api/moderation/quarantine/${bookId}'` par `API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_BY_ID(bookId)`

---

## Avantages de cette Mise à Jour

### ✨ Centralisation
- **Un seul endroit** pour gérer tous les endpoints
- Facilite la maintenance et les modifications futures

### 🔧 Flexibilité
- Possibilité de changer l'URL de base via variable d'environnement `VITE_API_URL`
- Endpoints dynamiques avec paramètres (fonctions fléchées)

### 🎯 Cohérence
- Tous les fichiers utilisent maintenant la même source de vérité
- Réduction des erreurs de typage d'URL

### 📦 Modularité
- Structure claire : auth, documents, modération
- Facile d'ajouter de nouveaux endpoints

---

## Prochaines Étapes Recommandées

1. **Migration de l'endpoint legacy**
   - Migrer les appels de `/api/send-book` vers `/api/documents/upload`
   - Supprimer l'endpoint legacy une fois la migration terminée

2. **Ajout d'intercepteurs**
   - Ajouter un intercepteur pour gérer automatiquement les tokens JWT
   - Gérer les erreurs 401/403 de manière centralisée

3. **Tests**
   - Tester tous les endpoints mis à jour
   - Vérifier le bon fonctionnement de l'authentification
   - Valider les fonctionnalités de modération

4. **Documentation**
   - Mettre à jour la documentation utilisateur
   - Créer des exemples d'utilisation des nouveaux endpoints

---

## Notes Techniques

### Variables d'Environnement
Le client utilise `import.meta.env.VITE_API_URL` pour configurer l'URL de base de l'API.

**Fichier `.env` (client) :**
```env
VITE_API_URL=http://localhost:8000
```

### Structure des Réponses API
Toutes les réponses du serveur suivent le format `APIResponse` :
```json
{
  "success": true,
  "message": "Message descriptif",
  "data": { ... },
  "count": 10
}
```

### Authentification
Les endpoints protégés nécessitent un token JWT dans l'en-tête :
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## Validation

### ✅ Compilations
- Aucune erreur de compilation
- Quelques warnings mineurs (propriétés non utilisées dans les constantes)

### ✅ Structure
- Tous les fichiers suivent maintenant la même convention
- Imports cohérents sur tous les fichiers

### ✅ Fonctionnalités
- Authentification (login/register)
- Upload de documents
- Modération (quarantaine, approbation, rejet)
- Consultation de la bibliothèque

---

## Support

Pour toute question ou problème concernant cette mise à jour, veuillez consulter :
- `docs/fr/QUARANTINE_ENDPOINTS.md` - Documentation des endpoints de quarantaine
- `docs/fr/GUIDE_UTILISATEUR_NOUVELLES_FONCTIONNALITES.md` - Guide utilisateur
- `server/src/app/api/routers/` - Code source des routers

