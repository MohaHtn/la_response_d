# Scénario 10 : Diffuser automatiquement les œuvres libres de droits

## Nom du Scénario
Diffuser automatiquement les œuvres libres de droits

## Description
Le système diffuse automatiquement les œuvres devenues libres de droits à l'ensemble des membres disposant d'espace disque partagé.

## Acteurs
- **Système** : Application de bibliothèque numérique (processus automatique)
- **Membres** : Utilisateurs ayant configuré l'espace disque partagé

## Préconditions
- Des œuvres ont basculé dans le domaine public (expiration des droits)
- Des membres ont activé la synchronisation automatique
- Les membres disposent d'espace disque suffisant
- Le processus de synchronisation Git est fonctionnel

## Étapes
1. Le système exécute périodiquement une vérification des droits d'auteur
2. Le système identifie les œuvres dont les droits ont expiré
3. Le système déplace automatiquement ces œuvres vers "fond_commun"
4. Le système met à jour les métadonnées (statut libre de droits)
5. Le système identifie les membres ayant activé la synchronisation automatique
6. Pour chaque membre éligible, le système vérifie l'espace disque disponible
7. Le système initie la synchronisation Git avec les dépôts membres
8. Le système copie les nouvelles œuvres libres dans les dépôts locaux des membres
9. Le système met à jour les index de recherche locaux
10. Le système notifie les membres des nouvelles œuvres disponibles
11. Le système génère un rapport de diffusion automatique

## Résultat attendu
Les œuvres nouvellement libres de droits sont automatiquement distribuées aux membres participants, enrichissant leur collection locale.
