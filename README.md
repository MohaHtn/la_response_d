# La Réponse D - Bibliothèque Numérique Décentralisée

## Description du Projet

Application web de bibliothèque numérique permettant la numérisation, l'analyse par IA et le partage d'œuvres avec gestion des droits d'auteur. Le système utilise l'intelligence artificielle (Mistral AI) pour l'OCR, l'analyse de contenu et la conversion en Markdown.

## Architecture

- **Frontend** : React 19 + Vite + Material-UI
- **Backend** : FastAPI (Python) avec intégration Mistral AI
- **Traitement** : OCR intelligent, analyse de sécurité et de contenu

## Prérequis

- **Python 3.8+** (pour le serveur)
- **Node.js 18+** et **npm** (pour le client)
- **Git** (pour le versioning)
- **Clé API Mistral AI** (pour les fonctionnalités OCR)

## Installation et Configuration

### 1. Clonage du Projet

```bash
git clone https://github.com/votre-repo/la_response_d.git
cd la_response_d
```

### 2. Configuration du Serveur (Backend Python)

#### Création de l'environnement virtuel

```bash
# Création de l'environnement virtuel
python -m venv .venv

# Activation de l'environnement virtuel
# Sur Linux/macOS :
source .venv/bin/activate

# Sur Windows :
.venv\Scripts\activate
```

#### Installation des dépendances Python

```bash
# Installation des packages Python
pip install -r requirements.txt
```

#### Configuration de l'API Mistral

Créez le fichier de configuration API dans `server/src/apikey.json` :

```json
{
  "mistral_api_key": "votre_clé_api_mistral_ici"
}
```

#### Lancement du serveur

```bash
# Depuis la racine du projet
cd server/src

# Lancement avec uvicorn
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Le serveur sera accessible à : `http://localhost:8000`
API Documentation : `http://localhost:8000/docs`

### 3. Configuration du Client (Frontend React)

#### Installation des dépendances Node.js

```bash
# Depuis la racine du projet
cd client

# Installation des packages npm
npm install
```

#### Lancement du client en mode développement

```bash
# Depuis le dossier client
npm run dev
```

Le client sera accessible à : `http://localhost:5173`

## Scripts Disponibles

### Serveur (Python)
```bash
# Dans le dossier server/src/
uvicorn app.main:app --reload                    # Mode développement
uvicorn app.main:app --host 0.0.0.0 --port 8000 # Production locale
```

### Client (React)
```bash
# Dans le dossier client/
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run lint     # Vérification du code
npm run preview  # Prévisualisation du build
```

## Utilisation

### 1. Accès à l'Application
1. Démarrez le serveur backend (port 8000)
2. Démarrez le client frontend (port 5173)
3. Ouvrez votre navigateur à `http://localhost:5173`

### 2. Fonctionnalités Principales
- **Upload PDF** : Téléchargement de documents PDF
- **OCR Intelligent** : Extraction automatique du texte avec Mistral AI
- **Analyse de Sécurité** : Détection de contenus malveillants
- **Analyse de Contenu** : Vérification de l'appropriateness
- **Export Markdown** : Conversion et téléchargement en format .md
- **Métadonnées** : Extraction automatique des informations du document

### 3. Workflow Typique
1. Sélectionnez un fichier PDF via l'interface web
2. Le système traite automatiquement le document avec l'IA
3. Consultez les résultats : texte OCR, analyses, métadonnées
4. Téléchargez le fichier Markdown généré

## Structure du Projet

```
la_response_d/
├── client/                 # Application React (Frontend)
│   ├── src/
│   │   ├── App.jsx        # Composant principal
│   │   └── main.jsx       # Point d'entrée
│   ├── package.json
│   └── vite.config.js
├── server/                 # API FastAPI (Backend)
│   └── src/
│       ├── app/
│       │   ├── main.py    # Application FastAPI
│       │   ├── routes.py  # Endpoints API
│       │   └── api/       # Intégrations externes
│       └── cli/           # Outils en ligne de commande
├── docs/                   # Documentation
├── data/                   # Données et exemples
├── requirements.txt        # Dépendances Python
└── README.md              # Ce fichier
```

## Outils CLI Disponibles

Le projet inclut plusieurs outils en ligne de commande dans `server/src/cli/` :

- `ocr.py` : Traitement OCR direct
- `deposit.py` : Dépôt de documents
- `moderate.py` : Modération de contenu
- `export_md.py` : Export en Markdown
- `format_small_book.py` : Formatage de petits livres

## Configuration Avancée

### Variables d'Environnement

Créez un fichier `.env` dans `server/src/` pour la configuration :

```env
MISTRAL_API_KEY=votre_clé_api
DEBUG=True
CORS_ORIGINS=http://localhost:5173
```

### CORS Configuration

Le serveur est configuré pour accepter les requêtes du client React local. Modifiez `server/src/app/main.py` pour ajuster les origines autorisées en production.

## Dépannage

### Problèmes Courants

1. **Erreur d'importation Python** : Vérifiez que l'environnement virtuel est activé
2. **Erreur API Mistral** : Vérifiez que votre clé API est correctement configurée
3. **CORS Error** : Vérifiez que le serveur backend est lancé avant le client
4. **Port déjà utilisé** : Changez les ports dans les commandes de lancement

### Logs et Debug

- Logs serveur : Consultez la sortie d'uvicorn
- Logs client : Ouvrez les DevTools du navigateur (F12)
- API Documentation : `http://localhost:8000/docs`

## Développement

### Tests

```bash
# Tests backend (à implémenter)
cd server && python -m pytest

# Tests frontend (à implémenter)
cd client && npm test
```

### Code Quality

```bash
# Linting Python
cd server && flake8 src/

# Linting JavaScript
cd client && npm run lint
```

## Contribution

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Pushez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créez une Pull Request

## Documentation

- [Documentation technique](/docs/fr/) (Français)
- [Technical documentation](/docs/en/) (English)
- [Scénarios d'usage](/docs/fr/Conception/Scenarios/)
- [Glossaires](/docs/fr/)

## Licence

Ce projet est sous licence [GNU](LICENSE).

---

**Contact** : Projet étudiant dans le cadre du PJE

**Version** : 0.1.0

**Date** : Octobre 2025
