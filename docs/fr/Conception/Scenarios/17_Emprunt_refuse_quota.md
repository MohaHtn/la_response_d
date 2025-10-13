← [Accueil des scénarios](_Scenarios.md)

# Scénario 17 : Emprunt refusé (quota dépassé)

## Nom du Scénario
Emprunt refusé (quota dépassé)

## Description
Un membre tente d'emprunter une œuvre mais se voit refuser l'accès car il a déjà atteint son quota maximum d'emprunts simultanés.

## Acteurs
- **Membre** : Utilisateur tentant d'emprunter une œuvre
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre est connecté à son compte
- Le membre a déjà atteint son quota maximum d'emprunts (par exemple 3 œuvres)
- L'œuvre demandée est disponible à l'emprunt

## Étapes
1. Le membre sélectionne une œuvre à emprunter
2. Le membre clique sur "Emprunter cette œuvre"
3. Le système vérifie le nombre d'emprunts actuels du membre
4. Le système détecte que le quota maximum est atteint
5. Le système refuse l'emprunt
6. Le système affiche un message d'erreur explicite avec le quota actuel
7. Le système propose les options alternatives :
   - Voir la liste des emprunts actuels
   - Retourner une œuvre pour libérer un slot
   - Ajouter l'œuvre à une liste de souhaits
8. Le membre peut choisir de retourner une œuvre existante
9. Si retour effectué, le système relance automatiquement la procédure d'emprunt
10. Le système enregistre la tentative d'emprunt refusée dans les statistiques

## Résultat attendu
L'emprunt est refusé avec une explication claire et des options sont proposées au membre pour résoudre la situation.
