← [Accueil des scénarios](_Scenarios.md)

# Scénario 13 : Consulter l'historique des emprunts
## Nom du Scénario
Consulter l'historique des emprunts

## Description
Un membre consulte l'historique complet de ses emprunts passés et actuels pour suivre son activité dans la bibliothèque.

## Acteurs
- **Membre** : Utilisateur authentifié
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre est connecté à son compte
- Le membre a effectué au moins un emprunt dans le passé
- L'historique des emprunts est conservé dans le système

## Étapes
1. Le membre accède à sa section "Mon historique"
2. Le système récupère tous les emprunts du membre (passés et actuels)
3. Le système affiche la liste chronologique des emprunts
4. Pour chaque emprunt, le système affiche : titre, auteur, date d'emprunt, date de retour
5. Le membre peut filtrer par période (mois, année)
6. Le membre peut filtrer par statut (en cours, retourné, expiré)
7. Le membre peut rechercher une œuvre spécifique dans son historique
8. Le membre peut voir les statistiques de lecture (nombre d'œuvres, genres préférés)
9. Le membre peut exporter son historique en format CSV
10. Le membre peut laisser des notes personnelles sur ses lectures passées

## Résultat attendu
Le membre dispose d'une vue complète de son activité de lecture et peut analyser ses habitudes de consultation.
