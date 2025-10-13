← [Accueil des scénarios](_Scenarios.md)

# Scénario 12 : Rechercher une œuvre

## Nom du Scénario
Rechercher une œuvre

## Description
Un membre utilise les fonctionnalités de recherche avancée pour trouver une œuvre spécifique dans la bibliothèque.

## Acteurs
- **Membre** : Utilisateur authentifié recherchant une œuvre
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre est connecté à son compte
- Des œuvres sont disponibles dans la bibliothèque
- L'index de recherche est à jour

## Étapes
1. Le membre accède à la fonction de recherche
2. Le membre saisit ses critères de recherche (titre, auteur, mots-clés)
3. Le membre peut appliquer des filtres (catégorie, année, disponibilité)
4. Le système interroge l'index de recherche
5. Le système applique les filtres de droits d'accès du membre
6. Le système trie les résultats par pertinence
7. Le système affiche la liste des œuvres correspondantes
8. Le membre peut affiner sa recherche avec de nouveaux critères
9. Le membre peut consulter les détails d'une œuvre trouvée
10. Le système enregistre la recherche dans l'historique du membre

## Résultat attendu
Le membre obtient une liste d'œuvres correspondant à ses critères et peut accéder aux œuvres autorisées.
