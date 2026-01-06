# Guide de Maintenance et de Mise en Place du Serveur

Ce document détaille les procédures d'installation, de configuration et de maintenance du serveur "La Réponse D" (Bibliotheko).

## 1. Mise en Place (Installation)

### Prérequis
- **Python 3.10+**
- **Node.js 18+** (pour le client)
- **Redis 7.1+** (pour le stockage des données)
- **Docker & Docker Compose** (recommandé pour un déploiement simplifié)

### Méthode 1 : Déploiement via Docker (Recommandé)
Le projet inclut un script PowerShell pour le développement local et un workflow GitHub Actions pour le déploiement automatique.

#### En local (Windows)
1.  Assurez-vous que Docker Desktop est démarré.
2.  Exécutez le script de déploiement :
    ```powershell
    .\scripts\deploy.ps1 -Build
    ```
    *Note : L'option `-Build` force la reconstruction des images.*

#### En production (Serveur via GitHub)
Consultez le guide dédié : [Déploiement via GitHub Actions](./DEPLOYMENT_GITHUB.md).

Les services seront accessibles aux adresses suivantes :
-   **Client :** http://localhost:5173
-   **API (Documentation) :** http://localhost:8000/docs
-   **Redis :** localhost:6379

### Méthode 2 : Installation Manuelle (Développement)

#### Serveur (FastAPI)
1.  Naviguez dans le dossier `server`.
2.  Créez un environnement virtuel :
    ```bash
    python -m venv venv
    .\venv\Scripts\activate  # Windows
    source venv/bin/activate # Linux/Mac
    ```
3.  Installez les dépendances :
    ```bash
    pip install -r requirements.txt
    ```
4.  Configurez le fichier `.env` (voir section Configuration).
5.  Lancez le serveur :
    ```bash
    python src/app/main.py
    # Ou via uvicorn
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    ```

#### Client (React)
1.  Naviguez dans le dossier `client`.
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Lancez le serveur de développement :
    ```bash
    npm run dev
    ```

---

## 2. Configuration

Le serveur utilise des variables d'environnement stockées dans le fichier `server/.env`.

### Variables critiques
| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Clé API pour le service Google Gemini (OCR/Analyse) |
| `PIXTRAL_API_KEY` | Clé API pour le service Mistral/Pixtral |
| `JWT_SECRET_KEY` | Clé secrète pour signer les tokens de session (doit être longue et unique) |
| `REDIS_HOST` | Adresse du serveur Redis (défaut: `localhost`) |
| `REDIS_PORT` | Port du serveur Redis (défaut: `6379`) |
| `ENVIRONMENT` | `development` ou `production` |

### Chiffrement des données
Au premier démarrage, le serveur génère un fichier `server/src/app/secret.key`. **Ce fichier est crucial** car il sert à chiffrer les données d'authentification des utilisateurs dans Redis. S'il est perdu, les comptes utilisateurs existants deviendront inaccessibles.

---

## 3. Administration

### Initialisation des Administrateurs
Le système autorise jusqu'à **3 administrateurs**.

#### Via l'interface de setup (Automatisé)
Lors de la première installation, vous pouvez utiliser l'endpoint de setup :
`POST http://localhost:8000/api/setup/admins` avec un JSON contenant la liste des admins.

#### Via le script CLI (Manuel)
Vous pouvez créer un administrateur directement depuis le serveur :
```bash
cd server
python src/create_admin_user.py --username admin --password "votre_mdp" --email "admin@example.com"
```

---

## 4. Maintenance

### Logs
-   **Docker :** `docker compose logs -f server`
-   **Standard :** Les logs sont affichés dans la console où le serveur est lancé.

### Sauvegarde
1.  **Données utilisateurs :** Sauvegardez la base de données Redis (fichier `dump.rdb` ou via `SAVE` command).
2.  **Clé de chiffrement :** Sauvegardez impérativement `server/src/app/secret.key` dans un endroit sûr (Vault, Gestionnaire de mots de passe).

### Mise à jour
1.  Récupérez la dernière version du code via Git.
2.  Si vous utilisez Docker :
    ```powershell
    .\scripts\deploy.ps1 -Build
    ```
3.  Si installation manuelle :
    -   Mettez à jour les dépendances : `pip install -r requirements.txt`
    -   Redémarrez le service.

### Dépannage
-   **Erreur 500 au login :** Vérifiez que `secret.key` n'a pas été supprimé ou modifié.
-   **Problème de connexion Redis :** Vérifiez que le service Redis est démarré et que `REDIS_HOST` est correct dans le `.env`.
-   **Erreurs d'API (OCR) :** Vérifiez la validité des clés `GEMINI_API_KEY` et `PIXTRAL_API_KEY`.
