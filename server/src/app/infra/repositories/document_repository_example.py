"""
Example usage of DocumentRepository

This file demonstrates how to use the document repository for CRUD operations.
"""
import asyncio
from datetime import datetime
from .document_repository import document_repository
from ...api.models import BookStatus


async def example_usage():
    """Example of using the document repository"""

    # Example document data
    sample_document = {
        "metadata": {
            "title": "Les Étapes De La Biologie",
            "author": "Maurice Caullery",
            "parution_date": "1954",
            "is_appropriate": "yes",
            "is_harmful": False
        },
        "uploader": {
            "username": "john_doe",
            "upload_date": datetime.now().isoformat()
        },
        "moderation": {
            "approval_process": {
                "status": BookStatus.WAITING.value,
                "date": datetime.now().isoformat(),
                "details": "En attente de modération"
            },
            "approved_by": []
        },
        "markdown": {
            "content": "# Les Étapes De La Biologie\n\nContenu du livre..."
        }
    }

    # 1. Add a new document
    print("1. Adding new document...")
    doc_id = await document_repository.add_document(sample_document)
    print(f"   Document created with ID: {doc_id}")

    # 2. Get the document
    print("\n2. Retrieving document...")
    document = await document_repository.get_document(doc_id)
    print(f"   Document title: {document['metadata']['title']}")

    # 3. Update document status
    print("\n3. Updating document status to IN_APPROVAL...")
    update_data = {
        "moderation": {
            "approval_process": {
                "status": BookStatus.IN_APPROVAL.value,
                "date": datetime.now().isoformat(),
                "details": "En cours de modération par l'équipe"
            }
        }
    }
    success = await document_repository.update_document(doc_id, update_data)
    print(f"   Update successful: {success}")

    # 4. Get documents by status
    print("\n4. Getting all documents with status IN_APPROVAL...")
    docs_in_approval = await document_repository.get_documents_by_status(BookStatus.IN_APPROVAL.value)
    print(f"   Found {len(docs_in_approval)} document(s)")

    # 5. Get documents by uploader
    print("\n5. Getting all documents uploaded by john_doe...")
    user_docs = await document_repository.get_documents_by_uploader("john_doe")
    print(f"   Found {len(user_docs)} document(s)")

    # 6. Search documents by title
    print("\n6. Searching documents by title 'Biologie'...")
    search_results = await document_repository.search_documents(title="Biologie")
    print(f"   Found {len(search_results)} document(s)")

    # 7. Approve document
    print("\n7. Approving document...")
    approval_update = {
        "moderation": {
            "approval_process": {
                "status": BookStatus.OK.value,
                "date": datetime.now().isoformat(),
                "details": "Document approuvé après modération"
            },
            "approved_by": ["moderator1", "moderator2"]
        }
    }
    await document_repository.update_document(doc_id, approval_update)
    print("   Document approved")

    # 8. Get all documents
    print("\n8. Getting all documents...")
    all_docs = await document_repository.get_all_documents()
    print(f"   Total documents: {len(all_docs)}")

    # 9. Delete document (optional - uncomment to test)
    # print("\n9. Deleting document...")
    # deleted = await document_repository.delete_document(doc_id)
    # print(f"   Document deleted: {deleted}")

    print("\n✅ All operations completed successfully!")


if __name__ == "__main__":
    asyncio.run(example_usage())

