# Scénario 1 : Installation de l'application

## Nom du Scénario
Installation de l'application

## Description
Un utilisateur installe la bibliothèque numérique décentralisée sur son système pour pouvoir utiliser les services de partage et d'emprunt d'œuvres numériques.

## Acteurs
- **Utilisateur** : Personne souhaitant installer l'application
- **Système** : Application de bibliothèque numérique

## Préconditions
- L'utilisateur dispose d'un ordinateur avec accès Internet
- Python est installé sur le système
- Git est disponible sur le système
- L'utilisateur a les droits d'administration nécessaires

## Étapes
1. L'utilisateur télécharge le code source de l'application depuis le dépôt Git
2. Le système vérifie la disponibilité des dépendances (Python, Git)
3. L'utilisateur exécute le script d'installation
4. Le système installe les dépendances Python (requirements.txt)
5. Le système configure la base de données locale
6. Le système initialise le dépôt Git local pour la gestion des œuvres
7. Le système crée la structure de répertoires (fond_commun, emprunts, sequestre, a_moderer)
8. L'utilisateur configure les paramètres de base (répertoire de stockage, clés API pour l'IA)
9. Le système démarre l'application web
10. L'utilisateur accède à l'interface web pour vérifier l'installation

## Résultat attendu
L'application est installée et fonctionnelle, prête à être utilisée pour gérer les œuvres numériques.
