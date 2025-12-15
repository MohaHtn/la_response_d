# Paramétrage des variables d’environnement — Frontend

Créer un fichier `client/.env.example` avec:

```
VITE_API_BASE_URL=http://localhost:8000
```

Instructions:
- Copier `client/.env.example` en `client/.env` et ajuster la valeur selon l’environnement.
- Les variables `VITE_*` sont exposées côté client au build par Vite.
