# Résumé des endpoints API pour les documents

## Fichiers créés/modifiés

### 1. `/server/src/app/api/routes.py` (modifié)
Ajout de 8 nouveaux endpoints pour la gestion des documents :

#### Endpoints créés :
1. **POST /api/documents** - Créer un nouveau document
2. **GET /api/documents/{document_id}** - Récupérer un document par ID
3. **GET /api/documents** - Récupérer tous les documents
4. **GET /api/documents/status/{status}** - Récupérer les documents par statut
5. **GET /api/documents/uploader/{username}** - Récupérer les documents par utilisateur
6. **GET /api/documents/search** - Rechercher des documents par titre/auteur
7. **PUT /api/documents/{document_id}** - Mettre à jour un document
8. **DELETE /api/documents/{document_id}** - Supprimer un document

### 2. `/server/src/app/api/DOCUMENT_ENDPOINTS.md` (créé)
Documentation complète des endpoints avec :
- Description de chaque endpoint
- Paramètres requis
- Exemples de requêtes/réponses
- Codes d'erreur

### 3. `/server/src/app/api/test_document_endpoints.py` (créé)
Script Python de test automatique pour tous les endpoints

### 4. `/server/src/app/api/test_endpoints.sh` (créé)
Script bash pour tester rapidement les endpoints avec curl

## Fonctionnalités implémentées

✅ **CRUD complet** pour les documents
✅ **Filtrage** par statut de modération
✅ **Filtrage** par utilisateur uploadeur
✅ **Recherche** par titre et auteur
✅ **Gestion d'erreurs** complète avec messages en français
✅ **Documentation** détaillée
✅ **Scripts de test** fournis

## Structure des données

Les documents suivent le modèle défini dans `models.py` :
- `metadata` : Titre, auteur, date, etc.
- `uploader` : Informations sur l'utilisateur
- `moderation` : Processus d'approbation et modérateurs
- `markdown` : Contenu du document

## Statuts de modération

- `WAITING` : En attente de modération
- `IN_APPROVAL` : En cours d'approbation
- `OK` : Approuvé
- `NOK` : Rejeté

## Utilisation

### Démarrer le serveur
```bash
cd /home/mohahtn/PycharmProjects/la_response_d/server/src
uvicorn app.main:app --reload
```

### Tester avec curl
```bash
cd /home/mohahtn/PycharmProjects/la_response_d/server/src/app/api
./test_endpoints.sh
```

### Tester avec Python
```bash
cd /home/mohahtn/PycharmProjects/la_response_d/server/src/app/api
python test_document_endpoints.py
```

### Documentation interactive
Une fois le serveur démarré, accéder à :
- Swagger UI : http://localhost:8000/docs
- ReDoc : http://localhost:8000/redoc

## Intégration avec Redis

Tous les endpoints utilisent le `DocumentRepository` qui stocke les données dans Redis avec :
- **Indexation** par ID de document
- **Indexation** par statut de modération
- **Indexation** par utilisateur uploadeur
- **Génération automatique** d'ID uniques
- **Mise à jour partielle** avec fusion des dictionnaires imbriqués

## Sécurité et validation

- Validation des données via Pydantic (modèle `Document`)
- Gestion des erreurs 404 pour les ressources introuvables
- Gestion des erreurs 400 pour les requêtes invalides
- Gestion des erreurs 500 pour les erreurs serveur
- Messages d'erreur en français

## Prochaines étapes possibles

1. **Authentification** : Ajouter des middlewares d'authentification JWT
2. **Pagination** : Implémenter la pagination pour les listes de documents
3. **Permissions** : Ajouter des contrôles de permissions (qui peut modifier/supprimer)
4. **Upload de fichiers** : Intégrer avec l'endpoint `/send-book` existant
5. **Webhooks** : Notifier les utilisateurs lors des changements de statut
6. **Elasticsearch** : Améliorer la recherche avec Elasticsearch
7. **Cache** : Ajouter un cache pour les requêtes fréquentes
8. **Rate limiting** : Limiter le nombre de requêtes par utilisateur

