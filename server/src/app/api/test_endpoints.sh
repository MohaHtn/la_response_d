#!/bin/bash

# Script de démarrage rapide pour tester les endpoints de documents

echo "==================================="
echo "Test des endpoints de documents"
echo "==================================="
echo ""

# Vérifier si le serveur est en cours d'exécution
echo "Vérification que le serveur est en cours d'exécution..."
if ! curl -s http://localhost:8000/api/documents > /dev/null 2>&1; then
    echo "❌ Le serveur ne semble pas être en cours d'exécution."
    echo "Veuillez démarrer le serveur avec : uvicorn app.main:app --reload"
    exit 1
fi

echo "✅ Le serveur est en cours d'exécution"
echo ""

# Test 1 : Créer un document
echo "Test 1 : Création d'un document"
RESPONSE=$(curl -s -X POST http://localhost:8000/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "title": "Test Document",
      "author": "Test Author",
      "parution_date": "2024-01-01",
      "is_appropriate": "yes",
      "is_harmful": false
    },
    "uploader": {
      "username": "testuser",
      "upload_date": "2024-01-01T10:00:00"
    },
    "moderation": {
      "approval_process": {
        "status": "WAITING",
        "date": "2024-01-01T10:00:00",
        "details": "En attente de modération"
      },
      "approved_by": []
    },
    "markdown": {
      "content": "# Test Document\n\nThis is a test document."
    }
  }')

echo "$RESPONSE" | python3 -m json.tool
DOC_ID=$(echo "$RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('document_id', ''))")
echo ""

if [ -z "$DOC_ID" ]; then
    echo "❌ Échec de la création du document"
    exit 1
fi

echo "✅ Document créé avec l'ID : $DOC_ID"
echo ""

# Test 2 : Récupérer le document
echo "Test 2 : Récupération du document"
curl -s http://localhost:8000/api/documents/$DOC_ID | python3 -m json.tool
echo ""

# Test 3 : Récupérer tous les documents
echo "Test 3 : Récupération de tous les documents"
curl -s http://localhost:8000/api/documents | python3 -m json.tool | head -20
echo "..."
echo ""

# Test 4 : Récupérer par statut
echo "Test 4 : Récupération par statut (WAITING)"
curl -s http://localhost:8000/api/documents/status/WAITING | python3 -m json.tool | head -20
echo "..."
echo ""

# Test 5 : Recherche
echo "Test 5 : Recherche par titre"
curl -s "http://localhost:8000/api/documents/search?title=Test" | python3 -m json.tool | head -20
echo "..."
echo ""

# Test 6 : Mise à jour
echo "Test 6 : Mise à jour du document"
curl -s -X PUT http://localhost:8000/api/documents/$DOC_ID \
  -H "Content-Type: application/json" \
  -d '{
    "moderation": {
      "approval_process": {
        "status": "OK",
        "date": "2024-01-02T15:00:00",
        "details": "Document approuvé"
      }
    }
  }' | python3 -m json.tool
echo ""

# Test 7 : Suppression
echo "Test 7 : Suppression du document"
curl -s -X DELETE http://localhost:8000/api/documents/$DOC_ID | python3 -m json.tool
echo ""

echo "==================================="
echo "✅ Tous les tests sont terminés"
echo "==================================="

