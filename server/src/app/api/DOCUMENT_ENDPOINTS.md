# Endpoints API pour les Documents

Ce document décrit tous les endpoints API disponibles pour la gestion des documents.

## Base URL
```
/api/documents
```

## Endpoints

### 1. Créer un document
**POST** `/api/documents`

Crée un nouveau document dans le système.

**Body (JSON):**
```json
{
  "metadata": {
    "title": "Titre du document",
    "author": "Auteur",
    "parution_date": "2024-01-01",
    "is_appropriate": "yes",
    "is_harmful": false
  },
  "uploader": {
    "username": "nom_utilisateur",
    "upload_date": "2024-01-01T10:00:00"
  },
  "moderation": {
    "approval_process": {
      "status": "WAITING",
      "date": "2024-01-01T10:00:00",
      "details": "En attente de modération"
    },
    "approved_by": []
  },
  "markdown": {
    "content": "# Contenu\n\nContenu du document en markdown"
  }
}
```

**Réponse (201):**
```json
{
  "message": "Document créé avec succès.",
  "document_id": "doc_20240101100000_1"
}
```

---

### 2. Récupérer un document
**GET** `/api/documents/{document_id}`

Récupère un document par son ID.

**Paramètres:**
- `document_id` (path) : L'ID du document

**Réponse (200):**
```json
{
  "document_id": "doc_20240101100000_1",
  "metadata": { ... },
  "uploader": { ... },
  "moderation": { ... },
  "markdown": { ... }
}
```

**Réponse (404):**
```json
{
  "detail": "Document introuvable."
}
```

---

### 3. Récupérer tous les documents
**GET** `/api/documents`

Récupère la liste de tous les documents.

**Réponse (200):**
```json
{
  "count": 10,
  "documents": [
    { ... },
    { ... }
  ]
}
```

---

### 4. Récupérer les documents par statut
**GET** `/api/documents/status/{status}`

Récupère les documents filtrés par statut de modération.

**Paramètres:**
- `status` (path) : Le statut de modération
  - `WAITING` : En attente
  - `IN_APPROVAL` : En cours d'approbation
  - `OK` : Approuvé
  - `NOK` : Rejeté

**Réponse (200):**
```json
{
  "status": "WAITING",
  "count": 5,
  "documents": [
    { ... },
    { ... }
  ]
}
```

---

### 5. Récupérer les documents par utilisateur
**GET** `/api/documents/uploader/{username}`

Récupère tous les documents uploadés par un utilisateur spécifique.

**Paramètres:**
- `username` (path) : Le nom d'utilisateur

**Réponse (200):**
```json
{
  "uploader": "nom_utilisateur",
  "count": 3,
  "documents": [
    { ... },
    { ... }
  ]
}
```

---

### 6. Rechercher des documents
**GET** `/api/documents/search`

Recherche des documents par titre et/ou auteur.

**Paramètres de requête:**
- `title` (query, optionnel) : Titre à rechercher
- `author` (query, optionnel) : Auteur à rechercher

Au moins un paramètre doit être fourni.

**Exemple:**
```
/api/documents/search?title=biologie
/api/documents/search?author=caullery
/api/documents/search?title=biologie&author=caullery
```

**Réponse (200):**
```json
{
  "search_criteria": {
    "title": "biologie",
    "author": "caullery"
  },
  "count": 2,
  "documents": [
    { ... },
    { ... }
  ]
}
```

**Réponse (400):**
```json
{
  "detail": "Au moins un critère de recherche (titre ou auteur) doit être fourni."
}
```

---

### 7. Mettre à jour un document
**PUT** `/api/documents/{document_id}`

Met à jour un document existant.

**Paramètres:**
- `document_id` (path) : L'ID du document

**Body (JSON):**
Vous pouvez envoyer une mise à jour partielle. Les champs imbriqués sont fusionnés.

```json
{
  "moderation": {
    "approval_process": {
      "status": "OK",
      "date": "2024-01-02T15:00:00",
      "details": "Document approuvé"
    },
    "approved_by": ["moderateur1", "moderateur2"]
  }
}
```

**Réponse (200):**
```json
{
  "message": "Document mis à jour avec succès.",
  "document_id": "doc_20240101100000_1"
}
```

**Réponse (404):**
```json
{
  "detail": "Document introuvable."
}
```

---

### 8. Supprimer un document
**DELETE** `/api/documents/{document_id}`

Supprime un document du système.

**Paramètres:**
- `document_id` (path) : L'ID du document

**Réponse (200):**
```json
{
  "message": "Document supprimé avec succès.",
  "document_id": "doc_20240101100000_1"
}
```

**Réponse (404):**
```json
{
  "detail": "Document introuvable."
}
```

---

## Codes d'erreur

- **200** : Succès
- **201** : Créé avec succès
- **400** : Requête invalide
- **404** : Ressource introuvable
- **500** : Erreur serveur interne

## Notes

- Tous les endpoints sont préfixés par `/api`
- Les dates doivent être au format ISO 8601 (YYYY-MM-DDTHH:MM:SS)
- Les recherches de texte sont insensibles à la casse
- Les mises à jour de documents fusionnent les dictionnaires imbriqués

