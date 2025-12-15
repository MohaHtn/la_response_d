### Déploiement client + serveur + Redis (Docker)

#### Prérequis
- Docker Desktop (ou Docker + docker compose v2)
- Ports libres: 5173 (client), 8000 (API), 6379 (Redis)

#### Structure ajoutée
- `docker-compose.yml` — orchestre Redis, l'API FastAPI et le client React
- `server/Dockerfile` — image de l'API (FastAPI + Uvicorn)
- `client/Dockerfile` — build Vite puis Nginx pour servir le front
- `client/nginx.conf` — conf Nginx pour SPA
- `scripts/deploy.ps1` — démarrer (Windows PowerShell)
- `scripts/down.ps1` — arrêter et nettoyer
- `.env.example` — variables d'environnement d'exemple

#### Utilisation rapide (Windows)
1. Copiez `.env.example` en `.env` à la racine et ajustez si besoin.
2. Démarrez:
   - PowerShell: `./scripts/deploy.ps1 -Build` (1ère fois) puis `./scripts/deploy.ps1`
3. Ouvrez:
   - Client: http://localhost:5173
   - API: http://localhost:8000 (docs Swagger: `/docs`)
   - Redis: localhost:6379

Pour arrêter et supprimer les volumes:
```
./scripts/down.ps1
```

#### Configuration
- Variables Redis consommées par l'API: `REDIS_HOST`, `REDIS_PORT`, `REDIS_DB`, `REDIS_PASSWORD`.
  - Par défaut en Docker: `REDIS_HOST=redis` (nom du service compose).
- Client: Si le front a besoin de l'URL API au build, utilisez `import.meta.env.VITE_API_BASE` côté React.
  - Compose exporte `VITE_API_BASE=http://localhost:8000`. Adaptez si reverse proxy/nom de domaine.

##### Secrets (Option B — recommandé)
- Placez vos secrets uniquement côté serveur dans un fichier `server/.env` (ne pas committer).
- Un exemple est fourni: `server/.env.example`. Copiez-le en `server/.env` et renseignez:
  - Clés API (ex: `PIXTRAL_API_KEY=...`, `GEMINI_API_KEY=...` si utilisé)
  - Sécurité: `JWT_SECRET_KEY=...`
  - (Optionnel) `REDIS_PASSWORD=...` si vous protégez Redis
- Le `docker-compose.yml` charge automatiquement `server/.env` via `env_file`.

#### Personnalisation des ports
Modifiez les mappings dans `docker-compose.yml`:
- `- "5173:80"` pour le client (hôte:conteneur)
- `- "8000:8000"` pour l'API
- `- "6379:6379"` pour Redis

#### Débogage
- Voir les logs: `docker compose logs -f server` ou `client` ou `redis`
- Tester la santé API: `curl http://localhost:8000/health`
- Tester Redis: `docker exec -it la_response_d-redis redis-cli ping`

#### Production (pistes)
- Ajouter un reverse proxy (Traefik, Nginx) avec TLS
- Stocker les secrets via fichier `server/.env` (Option B) ou via secrets Docker
- Build multi-arch si nécessaire
- Activer la persistance Redis (AOF activé par défaut dans ce compose)
