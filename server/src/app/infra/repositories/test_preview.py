"""
Test de la fonctionnalité preview
"""
import asyncio
from document_repository import document_repository


async def test_preview_feature():
    """Teste que les documents ont bien une preview"""
    print("=== Test de la fonctionnalité Preview ===\n")

    # Récupérer tous les documents
    documents = await document_repository.get_all_documents()
    print(f"Nombre de documents : {len(documents)}\n")

    if not documents:
        print("⚠️  Aucun document trouvé. Uploadez d'abord un document.")
        return

    # Analyser chaque document
    with_preview = 0
    without_preview = 0

    for doc in documents:
        doc_id = doc.get('document_id')
        title = doc.get('metadata', {}).get('title', 'Sans titre')
        preview = doc.get('preview', '')

        if preview:
            with_preview += 1
            preview_length = len(preview)
            preview_lines = preview.count('\n') + 1

            print(f"✓ Document: {title}")
            print(f"  ID: {doc_id}")
            print(f"  Preview: {preview_length} caractères, {preview_lines} lignes")
            print(f"  Extrait: {preview[:100]}...")
            print()
        else:
            without_preview += 1
            print(f"✗ Document: {title}")
            print(f"  ID: {doc_id}")
            print(f"  ⚠️  Pas de preview disponible")
            print()

    # Statistiques
    print("=" * 50)
    print(f"Résumé:")
    print(f"  Total: {len(documents)} documents")
    print(f"  Avec preview: {with_preview} ({with_preview/len(documents)*100:.1f}%)")
    print(f"  Sans preview: {without_preview} ({without_preview/len(documents)*100:.1f}%)")

    if without_preview > 0:
        print(f"\n⚠️  {without_preview} document(s) sans preview.")
        print("Exécutez migrate_add_preview.py pour ajouter les previews manquantes.")


if __name__ == "__main__":
    asyncio.run(test_preview_feature())

