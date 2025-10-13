← [Accueil des scénarios](_Scenarios.md)

# Scénario 20 : Fichier PDF corrompu

## Nom du Scénario
Fichier PDF corrompu

## Description
Un membre tente de proposer une œuvre mais le fichier PDF est corrompu ou illisible, empêchant son traitement et son intégration dans la bibliothèque.

## Acteurs
- **Membre** : Utilisateur proposant une œuvre
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre est connecté et tente de proposer une œuvre
- Le fichier téléversé a une extension PDF
- Le fichier est corrompu, partiellement endommagé ou non conforme au standard PDF

## Étapes
1. Le membre sélectionne un fichier PDF à téléverser
2. Le système reçoit le fichier et commence la validation
3. Le système tente d'ouvrir et de lire le fichier PDF
4. Le système détecte que le fichier est corrompu ou illisible
5. Le système interrompt le processus de téléversement
6. Le système affiche un message d'erreur explicite :
   - "Fichier PDF corrompu ou illisible"
   - Détails techniques sur l'erreur détectée
7. Le système propose des solutions au membre :
   - Vérifier l'intégrité du fichier source
   - Re-scanner ou re-générer le PDF
   - Utiliser un outil de réparation PDF
   - Contacter le support technique
8. Le système supprime le fichier défaillant du système
9. Le système enregistre l'incident dans les logs pour analyse
10. Le membre peut réessayer avec un nouveau fichier corrigé
11. Le système conserve les métadonnées partielles pour faciliter une nouvelle soumission

## Résultat attendu
Le fichier corrompu est rejeté avec un diagnostic clair et des conseils pour permettre au membre de corriger le problème et soumettre à nouveau.
