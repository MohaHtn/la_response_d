# Document Repository

Ce module fournit un repository pour gérer les documents dans Redis avec la structure de données définie dans `document.json`.

## Structure des Données

Chaque document contient les informations suivantes :

```json
{
  "document_id": "doc_20231117120000_1",
  "metadata": {
    "title": "Titre du document",
    "author": "Nom de l'auteur",
    "parution_date": "2023",
    "is_appropriate": "yes/no",
    "is_harmful": false
  },
  "uploader": {
    "username": "utilisateur",
    "upload_date": "2023-11-17T12:00:00"
  },
  "moderation": {
    "approval_process": {
      "status": "WAITING|IN_APPROVAL|OK|NOK",
      "date": "2023-11-17T12:00:00",
      "details": "Description du statut"
    },
    "approved_by": ["moderateur1", "moderateur2"]
  },
  "markdown": {
    "content": "# Contenu en markdown..."
  }
}
```

## Modèles Pydantic

Les modèles suivants sont disponibles dans `app.api.models` :

- `BookStatus` : Enum pour les statuts de modération (WAITING, IN_APPROVAL, OK, NOK)
- `DocumentMetadata` : Métadonnées du document
- `DocumentUploader` : Informations sur l'utilisateur qui a uploadé le document
- `ApprovalProcess` : Processus d'approbation
- `DocumentModeration` : Informations de modération
- `DocumentMarkdown` : Contenu markdown
- `Document` : Modèle complet du document

## Utilisation du Repository

### Initialisation

```python
from app.infra.repositories import document_repository
```

### Opérations CRUD

#### 1. Ajouter un document

```python
document_data = {
    "metadata": {
        "title": "Mon Livre",
        "author": "Auteur",
        "parution_date": "2023",
        "is_appropriate": "yes",
        "is_harmful": False
    },
    "uploader": {
        "username": "john_doe",
        "upload_date": "2023-11-17T12:00:00"
    },
    "moderation": {
        "approval_process": {
            "status": "WAITING",
            "date": "2023-11-17T12:00:00",
            "details": "En attente"
        },
        "approved_by": []
    },
    "markdown": {
        "content": "# Contenu..."
    }
}

document_id = await document_repository.add_document(document_data)
```

#### 2. Récupérer un document

```python
document = await document_repository.get_document(document_id)
```

#### 3. Mettre à jour un document

```python
updates = {
    "moderation": {
        "approval_process": {
            "status": "OK",
            "date": "2023-11-17T13:00:00",
            "details": "Approuvé"
        }
    }
}

success = await document_repository.update_document(document_id, updates)
```

#### 4. Supprimer un document

```python
deleted = await document_repository.delete_document(document_id)
```

### Requêtes Avancées

#### Récupérer tous les documents

```python
all_documents = await document_repository.get_all_documents()
```

#### Filtrer par statut

```python
from app.api.models import BookStatus

waiting_docs = await document_repository.get_documents_by_status(BookStatus.WAITING.value)
approved_docs = await document_repository.get_documents_by_status(BookStatus.OK.value)
```

#### Filtrer par utilisateur

```python
user_docs = await document_repository.get_documents_by_uploader("john_doe")
```

#### Rechercher par titre ou auteur

```python
# Recherche par titre
results = await document_repository.search_documents(title="Biologie")

# Recherche par auteur
results = await document_repository.search_documents(author="Caullery")

# Recherche combinée
results = await document_repository.search_documents(
    title="Biologie",
    author="Caullery"
)
```

## Indexation Redis

Le repository utilise plusieurs index Redis pour optimiser les requêtes :

- `document_ids` : Set de tous les IDs de documents
- `documents:status:{STATUS}` : Sets des documents par statut
- `documents:uploader:{USERNAME}` : Sets des documents par utilisateur
- `document:counter` : Compteur pour générer des IDs uniques

## Exemple Complet

Voir le fichier `document_repository_example.py` pour un exemple d'utilisation complet avec toutes les opérations disponibles.

## Architecture

```
server/src/app/
├── api/
│   └── models.py                    # Modèles Pydantic
└── infra/
    └── repositories/
        ├── __init__.py              # Exports
        ├── document_repository.py   # Repository principal
        └── document_repository_example.py  # Exemple d'utilisation
```

## Notes Importantes

1. **Génération automatique d'ID** : Si aucun `document_id` n'est fourni, un ID unique est généré automatiquement au format `doc_{timestamp}_{counter}`

2. **Mise à jour profonde** : La méthode `update_document` effectue une fusion profonde (deep merge) des dictionnaires, permettant de mettre à jour des champs imbriqués sans écraser toute la structure

3. **Gestion des index** : Les index Redis sont automatiquement mis à jour lors des ajouts, modifications et suppressions pour maintenir la cohérence

4. **Asynchrone** : Toutes les méthodes du repository sont asynchrones et doivent être appelées avec `await`

