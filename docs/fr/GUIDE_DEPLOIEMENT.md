# Guide de Déploiement - La Réponse D

## Table des matières
1. [Prérequis](#prérequis)
2. [Développement local](#développement-local)
3. [Configuration initiale (Admins)](#configuration-initiale-admins)
4. [Déploiement production avec GitHub Actions](#déploiement-production)
5. [Résolution des problèmes](#résolution-des-problèmes)

---

## Prérequis

### Développement local
- Python 3.12 ou supérieur
- Node.js 18 ou supérieur
- Redis (optionnel pour le dev local)

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

## Configuration initiale (Admins)

Lors du premier démarrage de l'application, aucun utilisateur administrateur n'est créé par défaut. Vous avez deux options pour ajouter les premiers administrateurs.

### Option 1 : Via l'interface graphique (recommandé)

Lorsque vous accédez à l'application pour la première fois (http://localhost:5173), vous serez automatiquement redirigé vers une page de configuration si aucun administrateur n'est détecté.

1. **Remplir le formulaire** : Saisissez les informations pour 1 à 3 administrateurs.
2. **Valider** : Cliquez sur le bouton de création.
3. **Connexion** : Vous pourrez ensuite vous connecter avec ces identifiants.

### Option 2 : Via le script CLI

Si vous préférez utiliser la ligne de commande :

1. **Accéder au dossier serveur** :
   ```bash
   cd server
   ```

2. **Exécuter le script de création** :
   ```bash
   python src/create_admin_user.py --username admin --password mon_mot_de_passe --email admin@example.com
   ```

3. **Forcer la mise à jour** (optionnel) :
   Si l'utilisateur existe déjà mais n'est pas admin :
   ```bash
   python src/create_admin_user.py --username admin --password mon_mot_de_passe --email admin@example.com --force
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

Le fichier `.github/workflows/deploy.yml` automatise le déploiement.

### Configuration du serveur de production

1. **Prérequis sur le serveur** :
   ```bash
   # Installer Python et Node.js
   sudo apt update
   sudo apt install python3.12 nodejs npm redis-server
   ```

2. **Cloner le projet** :
   ```bash
   cd ~
   git clone https://github.com/votre-username/la_response_d.git
   cd la_response_d
   ```

### Vérification du déploiement

```bash
# Test depuis votre machine locale
curl http://votre-serveur:8000/health
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
```

### Erreur : `Connection refused` (Redis)

**Cause** : Redis n'est pas démarré ou mal configuré.

**Solution** :
```bash
# En développement local
# Installer et démarrer Redis
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### Port déjà utilisé

**Solution** :
```bash
# Trouver le processus utilisant le port
sudo lsof -i :5173
```

### Test complet du système

```bash
# Script de test des imports
cd server/src
python test_imports.py

# Test des API endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/
```

---

## Support

Pour plus d'informations :
- Documentation technique : `docs/fr/`
- Problèmes d'import : `docs/fr/RESOLUTION_IMPORT_ERROR.md`
- Issues GitHub : https://github.com/votre-username/la_response_d/issues

