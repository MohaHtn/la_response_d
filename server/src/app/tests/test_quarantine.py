"""
Tests pour les endpoints de quarantaine
"""
import asyncio
import json
from app.infra.repositories.document_repository import document_repository
from app.api.models import BookStatus
from datetime import datetime


async def test_quarantine_functionality():
    """Test complet de la fonctionnalité de quarantaine"""

    print("=" * 80)
    print("TEST DE LA FONCTIONNALITÉ DE QUARANTAINE")
    print("=" * 80)

    # 1. Créer un document conforme (normal)
    print("\n1. Test : Ajout d'un document conforme (normal)")
    compliant_doc = {
        "document_id": "test_doc_compliant_001",
        "metadata": {
            "title": "Document Conforme",
            "author": "Auteur Test",
            "parution_date": "2023",
            "is_appropriate": "true",
            "is_harmful": False
        },
        "uploader": {
            "username": "test_user",
            "upload_date": datetime.now().isoformat()
        },
        "moderation": {
            "approval_process": {
                "status": BookStatus.WAITING.value,
                "date": datetime.now().isoformat(),
                "details": ""
            },
            "approved_by": []
        },
        "markdown": {
            "content": "# Contenu du document conforme"
        },
        "security_analysis": {
            "has_prompt_injection": False,
            "has_jailbreak_attempt": False
        },
        "content_analysis": {
            "is_appropriate": True
        },
        "compliance_issues": [],
        "in_quarantine": False
    }

    doc_id_compliant = await document_repository.add_document(compliant_doc)
    print(f"   ✓ Document conforme ajouté avec ID: {doc_id_compliant}")

    # Vérifier que le document existe dans les documents normaux
    retrieved_compliant = await document_repository.get_document(doc_id_compliant)
    assert retrieved_compliant is not None, "Le document conforme devrait exister"
    print(f"   ✓ Document conforme récupéré avec succès")

    # 2. Créer un document non conforme (quarantaine)
    print("\n2. Test : Ajout d'un document non conforme (quarantaine)")
    non_compliant_doc = {
        "document_id": "test_doc_quarantine_001",
        "metadata": {
            "title": "Document Non Conforme",
            "author": "Auteur Suspect",
            "parution_date": "2023",
            "is_appropriate": "false",
            "is_harmful": True
        },
        "uploader": {
            "username": "test_user",
            "upload_date": datetime.now().isoformat()
        },
        "moderation": {
            "approval_process": {
                "status": BookStatus.WAITING.value,
                "date": datetime.now().isoformat(),
                "details": "Injection de prompt détectée; Contenu inapproprié détecté"
            },
            "approved_by": []
        },
        "markdown": {
            "content": "# Contenu suspect avec injection"
        },
        "security_analysis": {
            "has_prompt_injection": True,
            "has_jailbreak_attempt": False
        },
        "content_analysis": {
            "is_appropriate": False
        },
        "compliance_issues": [
            "Injection de prompt détectée",
            "Contenu inapproprié détecté"
        ],
        "in_quarantine": True
    }

    doc_id_quarantine = await document_repository.add_document_to_quarantine(non_compliant_doc)
    print(f"   ✓ Document non conforme placé en quarantaine avec ID: {doc_id_quarantine}")

    # Vérifier que le document n'existe PAS dans les documents normaux
    retrieved_normal = await document_repository.get_document(doc_id_quarantine)
    assert retrieved_normal is None, "Le document en quarantaine ne devrait pas être dans les documents normaux"
    print(f"   ✓ Vérifié : le document n'est pas dans les documents normaux")

    # Vérifier que le document existe dans la quarantaine
    retrieved_quarantine = await document_repository.get_quarantined_document(doc_id_quarantine)
    assert retrieved_quarantine is not None, "Le document devrait être en quarantaine"
    assert retrieved_quarantine["in_quarantine"] == True
    print(f"   ✓ Document en quarantaine récupéré avec succès")

    # 3. Récupérer tous les documents en quarantaine
    print("\n3. Test : Récupération de tous les documents en quarantaine")
    all_quarantined = await document_repository.get_all_quarantined_documents()
    print(f"   ✓ Nombre de documents en quarantaine: {len(all_quarantined)}")
    assert len(all_quarantined) >= 1, "Il devrait y avoir au moins 1 document en quarantaine"

    # Afficher les détails
    for doc in all_quarantined:
        print(f"     - {doc['metadata']['title']} (ID: {doc['document_id']})")
        print(f"       Issues: {', '.join(doc.get('compliance_issues', []))}")

    # 4. Créer un deuxième document pour tester le rejet
    print("\n4. Test : Ajout d'un deuxième document pour tester le rejet")
    doc_to_reject = {
        "document_id": "test_doc_quarantine_002",
        "metadata": {
            "title": "Document à Rejeter",
            "author": "Auteur Test",
            "parution_date": "2023",
            "is_appropriate": "false",
            "is_harmful": True
        },
        "uploader": {
            "username": "test_user",
            "upload_date": datetime.now().isoformat()
        },
        "moderation": {
            "approval_process": {
                "status": BookStatus.WAITING.value,
                "date": datetime.now().isoformat(),
                "details": "Tentative de jailbreak détectée"
            },
            "approved_by": []
        },
        "markdown": {
            "content": "# Contenu avec jailbreak"
        },
        "security_analysis": {
            "has_prompt_injection": False,
            "has_jailbreak_attempt": True
        },
        "content_analysis": {
            "is_appropriate": True
        },
        "compliance_issues": [
            "Tentative de jailbreak détectée"
        ],
        "in_quarantine": True
    }

    doc_id_to_reject = await document_repository.add_document_to_quarantine(doc_to_reject)
    print(f"   ✓ Document à rejeter ajouté avec ID: {doc_id_to_reject}")

    # 5. Test d'approbation (déplacement vers documents normaux)
    print("\n5. Test : Approbation d'un document en quarantaine")
    success_approve = await document_repository.move_from_quarantine_to_approved(doc_id_quarantine)
    assert success_approve == True, "L'approbation devrait réussir"
    print(f"   ✓ Document {doc_id_quarantine} approuvé avec succès")

    # Vérifier que le document n'est plus en quarantaine
    still_in_quarantine = await document_repository.get_quarantined_document(doc_id_quarantine)
    assert still_in_quarantine is None, "Le document ne devrait plus être en quarantaine"
    print(f"   ✓ Vérifié : le document n'est plus en quarantaine")

    # Vérifier que le document est maintenant dans les documents normaux
    now_in_normal = await document_repository.get_document(doc_id_quarantine)
    assert now_in_normal is not None, "Le document devrait être dans les documents normaux"
    assert now_in_normal["in_quarantine"] == False
    assert now_in_normal["moderation"]["approval_process"]["status"] == "OK"
    print(f"   ✓ Vérifié : le document est maintenant dans les documents normaux avec statut OK")

    # 6. Test de rejet (suppression)
    print("\n6. Test : Rejet d'un document en quarantaine")
    success_reject = await document_repository.delete_quarantined_document(doc_id_to_reject)
    assert success_reject == True, "Le rejet devrait réussir"
    print(f"   ✓ Document {doc_id_to_reject} rejeté avec succès")

    # Vérifier que le document n'existe plus
    deleted_doc = await document_repository.get_quarantined_document(doc_id_to_reject)
    assert deleted_doc is None, "Le document ne devrait plus exister"
    print(f"   ✓ Vérifié : le document a été supprimé définitivement")

    # 7. Nettoyage - Supprimer les documents de test
    print("\n7. Nettoyage des documents de test")
    await document_repository.delete_document(doc_id_compliant)
    print(f"   ✓ Document conforme supprimé: {doc_id_compliant}")

    await document_repository.delete_document(doc_id_quarantine)
    print(f"   ✓ Document approuvé supprimé: {doc_id_quarantine}")

    print("\n" + "=" * 80)
    print("✅ TOUS LES TESTS SONT PASSÉS AVEC SUCCÈS !")
    print("=" * 80)


