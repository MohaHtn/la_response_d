# Tests des Endpoints - Guide de Validation

## 🔍 Comment tester les endpoints mis à jour

### Prérequis
1. Serveur FastAPI démarré : `uvicorn server.src.app.main:app --reload`
2. Client React démarré : `npm run dev` (dans le dossier client)
3. Redis en cours d'exécution

---

## 📝 Tests par Catégorie

### 1. Authentification (`/api/auth`)

#### Test 1.1 : Inscription
**Endpoint :** `POST /api/auth/register`

**Depuis le client :**
```javascript
// Dans la console du navigateur
const response = await fetch('http://localhost:8000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  })
});
console.log(await response.json());
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Utilisateur enregistré avec succès",
  "data": {
    "username": "testuser",
    "email": "test@example.com",
    "account_type": "USER"
  }
}
```

#### Test 1.2 : Connexion
**Endpoint :** `POST /api/auth/login`

**Depuis le client :**
```javascript
const response = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'testuser',
    password: 'password123'
  })
});
const data = await response.json();
console.log(data);
// Sauvegarder le token pour les tests suivants
localStorage.setItem('authToken', data.data.token);
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": {
      "username": "testuser",
      "email": "test@example.com",
      "account_type": "USER"
    }
  }
}
```

---

### 2. Documents (`/api/documents`)

#### Test 2.1 : Liste des documents
**Endpoint :** `GET /api/documents/`

**Depuis le client :**
```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('http://localhost:8000/api/documents/', {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log(await response.json());
```

#### Test 2.2 : Documents d'un utilisateur
**Endpoint :** `GET /api/documents/uploader/{username}`

**Depuis le client :**
```javascript
const token = localStorage.getItem('authToken');
const username = 'testuser';
const response = await fetch(`http://localhost:8000/api/documents/uploader/${username}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log(await response.json());
```

**Réponse attendue :**
```json
{
  "success": true,
  "data": [
    {
      "document_id": "doc_123",
      "metadata": {
        "title": "Mon Document",
        "author": "Test Author"
      },
      "uploader": {
        "username": "testuser"
      }
    }
  ],
  "count": 1
}
```

#### Test 2.3 : Upload d'un document
**Endpoint :** `POST /api/documents/upload`

**Depuis l'interface client :**
1. Aller sur `/upload`
2. Sélectionner un fichier PDF
3. Remplir les métadonnées (titre, auteur)
4. Cliquer sur "Envoyer"

**OU depuis le code :**
```javascript
const formData = new FormData();
formData.append('file', pdfFile); // pdfFile est un objet File
formData.append('title', 'Titre du document');
formData.append('author', 'Auteur');

const token = localStorage.getItem('authToken');
const response = await fetch('http://localhost:8000/api/documents/upload', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: formData
});
console.log(await response.json());
```

---

### 3. Modération (`/api/moderation`)

#### Test 3.1 : Liste des documents en quarantaine (ADMIN uniquement)
**Endpoint :** `GET /api/moderation/quarantine`

**Prérequis :** Être connecté en tant qu'admin

**Depuis le client :**
```javascript
const token = localStorage.getItem('authToken');
const response = await fetch('http://localhost:8000/api/moderation/quarantine', {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log(await response.json());
```

**Réponse attendue :**
```json
{
  "success": true,
  "data": [
    {
      "document_id": "quarantine_123",
      "metadata": { "title": "Document suspect" },
      "compliance_issues": ["Injection de prompt détectée"],
      "moderation": {
        "approval_process": {
          "status": "QUARANTINED"
        }
      }
    }
  ],
  "count": 1
}
```

#### Test 3.2 : Détails d'un document en quarantaine
**Endpoint :** `GET /api/moderation/quarantine/{document_id}`

**Depuis le client :**
```javascript
const token = localStorage.getItem('authToken');
const docId = 'quarantine_123';
const response = await fetch(`http://localhost:8000/api/moderation/quarantine/${docId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log(await response.json());
```

#### Test 3.3 : Approuver un document en quarantaine
**Endpoint :** `POST /api/moderation/quarantine/{document_id}/moderate?action=approve`

**Depuis l'interface client :**
1. Aller sur `/admin/quarantine`
2. Cliquer sur "✅ Approuver" sur un document

**OU depuis le code :**
```javascript
const token = localStorage.getItem('authToken');
const docId = 'quarantine_123';
const response = await fetch(`http://localhost:8000/api/moderation/quarantine/${docId}/moderate?action=approve`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log(await response.json());
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Document approuvé et déplacé vers la bibliothèque",
  "data": {
    "document_id": "quarantine_123"
  }
}
```

#### Test 3.4 : Rejeter un document en quarantaine
**Endpoint :** `POST /api/moderation/quarantine/{document_id}/moderate?action=reject`

**Depuis l'interface client :**
1. Aller sur `/admin/quarantine`
2. Cliquer sur "🗑️ Rejeter" sur un document

---

### 4. Legacy Upload (`/api/send-book`)

#### Test 4.1 : Upload via l'endpoint legacy
**Endpoint :** `POST /api/send-book`

**Note :** Cet endpoint est maintenu pour compatibilité mais devrait être migré vers `/api/documents/upload`

**Depuis l'interface client :**
- Utiliser la page `/upload` qui utilise encore cet endpoint

---

## 🧪 Tests d'Intégration Complète

### Scénario 1 : Inscription → Connexion → Upload → Consultation

```javascript
// 1. Inscription
const register = await fetch('http://localhost:8000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'inttest',
    email: 'int@test.com',
    password: 'test123'
  })
});
console.log('Inscription:', await register.json());

