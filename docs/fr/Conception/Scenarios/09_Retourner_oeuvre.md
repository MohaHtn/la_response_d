← [Accueil des scénarios](_Scenarios.md)

# Scénario 9 : Retourner une œuvre empruntée

## Nom du Scénario
Retourner une œuvre empruntée

## Description
Un membre retourne une œuvre qu'il avait empruntée, libérant ainsi l'accès pour d'autres membres et mettant fin à sa période d'emprunt.

## Acteurs
- **Membre** : Utilisateur ayant emprunté une œuvre
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre est connecté à son compte
- Le membre a au moins une œuvre empruntée
- L'œuvre est dans le répertoire "emprunts" du membre

## Étapes
1. Le membre accède à sa section "Mes emprunts"
2. Le système affiche la liste des œuvres actuellement empruntées
3. Le membre sélectionne l'œuvre à retourner
4. Le membre clique sur "Retourner cette œuvre"
5. Le système demande confirmation du retour
6. Le membre confirme le retour anticipé ou automatique
7. Le système supprime l'œuvre chiffrée du répertoire "emprunts" du membre
8. Le système met à jour le statut de l'œuvre (disponible)
9. Le système enregistre la date de retour dans l'historique
10. Le système remet l'œuvre dans le répertoire "séquestre" pour nouvel emprunt
11. Le système notifie le membre de la confirmation de retour
12. Le système met à jour les statistiques d'emprunt

## Résultat attendu
L'œuvre est retournée, n'est plus accessible au membre et redevient disponible pour d'autres emprunts.
