# Guide de Déploiement - La Réponse D

## Table des matières
1. [Prérequis](#prérequis)
2. [Développement local](#développement-local)
3. [Déploiement Docker](#déploiement-docker)
4. [Déploiement production avec GitHub Actions](#déploiement-production)
5. [Résolution des problèmes](#résolution-des-problèmes)

---

## Prérequis

### Développement local
- Python 3.12 ou supérieur
- Node.js 18 ou supérieur
- Redis (optionnel pour le dev local)

### Déploiement Docker
- Docker 24.0 ou supérieur
- Docker Compose V2

### Production
- Serveur Linux (Ubuntu 22.04 LTS recommandé)
- Accès SSH configuré
- GitHub Actions configuré avec les secrets nécessaires

---

## Développement local

### Configuration du serveur

1. **Créer le fichier de configuration** :
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Configurer les variables d'environnement dans `server/.env`** :
   ```env
   # Clés API (obligatoire)
   GEMINI_API_KEY=votre_cle_gemini
   PIXTRAL_API_KEY=votre_cle_pixtral
   
   # Sécurité (obligatoire)
   JWT_SECRET_KEY=un_secret_tres_long_et_aleatoire
   JWT_EXPIRATION_HOURS=24
   
   # Redis (optionnel en dev)
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_DB=0
   REDIS_PASSWORD=
   
   # Application
   MAX_FILE_SIZE_MB=200
   ENVIRONMENT=development
   DEBUG=True
   ```

3. **Installer les dépendances** :
   ```bash
   pip install -r requirements.txt
   ```

4. **Démarrer le serveur** :
   ```bash
   # Option 1 : Avec le script de démarrage
   python run_dev.py
   
   # Option 2 : Directement avec uvicorn
   cd src
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Vérifier le bon fonctionnement** :
   - API : http://localhost:8000
   - Documentation : http://localhost:8000/docs
   - Health check : http://localhost:8000/health

### Configuration du client

1. **Installer les dépendances** :
   ```bash
   cd client
   npm install
   ```

2. **Démarrer le serveur de développement** :
   ```bash
   npm run dev
   ```

3. **Accéder à l'application** :
   - Client : http://localhost:5173
   - Les requêtes API seront proxifiées vers le serveur backend

---

## Déploiement Docker

### Configuration

1. **Créer le fichier `.env` pour le serveur** (même contenu que pour le dev local) :
   ```bash
   cd server
   cp .env.example .env
   # Éditer .env avec vos vraies valeurs
   ```

2. **Configurer les variables Redis** :
   Le fichier `docker-compose.yml` configure automatiquement Redis. Dans votre `server/.env`, assurez-vous d'avoir :
   ```env
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_DB=0
   REDIS_PASSWORD=
   ```

### Démarrage

1. **Build et démarrage des conteneurs** :
   ```bash
   docker compose up -d --build
   ```

2. **Vérifier les logs** :
   ```bash
   # Tous les services
   docker compose logs -f
   
   # Serveur uniquement
   docker compose logs -f server
   
   # Client uniquement
   docker compose logs -f client
   
   # Redis uniquement
   docker compose logs -f redis
   ```

3. **Vérifier le statut** :
   ```bash
   docker compose ps
   ```

4. **Tester l'application** :
   - Application complète : http://localhost:5187
   - Health check : http://localhost:5187/health

### Commandes utiles

```bash
# Arrêter les conteneurs
docker compose down

# Rebuild un service spécifique
docker compose build server
docker compose build client

# Redémarrer un service
docker compose restart server

# Voir les logs en temps réel
docker compose logs -f

# Nettoyer les ressources Docker
docker system prune -f

# Supprimer les volumes (attention : perte de données Redis)
docker compose down -v
```

---

## Déploiement production

### Configuration GitHub Actions

Le déploiement en production se fait automatiquement via GitHub Actions lors d'un push sur la branche `main`.

#### Secrets GitHub à configurer

Allez dans Settings > Secrets and variables > Actions et ajoutez :

| Secret | Description | Exemple |
|--------|-------------|---------|
| `SERVER_HOST` | Adresse IP ou nom de domaine du serveur | `192.168.1.100` |
| `SERVER_USER` | Nom d'utilisateur SSH | `mohahtn` |
| `SSH_PRIVATE_KEY` | Clé privée SSH pour l'accès au serveur | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| `GEMINI_API_KEY` | Clé API Google Gemini | `AI...` |
| `PIXTRAL_API_KEY` | Clé API Mistral Pixtral | `...` |
| `JWT_SECRET_KEY` | Secret pour les tokens JWT | Générer avec `openssl rand -hex 32` |
| `JWT_EXPIRATION_HOURS` | Durée de validité des tokens | `24` |

#### Workflow de déploiement

Le fichier `.github/workflows/deploy.yml` automatise :
1. Connexion SSH au serveur
2. Pull des dernières modifications
3. Création du fichier `.env` avec les secrets
4. Build et démarrage des conteneurs Docker
5. Nettoyage des ressources Docker inutilisées

### Configuration du serveur de production

1. **Prérequis sur le serveur** :
   ```bash
   # Installer Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Ajouter l'utilisateur au groupe docker
   sudo usermod -aG docker $USER
   
   # Installer Docker Compose V2
   # (inclus avec Docker depuis la version 24.0)
   ```

2. **Cloner le projet** :
   ```bash
   cd ~
   git clone https://github.com/votre-username/la_response_d.git
   cd la_response_d
   ```

3. **Premier déploiement manuel** :
   ```bash
   # Le fichier .env sera créé automatiquement par GitHub Actions
   # Mais pour un premier test manuel :
   cd server
   nano .env
   # Copier les valeurs nécessaires
   
   cd ..
   docker compose up -d --build
   ```

### Vérification du déploiement

```bash
# Sur le serveur
docker compose ps
docker compose logs -f server

# Test depuis votre machine locale
curl http://votre-serveur:5187/health
```

---

## Résolution des problèmes

### Erreur : `ImportError: cannot import name 'auth_router'`

**Cause** : Fichier `__init__.py` manquant ou imports incorrects.

**Solution** : Vérifiez que les corrections ont été appliquées (voir `docs/fr/RESOLUTION_IMPORT_ERROR.md`).

### Erreur : `PIXTRAL_API_KEY n'est pas définie`

**Cause** : Variables d'environnement manquantes.

**Solution** :
```bash
# Développement local
cd server
nano .env
# Ajouter PIXTRAL_API_KEY=votre_cle

# Production Docker
# Vérifier que le secret GitHub est configuré
# Ou créer manuellement le fichier .env sur le serveur
```

### Erreur : `Connection refused` (Redis)

**Cause** : Redis n'est pas démarré ou mal configuré.

**Solution** :
```bash
# En Docker
docker compose up -d redis
docker compose logs redis

# En développement local
# Installer et démarrer Redis
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### Erreur : Build Docker échoue

**Solution** :
```bash
# Nettoyer le cache Docker
docker builder prune

# Rebuild sans cache
docker compose build --no-cache

# Vérifier les logs de build
docker compose build --progress=plain
```

### Port déjà utilisé

**Solution** :
```bash
# Trouver le processus utilisant le port
sudo lsof -i :5187

# Arrêter l'ancien conteneur
docker compose down

# Ou changer le port dans docker-compose.yml
```

### Test complet du système

```bash
# Script de test des imports (sur le serveur)
cd server/src
python test_imports.py

# Test de connexion Redis
docker compose exec server python -c "from app.infra.database import redis_manager; print(redis_manager.ping())"

# Test des API endpoints
curl http://localhost:5187/health
curl http://localhost:5187/api/
```

---

## Logs et monitoring

### Consulter les logs

```bash
# Logs de tous les services
docker compose logs -f

# Logs d'un service spécifique avec horodatage
docker compose logs -f --timestamps server

# Dernières 100 lignes
docker compose logs --tail=100 server
```

### Monitoring Redis

```bash
# Entrer dans le conteneur Redis
docker compose exec redis redis-cli

# Commandes Redis utiles
> PING
> INFO
> KEYS *
> DBSIZE
```

### Monitoring du serveur

```bash
# Statistiques des conteneurs
docker stats

# Espace disque utilisé par Docker
docker system df

# Voir les processus dans un conteneur
docker compose exec server ps aux
```

---

## Maintenance

### Mise à jour de l'application

```bash
git pull origin main
docker compose down
docker compose up -d --build
```

### Sauvegarde des données Redis

```bash
# Créer une sauvegarde
docker compose exec redis redis-cli SAVE

# Copier le fichier de sauvegarde
docker cp la_response_d-redis:/data/dump.rdb ./backup-$(date +%Y%m%d).rdb
```

### Restauration des données Redis

```bash
# Arrêter les services
docker compose down

# Restaurer le fichier
docker cp backup-20240107.rdb la_response_d-redis:/data/dump.rdb

# Redémarrer
docker compose up -d
```

---

## Support

Pour plus d'informations :
- Documentation technique : `docs/fr/`
- Problèmes d'import : `docs/fr/RESOLUTION_IMPORT_ERROR.md`
- Issues GitHub : https://github.com/votre-username/la_response_d/issues

