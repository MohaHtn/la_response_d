# Déploiement via GitHub Actions

Ce guide explique comment configurer le déploiement automatique de l'application sur votre serveur (mohahtn.xyz) à chaque fois que vous poussez du code sur GitHub.

## 1. Prérequis sur le Serveur

1.  **Docker et Docker Compose** doivent être installés sur le serveur.
2.  **Git** doit être installé.
3.  Le projet doit être cloné initialement sur le serveur :
    ```bash
    git clone https://github.com/votre-utilisateur/la_response_d.git /path/to/your/app/la_response_d
    ```
4.  Configurez une clé SSH sur le serveur pour permettre à GitHub de se connecter.

## 2. Configuration des Secrets GitHub

Allez dans les paramètres de votre dépôt GitHub : **Settings > Secrets and variables > Actions** et ajoutez les secrets suivants :

### Accès Serveur
| Secret | Description |
| :--- | :--- |
| `SERVER_HOST` | L'adresse IP ou le nom de domaine de votre serveur (ex: `mohahtn.xyz`) |
| `SERVER_USER` | L'utilisateur SSH (ex: `ubuntu` ou `root`) |
| `SSH_PRIVATE_KEY` | Votre clé privée SSH (contenu du fichier `~/.ssh/id_rsa`) |

### Configuration Application (.env)
Ces variables seront injectées lors du déploiement Docker :
| Secret | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Votre clé API Google Gemini |
| `PIXTRAL_API_KEY` | Votre clé API Mistral/Pixtral |
| `JWT_SECRET_KEY` | Une clé secrète longue et unique pour les tokens JWT |

## 3. Fonctionnement du Workflow

Le fichier `.github/workflows/deploy.yml` automatise les étapes suivantes :
1.  Se connecte à votre serveur via SSH.
2.  Entre dans le répertoire du projet.
3.  Récupère les dernières modifications (`git pull`).
4.  Injecte les clés API via des variables d'environnement.
5.  Reconstruit et redémarre les containers Docker (`docker compose up -d --build`).

## 4. Accès à l'application

Une fois déployé :
-   **Client (Frontend) :** Accessible sur le port 80 de votre serveur (ex: `http://mohahtn.xyz`).
-   **API (Backend) :** Accessible sur le port 8000 (ex: `http://mohahtn.xyz:8000`).

---
*Note : Pour une production réelle, il est fortement recommandé d'utiliser un Reverse Proxy (comme Nginx sur le serveur hôte) avec SSL (Certbot/Let's Encrypt).*
