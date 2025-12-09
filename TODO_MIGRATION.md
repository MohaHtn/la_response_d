# TODO - Prochaines Étapes de Migration

## 🎯 Objectif
Compléter la migration des endpoints et améliorer la structure de l'application.

---

## ✅ Terminé

- [x] Centralisation des endpoints dans `constants/index.js`
- [x] Ajout de l'endpoint `/api/documents/uploader/{username}` côté serveur
- [x] Mise à jour de tous les fichiers client pour utiliser `API_CONFIG`
- [x] Documentation de la mise à jour (`ENDPOINTS_UPDATE_SUMMARY.md`)
- [x] Guide de tests (`TEST_ENDPOINTS.md`)

---

## 🔄 En Cours / À Faire

### 1. Migration de l'endpoint Legacy

#### Objectif
Migrer `/api/send-book` vers `/api/documents/upload`

#### Actions
- [ ] **Mettre à jour `Upload.jsx`**
  - Modifier l'appel pour utiliser `/api/documents/upload` au lieu de `/api/send-book`
  - Adapter le format de la réponse si nécessaire
  
- [ ] **Tester la nouvelle implémentation**
  - Vérifier que l'upload fonctionne correctement
  - Valider que les métadonnées sont bien enregistrées
  - Tester avec des documents conformes et non conformes
  
- [ ] **Déprécier l'ancien endpoint**
  - Ajouter un warning dans les logs quand `/api/send-book` est utilisé
  - Documenter la dépréciation
  
- [ ] **Supprimer l'ancien endpoint** (après validation complète)
  - Supprimer `upload.py` du dossier routers
  - Retirer l'import dans `main.py`

**Fichiers concernés :**
- `client/src/Upload.jsx`
- `server/src/app/api/routers/upload.py` (à supprimer)
- `server/src/app/main.py`

---

### 2. Amélioration du Service API

#### Objectif
Créer un service API plus robuste avec gestion automatique des tokens et erreurs

#### Actions
- [ ] **Créer un service documentService.js**
  ```javascript
  // client/src/services/document.service.js
  import { api } from './api';
  import { API_CONFIG } from '../constants';

  export const documentService = {
    getAll: () => api.get(API_CONFIG.ENDPOINTS.DOCUMENTS),
    getById: (id) => api.get(API_CONFIG.ENDPOINTS.DOCUMENT_BY_ID(id)),
    getByUploader: (username) => api.get(API_CONFIG.ENDPOINTS.DOCUMENTS_BY_UPLOADER(username)),
    upload: (formData) => api.postFormData(API_CONFIG.ENDPOINTS.DOCUMENT_UPLOAD, formData),
  };
  ```

- [ ] **Créer un service moderationService.js**
  ```javascript
  // client/src/services/moderation.service.js
  import { api } from './api';
  import { API_CONFIG } from '../constants';

  export const moderationService = {
    getQuarantine: () => api.get(API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE),
    getQuarantineById: (id) => api.get(API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_BY_ID(id)),
    moderate: (id, action) => api.post(API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_MODERATE(id, action)),
    getPending: () => api.get(API_CONFIG.ENDPOINTS.MODERATION_PENDING),
  };
  ```

- [ ] **Ajouter une méthode postFormData dans api.js**
  ```javascript
  postFormData: (endpoint, formData, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // Ne pas définir Content-Type pour FormData
        ...options.headers,
        'Content-Type': undefined,
      },
    }),
  ```

- [ ] **Refactorer les composants pour utiliser ces services**
  - `Home.jsx` → `documentService.getAll()` et `documentService.getByUploader()`
  - `Upload.jsx` → `documentService.upload()`
  - `QuarantinePage.jsx` → `moderationService.getQuarantine()`, `moderationService.moderate()`
  - `ModeratorPage.jsx` → `moderationService.getQuarantineById()`

**Fichiers à créer :**
- `client/src/services/document.service.js`
- `client/src/services/moderation.service.js`

**Fichiers à modifier :**
- `client/src/services/api.js`
- `client/src/services/index.js`
- `client/src/Home.jsx`
- `client/src/Upload.jsx`
- `client/src/pages/QuarantinePage.jsx`
- `client/src/pages/ModeratorPage.jsx`

---

### 3. Gestion des Erreurs Améliorée

#### Objectif
Améliorer la gestion des erreurs et des réponses API

#### Actions
- [ ] **Créer un intercepteur d'erreurs**
  ```javascript
  // client/src/services/interceptors.js
  export const handleApiError = (error) => {
    if (error.message.includes('401')) {
      // Token expiré, rediriger vers login
      localStorage.clear();
      window.location.href = '/auth';
    } else if (error.message.includes('403')) {
      // Pas les permissions
      alert('Vous n\'avez pas les permissions nécessaires');
    } else if (error.message.includes('404')) {
      // Ressource introuvable
      console.error('Ressource introuvable');
    }
    return error;
  };
  ```

- [ ] **Intégrer l'intercepteur dans api.js**
  
