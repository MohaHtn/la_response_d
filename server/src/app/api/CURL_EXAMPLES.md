# Exemples de requêtes CURL pour les endpoints de documents

## 1. Créer un document

```bash
curl -X POST http://localhost:8000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "title": "Les Étapes de la Biologie",
      "author": "Maurice Caullery",
      "parution_date": "1954-01-01",
      "is_appropriate": "yes",
      "is_harmful": false
    },
    "uploader": {
      "username": "jean_dupont",
      "upload_date": "2024-11-17T10:30:00"
    },
    "moderation": {
      "approval_process": {
        "status": "WAITING",
        "date": "2024-11-17T10:30:00",
        "details": "En attente de modération initiale"
      },
      "approved_by": []
    },
    "markdown": {
      "content": "# Les Étapes de la Biologie\n\n## Introduction\n\nCe livre retrace l'\''histoire de la biologie..."
    }
  }'
```

## 2. Récupérer un document par ID

```bash
curl http://localhost:8000/api/documents/doc_20241117103000_1
```

## 3. Récupérer tous les documents

```bash
curl http://localhost:8000/api/documents
```

## 4. Récupérer les documents en attente

```bash
curl http://localhost:8000/api/documents/status/WAITING
```

## 5. Récupérer les documents approuvés

```bash
curl http://localhost:8000/api/documents/status/OK
```

## 6. Récupérer les documents d'un utilisateur

```bash
curl http://localhost:8000/api/documents/uploader/jean_dupont
```

## 7. Rechercher par titre

```bash
curl "http://localhost:8000/api/documents/search?title=biologie"
```

## 8. Rechercher par auteur

```bash
curl "http://localhost:8000/api/documents/search?author=caullery"
```

## 9. Rechercher par titre ET auteur

```bash
curl "http://localhost:8000/api/documents/search?title=biologie&author=caullery"
```

## 10. Mettre à jour un document (approuver)

```bash
curl -X PUT http://localhost:8000/api/documents/doc_20241117103000_1 \
  -H "Content-Type: application/json" \
  -d '{
    "moderation": {
      "approval_process": {
        "status": "OK",
        "date": "2024-11-17T15:00:00",
        "details": "Document approuvé après vérification"
      },
      "approved_by": ["moderateur1", "moderateur2"]
    }
  }'
```

## 11. Mettre à jour un document (rejeter)

```bash
curl -X PUT http://localhost:8000/api/documents/doc_20241117103000_1 \
  -H "Content-Type: application/json" \
  -d '{
    "moderation": {
      "approval_process": {
        "status": "NOK",
        "date": "2024-11-17T15:00:00",
        "details": "Document rejeté : contenu inapproprié"
      }
    }
  }'
```

## 12. Mettre à jour les métadonnées

```bash
curl -X PUT http://localhost:8000/api/documents/doc_20241117103000_1 \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "title": "Les Étapes de la Biologie (Édition révisée)",
      "author": "Maurice Caullery"
    }
  }'
```

## 13. Supprimer un document

```bash
curl -X DELETE http://localhost:8000/api/documents/doc_20241117103000_1
```

## 14. Tester avec formatage JSON (avec jq)

Si vous avez `jq` installé, vous pouvez formater les réponses :

```bash
curl http://localhost:8000/api/documents | jq '.'
```

## 15. Tester avec formatage JSON (avec python)

```bash
curl http://localhost:8000/api/documents | python3 -m json.tool
```

## 16. Créer plusieurs documents pour tester

```bash
# Document 1
curl -X POST http://localhost:8000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {"title": "Biologie I", "author": "Auteur A", "parution_date": "2024-01-01", "is_appropriate": "yes", "is_harmful": false},
    "uploader": {"username": "user1", "upload_date": "2024-11-17T10:00:00"},
    "moderation": {"approval_process": {"status": "WAITING", "date": "2024-11-17T10:00:00", "details": "En attente"}, "approved_by": []},
    "markdown": {"content": "# Biologie I"}
  }'

# Document 2
curl -X POST http://localhost:8000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {"title": "Biologie II", "author": "Auteur B", "parution_date": "2024-02-01", "is_appropriate": "yes", "is_harmful": false},
    "uploader": {"username": "user2", "upload_date": "2024-11-17T11:00:00"},
    "moderation": {"approval_process": {"status": "OK", "date": "2024-11-17T11:00:00", "details": "Approuvé"}, "approved_by": ["mod1"]},
    "markdown": {"content": "# Biologie II"}
  }'

# Document 3
curl -X POST http://localhost:8000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {"title": "Physique I", "author": "Auteur C", "parution_date": "2024-03-01", "is_appropriate": "yes", "is_harmful": false},
    "uploader": {"username": "user1", "upload_date": "2024-11-17T12:00:00"},
    "moderation": {"approval_process": {"status": "IN_APPROVAL", "date": "2024-11-17T12:00:00", "details": "En cours"}, "approved_by": []},
    "markdown": {"content": "# Physique I"}
  }'
```

## Notes

- Remplacez `localhost:8000` par l'adresse de votre serveur si nécessaire
- Remplacez `doc_20241117103000_1` par l'ID réel retourné lors de la création
- Les dates doivent être au format ISO 8601 : `YYYY-MM-DDTHH:MM:SS`
- Pour les requêtes avec des paramètres de query, n'oubliez pas les guillemets autour de l'URL

