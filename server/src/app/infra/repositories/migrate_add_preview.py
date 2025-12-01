"""
Script de migration pour ajouter le champ 'preview' aux documents existants
"""
import asyncio
import json
from document_repository import document_repository


async def migrate_documents():
    """Ajoute le champ preview à tous les documents existants qui n'en ont pas"""
    print("Début de la migration...")

    # Récupérer tous les documents
    documents = await document_repository.get_all_documents()
    print(f"Nombre de documents trouvés : {len(documents)}")

    updated_count = 0

    for doc in documents:
        doc_id = doc.get('document_id')

        # Vérifier si le document a déjà une preview
        if 'preview' in doc and doc['preview']:
            print(f"Document {doc_id} a déjà une preview, skip.")
            continue

        # Récupérer le contenu markdown
        markdown_content = doc.get('markdown', {}).get('content', '')

        if not markdown_content:
            print(f"Document {doc_id} n'a pas de contenu markdown, skip.")
            continue

        # Générer la preview (300 premiers caractères)
        preview_text = markdown_content[:300] + "..." if len(markdown_content) > 300 else markdown_content

        # Mettre à jour le document avec la preview
        updates = {"preview": preview_text}
        success = await document_repository.update_document(doc_id, updates)

        if success:
            updated_count += 1
            print(f"✓ Document {doc_id} mis à jour avec preview ({len(preview_text)} caractères)")
        else:
            print(f"✗ Échec de la mise à jour du document {doc_id}")

    print(f"\nMigration terminée : {updated_count}/{len(documents)} documents mis à jour")


if __name__ == "__main__":
    asyncio.run(migrate_documents())

