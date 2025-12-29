← [Accueil des scénarios](_Scenarios.md)

# Scénario 9 : Gérer les métadonnées d'une œuvre

## Nom du Scénario
Gérer les métadonnées d'une œuvre via l'application web et l'IA

## Description
Un bibliothécaire ou un membre autorisé utilise l'application web pour modifier et enrichir 
les métadonnées d'une œuvre. 
L'IA intégrée propose automatiquement des métadonnées extraites à partir du fichier du livre (PDF, image, etc.), 
que le bibliothécaire peut valider ou corriger pour améliorer la découvrabilité et la classification.

## Acteurs
- **Bibliothécaire** : Utilisateur avec droits de modification des métadonnées
- **Membre contributeur** : Membre ayant proposé l'œuvre originale
- **Système** : Application web de bibliothèque numérique
- **IA** : Module d'intelligence artificielle pour l'extraction automatique des métadonnées

## Préconditions
- Le bibliothécaire a les droits nécessaires pour modifier les métadonnées
- L'œuvre existe dans le système
- L'œuvre a des métadonnées de base existantes ou un fichier source disponible

## Étapes
1. Le bibliothécaire accède à la fiche détaillée de l'œuvre via l'application web
2. Le bibliothécaire clique sur "Modifier les métadonnées"
3. Le système affiche le formulaire d'édition des métadonnées
4. L'IA analyse le fichier du livre et propose automatiquement des métadonnées (titre, auteur, description, mots-clés, ISBN, etc.)
5. Le modérateur valide, complète ou corrige les suggestions de l'IA
6. Le bibliothécaire peut ajouter des catégories supplémentaires
7. Le bibliothécaire peut corriger la date de publication
8. Le bibliothécaire peut ajouter des informations sur l'édition
9. Le bibliothécaire peut modifier la langue de l'œuvre
10. Le système valide les formats des données saisies (ISBN, dates)
11. Le bibliothécaire sauvegarde les modifications
12. Le système met à jour l'index de recherche
13. Le système enregistre l'historique des modifications avec horodatage

## Résultat attendu
Les métadonnées de l'œuvre sont enrichies grâce à l'IA et à la validation humaine, ce qui améliore la découvrabilité dans la bibliothèque.
