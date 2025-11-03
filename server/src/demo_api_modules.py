#!/usr/bin/env python3
"""
Démonstration de l'utilisation de l'architecture modulaire de l'API
"""
import asyncio
from app.api import (
    AuthService,
    UserCredentials,
    LoginCredentials,
    user_repository,
    crypto_manager,
    config
)


async def demo_auth_service():
    """Démonstration du service d'authentification"""
    print("\n" + "="*60)
    print("🔐 Démonstration du Service d'Authentification")
    print("="*60)

    password = "super_secret_password_123"
    print(f"\n1. Hachage du mot de passe: '{password}'")

    # Hachage du mot de passe
    password_hash, salt = AuthService.hash_password(password)
    print(f"   ✅ Hash généré (tronqué): {password_hash.hex()[:32]}...")
    print(f"   ✅ Salt généré (tronqué): {salt.hex()[:32]}...")

    # Vérification du mot de passe correct
    print(f"\n2. Vérification du mot de passe correct")
    is_valid = AuthService.verify_password(password, password_hash, salt)
    print(f"   ✅ Résultat: {is_valid}")

    # Vérification d'un mot de passe incorrect
    print(f"\n3. Vérification d'un mot de passe incorrect")
    is_valid = AuthService.verify_password("wrong_password", password_hash, salt)
    print(f"   ✅ Résultat: {is_valid}")

    # Chiffrement des données d'authentification
    print(f"\n4. Chiffrement des données d'authentification")
    encrypted = AuthService.encrypt_auth_data(password_hash, salt)
    print(f"   ✅ Données chiffrées (tronquées): {encrypted[:40]}...")

    # Déchiffrement
    print(f"\n5. Déchiffrement des données")
    decrypted = AuthService.decrypt_auth_data(encrypted)
    print(f"   ✅ Hash récupéré: {decrypted['password_hash'] == password_hash}")
    print(f"   ✅ Salt récupéré: {decrypted['salt'] == salt}")


async def demo_user_repository():
    """Démonstration du repository utilisateur"""
    print("\n" + "="*60)
    print("👥 Démonstration du Repository Utilisateur")
    print("="*60)

    # Utiliser un fichier temporaire pour la démo
    import tempfile
    import os
    temp_file = tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False)
    temp_file.close()

    from app.api.users import UserRepository
    demo_repo = UserRepository(temp_file.name)

    print(f"\n1. Vérification d'un utilisateur inexistant")
    exists = await demo_repo.user_exists("john_doe")
    print(f"   ✅ L'utilisateur existe: {exists}")

    print(f"\n2. Ajout d'un nouvel utilisateur")
    user_record = {
        "username": "john_doe",
        "email": "john@example.com",
        "encrypted_auth": "encrypted_data_here"
    }
    await demo_repo.add_user(user_record)
    print(f"   ✅ Utilisateur 'john_doe' ajouté")

    print(f"\n3. Vérification que l'utilisateur existe maintenant")
    exists = await demo_repo.user_exists("john_doe")
    print(f"   ✅ L'utilisateur existe: {exists}")

    print(f"\n4. Récupération de l'utilisateur")
    retrieved = await demo_repo.get_user_record("john_doe")
    print(f"   ✅ Username: {retrieved['username']}")
    print(f"   ✅ Email: {retrieved['email']}")

    # Nettoyage
    os.unlink(temp_file.name)
    print(f"\n   🧹 Fichier temporaire supprimé")


async def demo_crypto_manager():
    """Démonstration du gestionnaire de chiffrement"""
    print("\n" + "="*60)
    print("🔒 Démonstration du Gestionnaire de Chiffrement")
    print("="*60)

    data = "Information sensible à protéger"
    print(f"\n1. Données à chiffrer: '{data}'")

    # Chiffrement
    encrypted = crypto_manager.encrypt(data.encode())
    print(f"   ✅ Données chiffrées (tronquées): {encrypted[:40]}...")

    # Déchiffrement
    decrypted = crypto_manager.decrypt(encrypted)
    print(f"\n2. Déchiffrement")
    print(f"   ✅ Données déchiffrées: '{decrypted.decode()}'")
    print(f"   ✅ Correspondance: {decrypted.decode() == data}")


def demo_models():
    """Démonstration des modèles Pydantic"""
    print("\n" + "="*60)
    print("📋 Démonstration des Modèles de Validation")
    print("="*60)

    # UserCredentials valide
    print(f"\n1. Création d'identifiants utilisateur valides")
    try:
        creds = UserCredentials(
            username="john_doe",
            password="secure123",
            email="john@example.com"
        )
        print(f"   ✅ Username: {creds.username}")
        print(f"   ✅ Email: {creds.email}")
    except Exception as e:
        print(f"   ❌ Erreur: {e}")

    # Email invalide
    print(f"\n2. Tentative avec un email invalide")
    try:
        creds = UserCredentials(
            username="jane_doe",
            password="secure123",
            email="invalid_email"
        )
        print(f"   ❌ Validation réussie (ne devrait pas arriver)")
    except Exception as e:
        print(f"   ✅ Validation échouée comme attendu: Email invalide")

    # LoginCredentials
    print(f"\n3. Création d'identifiants de connexion")
    login = LoginCredentials(username="john_doe", password="password123")
    print(f"   ✅ Username: {login.username}")


def demo_config():
    """Démonstration de la configuration"""
    print("\n" + "="*60)
    print("⚙️  Démonstration de la Configuration")
    print("="*60)

    print(f"\n📁 Chemins de fichiers:")
    print(f"   • Clé de chiffrement: {config.get_key_file_path()}")
    print(f"   • Base utilisateurs: {config.get_users_file_path()}")
    print(f"   • Résultats OCR: {config.get_ocr_result_path()}")

    print(f"\n🔒 Paramètres de sécurité:")
    print(f"   • Itérations PBKDF2: {config.PBKDF2_ITERATIONS}")
    print(f"   • Algorithme de hachage: {config.HASH_ALGORITHM}")
    print(f"   • Longueur du salt: {config.SALT_LENGTH} bytes")

    print(f"\n📤 Paramètres d'upload:")
    print(f"   • Taille max fichier: {config.MAX_FILE_SIZE_BYTES / (1024*1024)} MB")
    print(f"   • Types autorisés: {', '.join(config.ALLOWED_CONTENT_TYPES)}")

    print(f"\n🌐 Paramètres API:")
    print(f"   • Préfixe API: {config.API_PREFIX}")
    print(f"   • Titre API: {config.API_TITLE}")


async def main():
    """Fonction principale de démonstration"""
    print("\n" + "🚀"*30)
    print("   DÉMONSTRATION DE L'ARCHITECTURE MODULAIRE API")
    print("🚀"*30)

    # Démonstrations synchrones
    demo_config()
    demo_models()

    # Démonstrations asynchrones
    await demo_crypto_manager()
    await demo_auth_service()
    await demo_user_repository()

    print("\n" + "="*60)
    print("✅ Toutes les démonstrations terminées avec succès!")
    print("="*60)
    print("\n💡 L'architecture modulaire permet:")
    print("   • Testabilité: Chaque module peut être testé isolément")
    print("   • Réutilisabilité: Les services sont indépendants")
    print("   • Maintenabilité: Code organisé et documenté")
    print("   • Extensibilité: Facile d'ajouter de nouveaux modules")
    print("\n")


if __name__ == "__main__":
    asyncio.run(main())

