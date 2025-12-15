# UC-03 — Proposer une œuvre

Objectif: Permettre à un membre de proposer l’ajout d’une œuvre.

Acteurs: Membre, Bibliothécaire

Pré-conditions:
- L’utilisateur est authentifié (rôle Membre ou plus).

Scénario principal:
1. Le membre ouvre la page « Proposer une œuvre ».
2. Il téléverse un fichier et renseigne des métadonnées (titre, auteur, droits).
3. Le frontend affiche la progression (barre de chargement).
4. À la fin, un récapitulatif s’affiche avec le statut « à modérer ».
5. Le membre reçoit une confirmation et peut suivre l’état ultérieurement.

Post-conditions:
- L’œuvre apparaît dans la file « à modérer ».

Erreurs/Alternatives:
- Fichier invalide/poids trop important → message d’erreur.
- Interruption réseau → reprise ou nouvelle tentative.
