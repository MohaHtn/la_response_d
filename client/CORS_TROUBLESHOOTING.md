# Guide de Dépannage CORS

## Problème CORS dans Bibliothéko

Ce guide vous aide à résoudre les erreurs CORS courantes dans l'application Bibliothéko.

### Symptômes des erreurs CORS

- Messages d'erreur dans la console du navigateur du type :
  - `Access to fetch at '...' from origin '...' has been blocked by CORS policy`
  - `Cross-Origin Request Blocked`
  - `Failed to fetch`

### Solutions mises en place

#### 1. Configuration serveur (FastAPI)

Le fichier `server/src/app/main.py` a été configuré avec :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Authorization",
        "Content-Type", 
        "Accept",
        "Origin",
        "X-Requested-With",
        "Username",
    ],
)
```

#### 2. Configuration client (Vite)

Le fichier `vite.config.js` inclut un proxy pour éviter les problèmes CORS en développement :

```javascript
server: {
  proxy: {
    '/api': 'http://localhost:8000',
    '/auth': 'http://localhost:8000',
    '/documents': 'http://localhost:8000',
    '/moderation': 'http://localhost:8000',
    '/setup': 'http://localhost:8000',
    '/health': 'http://localhost:8000',
  }
}
```

#### 3. Service API amélioré

Le fichier `src/services/api.js` gère mieux les erreurs CORS avec :
- Mode CORS explicite
- Credentials included
- Messages d'erreur plus clairs

### Vérifications à effectuer

1. **Serveur backend démarré** : Vérifiez que le serveur FastAPI tourne sur le port 8000
   ```bash
   curl http://localhost:8000/health
   ```

2. **Variables d'environnement** : Vérifiez le fichier `.env` :
   ```
   VITE_API_URL=http://localhost:8000
   ```

3. **Ports corrects** :
   - Client Vite : port 5173
   - Serveur FastAPI : port 8000

### Commandes de démarrage

1. **Démarrer le serveur backend** (depuis le dossier server) :
   ```bash
   uvicorn src.app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

2. **Démarrer le client** (depuis le dossier client) :
   ```bash
   npm run dev
   # ou
   ./start-dev.sh
   ```

### Problèmes courants et solutions

#### Erreur "Failed to fetch"
- Vérifiez que le serveur backend est démarré
- Vérifiez l'URL dans `VITE_API_URL`

#### Erreur "CORS policy"
- Vérifiez que le port client est dans la liste `allow_origins` du serveur
- Redémarrez le serveur backend après modification de la config CORS

#### Erreur "Network Error"
- Vérifiez la connexion réseau
- Testez l'endpoint directement avec curl

### Mode production

En production, remplacez dans `allow_origins` :
```python
allow_origins=["https://votre-domaine.com"]
```

### Contact

Si le problème persiste, vérifiez :
1. Les logs du serveur backend
2. La console du navigateur
3. L'onglet Network des DevTools
