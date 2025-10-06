# Scénario 5 : Emprunter une œuvre

## Nom du Scénario
Emprunter une œuvre

## Description
Un membre emprunte une œuvre numérique sous droits pour une période de deux semaines maximum.

## Acteurs
- **Membre** : Utilisateur authentifié souhaitant emprunter une œuvre
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre est connecté à son compte
- L'œuvre est disponible à l'emprunt (dans le séquestre ou validée)
- Le membre n'a pas dépassé son quota d'emprunts simultanés
- L'œuvre n'est pas déjà empruntée par un autre membre

## Étapes
1. Le membre recherche ou consulte une œuvre disponible
2. Le membre clique sur "Emprunter cette œuvre"
3. Le système vérifie les droits d'emprunt du membre
4. Le système vérifie la disponibilité de l'œuvre
5. Le système crée un enregistrement d'emprunt avec date de début et fin
6. Le système chiffre l'œuvre avec la clé personnelle du membre
7. Le système déplace l'œuvre chiffrée dans le répertoire "emprunts" du membre
8. Le système met à jour le statut de l'œuvre (empruntée)
9. Le système envoie une confirmation d'emprunt au membre
10. Le système programme un rappel automatique avant l'échéance
11. Le membre peut télécharger et consulter l'œuvre empruntée

## Résultat attendu
Le membre dispose de l'œuvre chiffrée pour une période de deux semaines et peut la consulter librement.
