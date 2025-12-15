# UC-02 — Recherche d’une œuvre

Objectif: Permettre de trouver rapidement une œuvre par texte et filtres.

Acteurs: Visiteur, Membre, Modérateur

Pré-conditions:
- Des œuvres sont indexées et consultables.

Scénario principal:
1. L’utilisateur saisit un texte dans la barre de recherche.
2. Il applique des filtres (type, auteur, disponibilité, etc.).
3. Le frontend déclenche l’appel API avec pagination et filtres.
4. Les résultats s’affichent, avec un indicateur de chargement et gestion d’erreurs.
5. L’utilisateur peut changer de page, trier, ou consulter une œuvre.

Post-conditions:
- Les résultats pertinents sont affichés, l’état de recherche est conservé.

Erreurs/Alternatives:
- Aucun résultat → message d’information, suggestions.
- API en erreur → toast d’erreur, possibilité de réessayer.
