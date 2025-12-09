# Configuration - Clés API

## 🔐 Mise en place des clés API (IMPORTANT)

### Étape 1 : Créer le fichier `.env`

Dans le dossier `server/`, créez un fichier `.env` avec le contenu suivant :

```env
# Clés API - REMPLACEZ avec vos vraies clés
GEMINI_API_KEY=AIzaSyAyfxIjOQ-0Is-zi-7GVvUhIwXZXQSlNxo
PIXTRAL_API_KEY=cWgN50RHp3Gik7bRhplpBn1ljKZAGQaZ

# Sécurité JWT
JWT_SECRET_KEY=4c7004d38e046586ba9de4f54be233583abfa405101e54a36e4ccaa5583edd12

# Configuration
MAX_FILE_SIZE_MB=200
ENVIRONMENT=development
DEBUG=True
```

###Étape 2 : Vérifier les permissions

Le fichier `.env` ne doit **JAMAIS** être commité dans Git. Il est déjà inclus dans `.gitignore`.

### Étape 3 : Démarrer l'application

```bash
cd server/src
python -m uvicorn app.main:app --reload
```

L'application chargera automatiquement les clés depuis le fichier `.env`.

## ⚠️ SÉCURITÉ

- ❌ **NE JAMAIS** committer le fichier `.env` dans Git
- ❌ **NE JAMAIS** partager vos clés API
- ✅ Utilisez `.env.example` comme modèle
- ✅ En production, utilisez des variables d'environnement système ou un service de gestion de secrets

## 📚 Documentation complète

Consultez `docs/fr/GUIDE_SECURITE_API_KEYS.md` pour la documentation complète sur la sécurité.

