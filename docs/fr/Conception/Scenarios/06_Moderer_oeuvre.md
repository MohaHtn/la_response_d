← [Accueil des scénarios](_Scenarios.md)

# Scénario 6 : Modérer une œuvre

## Nom du Scénario
Modérer une œuvre

## Description
Un bibliothécaire examine une œuvre proposée par un membre, vérifie sa conformité, enrichit ses métadonnées et décide de sa validation ou de son rejet.

## Acteurs
- **Bibliothécaire** : Utilisateur avec droits de modération
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le bibliothécaire est connecté avec ses droits de modération
- Une ou plusieurs œuvres sont en attente dans le répertoire "a_moderer"
- L'œuvre a été soumise par un membre avec métadonnées de base

## Étapes
1. Le bibliothécaire accède à la liste des œuvres à modérer
2. Le bibliothécaire sélectionne une œuvre à examiner
3. Le système affiche l'œuvre avec ses métadonnées actuelles
4. Le bibliothécaire consulte le contenu de l'œuvre (aperçu PDF)
5. Le bibliothécaire vérifie les droits d'auteur et la légalité
6. Le bibliothécaire enrichit les métadonnées (ISBN, description détaillée, mots-clés)
7. Le bibliothécaire corrige les éventuelles erreurs de saisie
8. Le bibliothécaire détermine la catégorie précise de l'œuvre
9. Le bibliothécaire prend une décision : Valider, Rejeter, ou Demander modifications
10. Si validation : le système déplace l'œuvre vers le répertoire approprié (fond_commun ou séquestre)
11. Si rejet : le système notifie le membre avec justification
12. Le système met à jour le statut de l'œuvre et l'historique de modération

## Résultat attendu
L'œuvre est soit validée et disponible aux membres, soit rejetée avec justification, soit renvoyée au membre pour modifications.
