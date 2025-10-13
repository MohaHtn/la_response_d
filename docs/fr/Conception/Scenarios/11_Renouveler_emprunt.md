← [Accueil des scénarios](_Scenarios.md)

# Scénario 11 : Renouveler un emprunt

## Nom du Scénario
Renouveler un emprunt

## Description
Un membre demande le renouvellement d'un emprunt avant son expiration pour prolonger son accès à une œuvre.

## Acteurs
- **Membre** : Utilisateur ayant emprunté une œuvre
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre a une œuvre empruntée active
- L'emprunt n'a pas encore expiré
- Aucune réservation n'existe pour cette œuvre
- Le membre n'a pas dépassé le nombre maximum de renouvellements

## Étapes
1. Le membre accède à ses emprunts en cours
2. Le membre sélectionne l'œuvre à renouveler
3. Le membre clique sur "Demander un renouvellement"
4. Le système vérifie l'éligibilité au renouvellement
5. Le système vérifie qu'aucune réservation n'est en attente
6. Le système vérifie le nombre de renouvellements déjà effectués
7. Le système prolonge automatiquement la période d'emprunt de 2 semaines
8. Le système met à jour la date d'échéance dans l'enregistrement d'emprunt
9. Le système notifie le membre de la confirmation du renouvellement
10. Le système programme un nouveau rappel avant la nouvelle échéance

## Résultat attendu
L'emprunt est prolongé de 2 semaines supplémentaires et le membre continue d'avoir accès à l'œuvre.
