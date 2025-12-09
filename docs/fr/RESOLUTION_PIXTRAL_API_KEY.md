# Résolution de l'erreur PIXTRAL_API_KEY

## Problème
L'erreur `'Config' object has no attribute 'PIXTRAL_API_KEY'` se produisait lors du traitement OCR.

## Cause
Le fichier `.env` n'était pas chargé correctement lorsque le serveur était démarré depuis le répertoire `server/src/`. Les chemins relatifs pour trouver le fichier `.env` n'étaient pas adaptés à tous les cas d'usage.

## Solution appliquée

### Modifications dans `app_config.py`
1. **Amélioration du chargement du fichier .env** :
   - Ajout de chemins multiples pour rechercher le fichier `.env`
   - Utilisation du chemin absolu depuis le fichier actuel (`server_dir / ".env"`)
   - Ajout du chemin parent du répertoire courant (`Path.cwd().parent / ".env"`)
   - Utilisation de `override=True` pour s'assurer que les variables sont bien chargées

2. **Chemins testés** (dans l'ordre) :
   - `server/.env` (chemin absolu calculé depuis le fichier de configuration)
   - `./.env` (répertoire courant)
   - `../.env` (répertoire parent - important pour le cas `src/`)
   - `server/.env` (si lancé depuis la racine du projet)

## Tests effectués

### ✓ Test 1 : Depuis le dossier `server/`
```bash
cd server
python test_env.py
```
**Résultat** : ✓ Fichier .env chargé depuis: C:\...\server\.env

### ✓ Test 2 : Depuis le dossier `server/src/` (cas d'utilisation réel)
```bash
cd server/src
python -c "from app.infra.config import config; print(config.PIXTRAL_API_KEY)"
```
**Résultat** : ✓ Fichier .env chargé depuis: C:\...\server\.env

### ✓ Test 3 : Import du service Pixtral
Le service `pixtral_service.py` peut maintenant accéder à `config.PIXTRAL_API_KEY` sans erreur.

## Démarrage du serveur

Pour démarrer le serveur correctement :

```bash
cd server/src
python -m uvicorn app.main:app --reload
```

Le fichier `.env` sera maintenant chargé automatiquement et toutes les clés API seront disponibles.

## Vérification

Pour vérifier que tout fonctionne :

```bash
cd server
python test_pixtral_config.py
```

Ce script teste :
- Le chargement de la configuration
- L'existence de PIXTRAL_API_KEY
- L'importation du service Pixtral
- La création du client Mistral

## Fichiers modifiés

- ✅ `server/src/app/infra/config/app_config.py` - Amélioration du chargement du .env
- ✅ `server/test_pixtral_config.py` - Nouveau script de test (créé)

## Notes importantes

1. Le fichier `.env` contient les clés API et **NE DOIT JAMAIS** être commité dans Git
2. Il est déjà dans `.gitignore`
3. En production, utilisez des variables d'environnement système ou un service de gestion de secrets
4. Les clés API sont maintenant chargées de manière robuste quel que soit le répertoire de lancement

## Résultat final

✓ L'erreur `'Config' object has no attribute 'PIXTRAL_API_KEY'` est résolue
✓ Le serveur peut maintenant traiter les fichiers OCR sans problème
✓ La configuration est chargée de manière robuste

