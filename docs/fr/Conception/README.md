# Rapport de Conception - Bibliothèque Numérique Décentralisée

## 1. Vue d'ensemble du système

### 1.1 Architecture générale
Le système est conçu selon une architecture web moderne avec séparation client/serveur :
- **Frontend** : Application React avec Vite (client/)
- **Backend** : API REST en Python avec FastAPI (server/)
- **Traitement IA** : Intégration avec Mistral AI pour OCR et analyse de contenu

### 1.2 Objectifs du système
- Numérisation et traitement automatique de documents PDF
- Analyse intelligente du contenu (métadonnées, sécurité, appropriateness)
- Conversion en format Markdown pour archivage et consultation
- Interface web moderne pour la gestion des documents

## 2. Architecture du serveur

### 2.1 Structure modulaire
```
server/src/
└── app/
    ├── api/          # Routeurs (auth, documents, moderation, admin, setup)
    ├── domain/       # Logique métier (services, image_generator)
    ├── infra/        # Infrastructure (repositories, database, security, ocr)
    ├── main.py       # Point d'entrée FastAPI
    └── routes.py     # Endpoint legacy send-book
```

### 2.2 Stack technique
- **Framework web** : FastAPI (Python)
- **IA et OCR** : Mistral AI (modèles Pixtral et OCR)
- **Base de données** : Redis (via repositories)
- **Format de sortie** : Markdown avec support LaTeX
- **CORS** : Configuré pour React (dev: 5173, prod: 80/5187)

### 2.3 Points d'entrée API

#### API Modulaire (V2)
- `/api/auth` : Authentification et gestion des comptes
- `/api/documents` : Gestion des documents et upload (`/upload`)
- `/api/moderation` : Workflow de modération et quarantaine
- `/api/admin` : Administration des utilisateurs
- `/api/setup` : Configuration initiale du système

#### Endpoint de santé : `/health`
- **Méthode** : GET
- **Output** : Status de l'API

## 3. Traitement intelligent des documents

### 3.1 Pipeline de traitement (pixtral.py)
Le système implémente un pipeline sophistiqué :

1. **Upload et OCR**
   - Upload sécurisé vers Mistral AI
   - OCR avec extraction de texte et images
   - Support des formules mathématiques (LaTeX)

2. **Extraction de métadonnées**
   - Titre du document
   - Auteur(s)
   - Date de publication
   - Éditeur
   - Description automatique

3. **Analyse de sécurité**
   - Détection de prompt injection
   - Identification de commandes système cachées
   - Évaluation du niveau de risque (low/medium/high)

4. **Analyse de contenu**
   - Détection de contenu inapproprié
   - Vérification de légalité
   - Classification par sévérité

5. **Génération Markdown**
   - Fusion de toutes les pages
   - Intégration des images (base64 ou fichiers)
   - Formatage cohérent

### 3.2 Gestion des images
Deux modes supportés :
- **Embedded** : Images en base64 dans le markdown
- **File-based** : Images sauvegardées sur disque avec références

## 4. Modules CLI (Interface en ligne de commande)

### 4.1 État des outils
Les outils CLI mentionnés initialement (`ocr.py`, `deposit.py`, etc.) ont été intégrés directement dans les services backend (`pixtral_service.py`, `document_service.py`) pour une meilleure cohésion architecturale.

### 4.2 Automatisation
Le traitement peut être automatisé via des scripts appelant les endpoints de l'API REST.

## 5. Sécurité et validation

### 5.1 Validation des fichiers
- Vérification de l'extension PDF
- Gestion d'erreurs robuste
- Limitation aux fichiers PDF uniquement

### 5.2 Analyse de sécurité intégrée
- Détection automatique de contenu malveillant
- Analyse des prompts de sécurité
- Évaluation du risque par IA

### 5.3 Gestion des clés API
- Configuration centralisée dans `apikey.json`
- Chargement sécurisé des credentials

## 6. Format de réponse standardisé

### 6.1 Structure de la réponse JSON
```json
{
  "success": true,
  "message": "...",
  "document_id": "...",
  "quarantine_status": "approved/quarantined",
  "is_compliant": true,
  "compliance_issues": [],
  "document": {
    "title": "...",
    "author": "...",
    "uploader": "...",
    "upload_date": "...",
    "status": "WAITING",
    "in_quarantine": false
  },
  "preview": "...",
  "metadata": {
    "title": "...",
    "author": "...",
    "date": "...",
    "publisher": "...",
    "description": "..."
  },
  "security_analysis": {
    "has_security_prompts": false,
    "detected_prompts": [],
    "risk_level": "low",
    "details": "..."
  },
  "content_analysis": {
    "is_appropriate": true,
    "content_warnings": [],
    "severity": "none",
    "details": "..."
  },
  "markdown": "...",
  "ocr": {
    "pages": [],
    "model": "mistral-ocr-latest",
    "usage_info": {}
  },
  "processing_info": {
    "file_name": "...",
    "total_pages": 5,
    "total_text_length": 1234
  }
}
```

## 7. Points d'amélioration identifiés

### 7.1 Architecture
- **Tests** : Augmenter la couverture des tests (dossier `tests/` déjà présent)
- **Découplage** : Poursuivre la migration du "legacy" vers les services modulaires

### 7.2 Fonctionnalités
- **Base de données** : Persistance partielle (Redis), migration vers SQL envisagée
- **Cache** : Pas de mise en cache des résultats OCR

### 7.3 Performance
- **Traitement asynchrone** : Pour les gros documents
- **Queue de traitement** : Pour gérer la charge
- **Compression** : Des images et du contenu

## 8. Intégration avec le frontend

### 8.1 Communication API
- Endpoints REST simples
- Format JSON standardisé
- Gestion d'erreurs cohérente

### 8.2 Upload de fichiers
- Support multipart/form-data
- Validation côté serveur
- Feedback en temps réel (à implémenter)

## 9. Conformité et gouvernance

### 9.1 Respect des droits d'auteur
- Analyse automatique du contenu
- Détection de matériel protégé
- Workflow de modération

### 9.2 Confidentialité
- Pas de stockage permanent sur Mistral
- Gestion locale des documents sensibles
- Analyse de contenu pour la protection des données
