← [Accueil des scénarios](_Scenarios.md)

# Scénario 15 : Synchroniser le dépôt Git

## Nom du Scénario
Synchroniser le dépôt Git
# Scénario 13 : Consulter l'historique des emprunts
## Description
Un membre synchronise son dépôt Git local avec le dépôt central pour récupérer les nouvelles œuvres et mettre à jour sa collection locale.

## Acteurs
- **Membre** : Utilisateur ayant configuré la synchronisation Git
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre a configuré un dépôt Git local
- Le membre a les droits d'accès au dépôt central
- Git est installé et configuré sur le système du membre
- Une connexion Internet est disponible

## Étapes
1. Le membre lance la synchronisation depuis l'interface ou en ligne de commande
2. Le système vérifie la connexion au dépôt central
3. Le système authentifie le membre avec ses clés Git
4. Le système compare les versions locales et distantes
5. Le système identifie les nouvelles œuvres disponibles pour le membre
6. Le système télécharge les nouvelles œuvres autorisées
7. Le système met à jour les métadonnées locales
8. Le système résout les éventuels conflits de versions
9. Le système met à jour l'index de recherche local
10. Le système notifie le membre des nouvelles œuvres disponibles
11. Le système génère un rapport de synchronisation

## Résultat attendu
Le dépôt local du membre est synchronisé avec les dernières œuvres disponibles et les métadonnées sont à jour.

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