- [ ] **Ajouter un composant ErrorBoundary**
  ```javascript
  // client/src/components/ErrorBoundary.jsx
  ```

- [ ] **Utiliser le composant dans main.jsx**

**Fichiers à créer :**
- `client/src/services/interceptors.js`
- `client/src/components/ErrorBoundary.jsx`

**Fichiers à modifier :**
- `client/src/services/api.js`
- `client/src/main.jsx`

---

### 4. Tests Automatisés

#### Objectif
Ajouter des tests pour valider les endpoints

#### Actions
- [ ] **Tests backend (Python)**
  - Tester tous les endpoints d'authentification
  - Tester tous les endpoints de documents
  - Tester tous les endpoints de modération
  - Ajouter des tests d'intégration

- [ ] **Tests frontend (Vitest/Jest)**
  - Tester les services (mocked)
  - Tester les composants avec les appels API
  - Tester les flux d'authentification

**Fichiers à créer :**
- `server/src/app/tests/test_auth_routes.py`
- `server/src/app/tests/test_document_routes.py`
- `server/src/app/tests/test_moderation_routes.py`
- `client/src/tests/services/document.service.test.js`
- `client/src/tests/services/moderation.service.test.js`

---

### 5. Documentation

#### Objectif
Compléter la documentation de l'API

#### Actions
- [ ] **Mettre à jour la documentation OpenAPI**
  - Ajouter des exemples de requêtes/réponses
  - Documenter les codes d'erreur
  - Ajouter des descriptions détaillées

- [ ] **Créer un guide de migration pour les développeurs**
  - Comment migrer de l'ancien système au nouveau
  - Exemples de code avant/après

- [ ] **Mettre à jour le README**
  - Ajouter la section sur les nouveaux endpoints
  - Mettre à jour les exemples d'utilisation

**Fichiers à créer/modifier :**
- `docs/fr/GUIDE_MIGRATION_ENDPOINTS.md`
- `README.md`
- Annotations dans les fichiers de routes (docstrings)

---

### 6. Optimisations

#### Objectif
Améliorer les performances et l'expérience utilisateur

#### Actions
- [ ] **Ajouter un cache côté client**
  - Utiliser React Query ou SWR
  - Mettre en cache les listes de documents
  - Invalidation intelligente du cache

- [ ] **Ajouter du loading state**
  - Skeleton loaders pour les listes
  - Progress bars pour les uploads
  - Toast notifications pour les actions

- [ ] **Optimiser les requêtes**
  - Pagination côté serveur
  - Filtrage côté serveur
  - Recherche côté serveur

**Fichiers à créer/modifier :**
- Configuration de React Query (si utilisé)
- Composants de loading (Skeleton, ProgressBar)
- Endpoints avec pagination

---

### 7. Sécurité

#### Objectif
Renforcer la sécurité de l'application

#### Actions
- [ ] **Validation des entrées**
  - Valider tous les paramètres d'URL
  - Sanitizer les données utilisateur
  - Limiter la taille des uploads

- [ ] **Rate limiting**
  - Limiter le nombre de requêtes par IP
  - Limiter les tentatives de connexion

- [ ] **Logging et monitoring**
  - Logger toutes les actions sensibles
  - Monitorer les erreurs
  - Alertes sur les comportements suspects

**Fichiers à créer/modifier :**
- Middleware de rate limiting
- Service de logging
- Configuration de monitoring

---

## 📊 Priorités

### 🔴 Haute Priorité
1. Migration de l'endpoint legacy `/api/send-book`
2. Tests des nouveaux endpoints
3. Gestion des erreurs améliorée

### 🟡 Moyenne Priorité
4. Services API modulaires
5. Documentation complète
6. Tests automatisés

### 🟢 Basse Priorité
7. Optimisations (cache, pagination)
8. Sécurité avancée (rate limiting)

---

## 📝 Notes

### Ordre Recommandé
1. Valider que tout fonctionne avec les endpoints actuels
2. Migrer l'endpoint legacy
3. Créer les services modulaires
4. Améliorer la gestion des erreurs
5. Ajouter les tests
6. Optimiser et sécuriser

### Estimation du Temps
- Migration endpoint legacy : 2-3h
- Services modulaires : 4-5h
- Gestion des erreurs : 2-3h
- Tests automatisés : 6-8h
- Documentation : 3-4h
- Optimisations : 5-6h
- **Total estimé : 22-29h**

---

## 🤝 Contribution

Pour contribuer à ces tâches :
1. Choisir une tâche dans la liste
2. Créer une branche : `git checkout -b feature/nom-de-la-tache`
3. Implémenter les changements
4. Tester localement
5. Créer une pull request

---

## 📞 Contact

Pour toute question sur cette roadmap, consulter :
- `ENDPOINTS_UPDATE_SUMMARY.md` - Vue d'ensemble des changements
- `TEST_ENDPOINTS.md` - Guide de test
- Documentation technique dans `docs/`

