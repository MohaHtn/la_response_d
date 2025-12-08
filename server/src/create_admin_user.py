#!/usr/bin/env python3
"""
Script pour créer un utilisateur administrateur
Usage: python create_admin_user.py [--username USERNAME] [--password PASSWORD] [--email EMAIL] [--force]
"""
import sys
import os
import asyncio
import argparse

# Ajouter le chemin du module au PYTHONPATH
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from app.domain.services.auth_service import AuthService
from app.infra.repositories.user_repository import user_repository


async def create_admin_user(username: str, password: str, email: str, force: bool = False):
    """
    Créer un utilisateur administrateur
    
    Args:
        username: Nom d'utilisateur
        password: Mot de passe
        email: Adresse email
    """
    # Vérifier si l'utilisateur existe déjà
    if await user_repository.user_exists(username):
        print(f"❌ L'utilisateur '{username}' existe déjà.")
        
        # Demander si on veut le mettre à jour
        if force:
            response = 'o'
        else:
            try:
                response = input("Voulez-vous le mettre à jour en tant qu'ADMIN ? (o/n): ")
            except EOFError:
                print("Mode non-interactif détecté. Utilisez --force pour forcer la mise à jour.")
                return

        if response.lower() == 'o':
            updates = {"account_type": "ADMIN"}
            await user_repository.update_user(username, updates)
            print(f"✅ L'utilisateur '{username}' a été mis à jour en ADMIN.")
        return

    # Hasher le mot de passe avec salt
    password_hash, salt = AuthService.hash_password(password)

    # Chiffrer les données sensibles
    encrypted_auth = AuthService.encrypt_auth_data(password_hash, salt)

    # Créer l'enregistrement utilisateur
    user_record = {
        "username": username,
        "email": email,
        "account_type": "ADMIN",  # ← Définir comme ADMIN
        "encrypted_auth": encrypted_auth
    }

    # Stocker dans Redis
    try:
        await user_repository.add_user(user_record)
        print(f"✅ Utilisateur administrateur '{username}' créé avec succès!")
        print(f"   Email: {email}")
        print(f"   Type: ADMIN")
    except Exception as e:
        print(f"❌ Erreur lors de la création: {e}")


async def main():
    """Point d'entrée principal"""
    parser = argparse.ArgumentParser(description='Créer un utilisateur administrateur')
    parser.add_argument('--username', type=str, help='Nom d\'utilisateur')
    parser.add_argument('--password', type=str, help='Mot de passe')
    parser.add_argument('--email', type=str, help='Email')
    parser.add_argument('--force', action='store_true', help='Forcer la mise à jour si l\'utilisateur existe')

    args = parser.parse_args()

    print("=" * 60)
    print("  Création d'un utilisateur administrateur")
    print("=" * 60)
    print()
    
    # Demander les informations si non fournies
    username = args.username or input("Nom d'utilisateur: ").strip()
    if not username:
        print("❌ Le nom d'utilisateur ne peut pas être vide.")
        return
    
    password = args.password or input("Mot de passe: ").strip()
    if not password:
        print("❌ Le mot de passe ne peut pas être vide.")
        return
    
    email = args.email or input("Email: ").strip()
    if not email:
        print("❌ L'email ne peut pas être vide.")
        return
    
    print()
    print(f"Création de l'utilisateur '{username}' en tant qu'ADMIN...")
    print()
    
    await create_admin_user(username, password, email, force=args.force)


if __name__ == "__main__":
    asyncio.run(main())

