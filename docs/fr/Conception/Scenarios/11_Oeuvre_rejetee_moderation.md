← [Accueil des scénarios](_Scenarios.md)

# Scénario 11: Œuvre rejetée par la modération

## Nom du Scénario
Œuvre rejetée par la modération

## Description
Un bibliothécaire rejette une œuvre proposée par un membre lors du processus de modération en raison de problèmes de droits d'auteur ou de contenu inapproprié.

## Acteurs
- **Bibliothécaire** : Utilisateur avec droits de modération
- **Membre** : Utilisateur ayant proposé l'œuvre
- **Système** : Application de bibliothèque numérique

## Préconditions
- Une œuvre est en cours de modération dans le répertoire "a_moderer"
- Le bibliothécaire examine l'œuvre
- L'œuvre présente des problèmes (droits d'auteur, contenu inapproprié, qualité insuffisante)

## Étapes
1. Le bibliothécaire examine une œuvre en attente de modération
2. Le bibliothécaire identifie un problème bloquant (violation de droits, contenu illégal)
3. Le bibliothécaire sélectionne "Supprimer le livre"
4. Le système demande de spécifier le motif de rejet dans une liste prédéfinie
5. Le bibliothécaire sélectionne le motif et ajoute des commentaires détaillés
6. Le système supprime l'œuvre du répertoire "a_moderer"
7. Le système archive l'œuvre rejetée avec ses métadonnées pour traçabilité
8. Le système envoie une notification détaillée au membre avec :
   - Le motif du rejet
   - Les commentaires du bibliothécaire
   - Les actions possibles (correction, contestation)
9. Le système met à jour les statistiques de modération
10. Le membre reçoit l'email de notification de rejet

## Résultat attendu
L'œuvre non conforme est rejetée avec justification claire et le membre est informé des possibilités de recours.
