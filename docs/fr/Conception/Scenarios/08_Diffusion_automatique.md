← [Accueil des scénarios](_Scenarios.md)

# Scénario 10 : Diffuser automatiquement les œuvres libres de droits

## Nom du Scénario
Diffuser automatiquement les œuvres libres de droits

## Description
Le système diffuse automatiquement les œuvres devenues libres de droits à l'ensemble des membres disposant d'espace disque partagé.

## Acteurs
- **Système** : Application de bibliothèque numérique (processus automatique)
- **Membres** : Bibliothécaire/Administrateurs de la bibliothèque

## Préconditions
- Des œuvres ont basculé dans le domaine public (expiration des droits)

## Étapes
1. Le système exécute périodiquement une vérification des droits d'auteur, dans le dossier dédié
2. Le système identifie les œuvres dont les droits ont expiré
3. Le système déplace automatiquement ces œuvres vers "fond_commun"
4. Le système met à jour les métadonnées
5. Le système indique le l'œuvre est disponible
6. Le système met à jour les index de recherche locaux

## Résultat attendu
Les œuvres nouvellement libres de droits sont automatiquement distribuées aux membres participants, enrichissant leur collection locale.
