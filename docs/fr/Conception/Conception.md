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
├── app/
│   ├── api/          # Intégrations externes (Mistral AI)
│   ├── domain/       # Logique métier (vide actuellement)
│   ├── infra/        # Infrastructure (vide actuellement)
│   ├── main.py       # Point d'entrée FastAPI
│   └── routes.py     # Définition des endpoints
└── cli/              # Outils en ligne de commande
```

### 2.2 Stack technique
- **Framework web** : FastAPI (Python)
- **IA et OCR** : Mistral AI (modèles Pixtral et OCR)
- **Format de sortie** : Markdown avec support LaTeX
- **CORS** : Configuré pour permettre les requêtes cross-origin

### 2.3 Points d'entrée API

#### Endpoint principal : `/api/send-book`
- **Méthode** : POST
- **Input** : Fichier PDF via multipart/form-data
- **Output** : JSON complet avec OCR, analyses et markdown

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

### 4.1 Outils disponibles
- `ocr.py` : Traitement OCR direct
- `deposit.py` : Dépôt de documents
- `moderate.py` : Modération de contenu
- `export_md.py` : Export en Markdown
- `format_small_book.py` : Formatage de petits livres

### 4.2 Architecture modulaire
Les outils CLI permettent un traitement en lot et une automatisation des tâches.

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
  "ocr": {
    "pages": [...],
    "model": "mistral-ocr-latest",
    "usage_info": {...}
  },
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
  "processing_info": {
    "file_name": "...",
    "total_pages": 5,
    "total_text_length": 1234
  }
}
```

## 7. Points d'amélioration identifiés

### 7.1 Architecture
- **Domain layer** : Actuellement vide, à développer pour la logique métier
- **Infrastructure layer** : À implémenter pour la persistance et les services externes
- **Tests** : Aucun test identifié dans le code actuel

### 7.2 Fonctionnalités
- **Base de données** : Pas de persistance actuellement
- **Authentification** : Non implémentée
- **Gestion des utilisateurs** : À développer
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

## 10. Roadmap technique

### 10.1 Phase 1 (Actuelle)
- ✅ OCR et traitement de base
- ✅ Analyse de contenu par IA
- ✅ API REST fonctionnelle

### 10.2 Phase 2 (À venir)
- 🔄 Persistance des données
- 🔄 Interface utilisateur complète
- 🔄 Système d'authentification

### 10.3 Phase 3 (Future)
- 📋 Traitement en lot
- 📋 API avancée de recherche
- 📋 Intégration Git pour versioning
- 📋 Export multi-formats

---