async def test_quarantine_edge_cases():
    """Test des cas limites"""

    print("\n" + "=" * 80)
    print("TEST DES CAS LIMITES")
    print("=" * 80)

    # Test 1 : Approuver un document qui n'existe pas
    print("\n1. Test : Approuver un document inexistant")
    result = await document_repository.move_from_quarantine_to_approved("doc_inexistant_999")
    assert result == False, "L'approbation d'un document inexistant devrait échouer"
    print("   ✓ Échec attendu pour document inexistant")

    # Test 2 : Supprimer un document qui n'existe pas
    print("\n2. Test : Supprimer un document inexistant")
    result = await document_repository.delete_quarantined_document("doc_inexistant_999")
    assert result == False, "La suppression d'un document inexistant devrait échouer"
    print("   ✓ Échec attendu pour document inexistant")

    # Test 3 : Récupérer un document inexistant
    print("\n3. Test : Récupérer un document inexistant")
    result = await document_repository.get_quarantined_document("doc_inexistant_999")
    assert result is None, "La récupération devrait retourner None"
    print("   ✓ None retourné pour document inexistant")

    print("\n" + "=" * 80)
    print("✅ TOUS LES TESTS DES CAS LIMITES SONT PASSÉS !")
    print("=" * 80)


async def main():
    """Point d'entrée principal pour les tests"""
    try:
        await test_quarantine_functionality()
        await test_quarantine_edge_cases()

        print("\n" + "=" * 80)
        print("🎉 TOUS LES TESTS SONT RÉUSSIS !")
        print("=" * 80)

    except AssertionError as e:
        print(f"\n❌ ÉCHEC DU TEST: {e}")
    except Exception as e:
        print(f"\n❌ ERREUR LORS DU TEST: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())