// 2. Connexion
const login = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'inttest',
    password: 'test123'
  })
});
const loginData = await login.json();
const token = loginData.data.token;
console.log('Connexion:', loginData);

// 3. Consulter ses documents (devrait être vide)
const myDocs = await fetch('http://localhost:8000/api/documents/uploader/inttest', {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log('Mes documents:', await myDocs.json());

// 4. Upload d'un document (via l'interface)
// ...

// 5. Re-consulter ses documents (devrait contenir 1 document)
const myDocsAfter = await fetch('http://localhost:8000/api/documents/uploader/inttest', {
  headers: { 'Authorization': `Bearer ${token}` }
});
console.log('Mes documents après upload:', await myDocsAfter.json());
```

### Scénario 2 : Admin → Quarantaine → Modération

```javascript
// 1. Connexion admin
const adminLogin = await fetch('http://localhost:8000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin_password'
  })
});
const adminData = await adminLogin.json();
const adminToken = adminData.data.token;

// 2. Liste des documents en quarantaine
const quarantine = await fetch('http://localhost:8000/api/moderation/quarantine', {
  headers: { 'Authorization': `Bearer ${adminToken}` }
});
const quarantineData = await quarantine.json();
console.log('Quarantaine:', quarantineData);

// 3. Approuver le premier document
if (quarantineData.data.length > 0) {
  const docId = quarantineData.data[0].document_id;
  const approve = await fetch(`http://localhost:8000/api/moderation/quarantine/${docId}/moderate?action=approve`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  console.log('Approbation:', await approve.json());
}
```

---

## 🛠️ Outils de Test

### 1. Swagger UI
Accéder à `http://localhost:8000/docs` pour tester interactivement tous les endpoints

### 2. Console du Navigateur
Copier-coller les scripts de test ci-dessus directement dans la console

### 3. Postman / Thunder Client
Importer la collection d'endpoints pour des tests plus structurés

### 4. Tests Automatisés
Exécuter les tests Python :
```bash
cd server
pytest src/app/tests/
```

---

## ✅ Checklist de Validation

- [ ] Inscription fonctionne
- [ ] Connexion fonctionne et retourne un token
- [ ] Liste des documents accessible avec token
- [ ] Documents filtrés par uploader fonctionnent
- [ ] Upload de document fonctionne
- [ ] Quarantaine accessible pour admin
- [ ] Approbation de document fonctionne
- [ ] Rejet de document fonctionne
- [ ] Tous les endpoints utilisent `API_CONFIG` côté client
- [ ] Aucune URL en dur dans le code client

---

## 🐛 Dépannage

### Erreur 401 Unauthorized
- Vérifier que le token est bien présent dans localStorage
- Vérifier que le token n'est pas expiré
- Se reconnecter si nécessaire

### Erreur 403 Forbidden
- Vérifier les permissions utilisateur (admin/moderator/user)
- Certains endpoints sont réservés aux admins

### Erreur 404 Not Found
- Vérifier que l'endpoint existe côté serveur
- Vérifier l'URL complète (base + endpoint)
- Consulter `ENDPOINTS_UPDATE_SUMMARY.md` pour la liste complète

### CORS Error
- Vérifier que le serveur FastAPI a CORS configuré
- Vérifier que l'origine du client est autorisée

---

## 📚 Ressources

- Documentation API : `http://localhost:8000/docs`
- Résumé des endpoints : `ENDPOINTS_UPDATE_SUMMARY.md`
- Documentation quarantaine : `docs/fr/QUARANTINE_ENDPOINTS.md`

