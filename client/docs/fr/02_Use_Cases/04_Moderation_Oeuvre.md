# UC-04 — Modérer une œuvre

Objectif: Permettre à un bibliothécaire de valider ou rejeter une œuvre proposée.

Acteurs: Bibliothécaire (Modérateur)

Pré-conditions:
- L’utilisateur est authentifié avec rôle Modérateur.
- Des œuvres sont en attente dans « à modérer ».

Scénario principal:
1. Le modérateur ouvre la page de modération.
2. Il consulte la liste des œuvres à valider.
3. Il ouvre le détail d’une œuvre et vérifie les métadonnées/prévisualisation.
4. Il choisit « Valider » ou « Rejeter » (avec motif).
5. Le frontend envoie la décision à l’API et actualise la liste.

Post-conditions:
- L’œuvre passe au statut « validée » (fond commun) ou « rejetée ».

Erreurs/Alternatives:
- Conflit de mise à jour → rechargement de la liste et avertissement.
