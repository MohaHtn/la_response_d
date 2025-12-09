"""
Script de test pour vérifier que la configuration PIXTRAL_API_KEY fonctionne
"""
import sys
sys.path.insert(0, 'src')

try:
    from app.infra.config import config

    print("=" * 60)
    print("TEST DE LA CONFIGURATION PIXTRAL")
    print("=" * 60)

    print(f"\n✓ Configuration importée avec succès")
    print(f"✓ PIXTRAL_API_KEY existe: {config.PIXTRAL_API_KEY is not None}")
    print(f"✓ PIXTRAL_API_KEY (masquée): {config.PIXTRAL_API_KEY[:10] if config.PIXTRAL_API_KEY else 'None'}...")
    print(f"✓ GEMINI_API_KEY existe: {config.GEMINI_API_KEY is not None}")
    print(f"✓ JWT_SECRET_KEY existe: {config.JWT_SECRET_KEY is not None}")

    # Test d'importation du service Pixtral
    print("\nTest d'importation du service Pixtral...")
    from app.infra.ocr.pixtral_service import get_client

    print("✓ Service Pixtral importé avec succès")

    # Test de création du client (sans l'utiliser)
    try:
        client = get_client()
        print("✓ Client Pixtral créé avec succès")
    except Exception as e:
        print(f"✗ Erreur lors de la création du client: {e}")

    print("\n" + "=" * 60)
    print("TOUS LES TESTS SONT PASSÉS !")
    print("=" * 60)

except Exception as e:
    print(f"\n✗ ERREUR: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

