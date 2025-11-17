"""
Test script for document endpoints
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000/api"

def test_create_document():
    """Test document creation"""
    document_data = {
        "metadata": {
            "title": "Test Document",
            "author": "Test Author",
            "parution_date": "2024-01-01",
            "is_appropriate": "yes",
            "is_harmful": False
        },
        "uploader": {
            "username": "testuser",
            "upload_date": datetime.now().isoformat()
        },
        "moderation": {
            "approval_process": {
                "status": "WAITING",
                "date": datetime.now().isoformat(),
                "details": "En attente de modération"
            },
            "approved_by": []
        },
        "markdown": {
            "content": "# Test Document\n\nThis is a test document."
        }
    }

    response = requests.post(f"{BASE_URL}/documents", json=document_data)
    print(f"Create Document: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    return response.json().get("document_id")

def test_get_document(document_id):
    """Test retrieving a document"""
    response = requests.get(f"{BASE_URL}/documents/{document_id}")
    print(f"\nGet Document: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_get_all_documents():
    """Test retrieving all documents"""
    response = requests.get(f"{BASE_URL}/documents")
    print(f"\nGet All Documents: {response.status_code}")
    print(f"Total documents: {response.json().get('count')}")

def test_get_documents_by_status():
    """Test retrieving documents by status"""
    response = requests.get(f"{BASE_URL}/documents/status/WAITING")
    print(f"\nGet Documents by Status: {response.status_code}")
    print(f"Documents with status WAITING: {response.json().get('count')}")

def test_get_documents_by_uploader():
    """Test retrieving documents by uploader"""
    response = requests.get(f"{BASE_URL}/documents/uploader/testuser")
    print(f"\nGet Documents by Uploader: {response.status_code}")
    print(f"Documents by testuser: {response.json().get('count')}")

def test_search_documents():
    """Test searching documents"""
    response = requests.get(f"{BASE_URL}/documents/search?title=Test")
    print(f"\nSearch Documents: {response.status_code}")
    print(f"Search results: {response.json().get('count')}")

def test_update_document(document_id):
    """Test updating a document"""
    updates = {
        "moderation": {
            "approval_process": {
                "status": "OK",
                "date": datetime.now().isoformat(),
                "details": "Document approuvé"
            }
        }
    }

    response = requests.put(f"{BASE_URL}/documents/{document_id}", json=updates)
    print(f"\nUpdate Document: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

def test_delete_document(document_id):
    """Test deleting a document"""
    response = requests.delete(f"{BASE_URL}/documents/{document_id}")
    print(f"\nDelete Document: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    print("=== Testing Document Endpoints ===\n")

    # Create a document
    doc_id = test_create_document()

    if doc_id:
        # Test various operations
        test_get_document(doc_id)
        test_get_all_documents()
        test_get_documents_by_status()
        test_get_documents_by_uploader()
        test_search_documents()
        test_update_document(doc_id)

        # Verify update
        test_get_document(doc_id)

        # Clean up
        test_delete_document(doc_id)

        print("\n=== All tests completed ===")
    else:
        print("Failed to create document")

