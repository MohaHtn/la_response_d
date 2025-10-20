← [Accueil des scénarios](_Scenarios.md)

# Scénario 16 : Échec de l'OCR

## Nom du Scénario
Échec de l'OCR

## Description
Le processus de reconnaissance de texte échoue lors du traitement d'une œuvre PDF, empêchant l'extraction du contenu textuel.

## Acteurs
- **Système** : Application de bibliothèque numérique
- **IA OCR** : Pixtral (en échec)
- **Bibliothécaire** : Intervient pour résoudre le problème

## Préconditions
- Une œuvre PDF est en cours de traitement OCR
- Le fichier PDF existe et est accessible
- Les services d'IA sont normalement configurés

## Étapes
1. Le système lance le processus OCR sur une œuvre PDF
2. Le système tente d'envoyer les pages à l'API d'IA sélectionnée
3. L'API retourne une erreur (quota dépassé, service indisponible, fichier non supporté)
4. Le système détecte l'échec de l'OCR
5. Le système le déplace dans un dossier 'echec_analyse'
6. Le système enregistre l'erreur dans les logs avec détails techniques
7. Le système notifie un bibliothécaire de l'échec
8. Le système met l'œuvre en statut "OCR échoué - intervention manuelle requise"
9. Le bibliothécaire peut relancer manuellement ou détruire le fichier s'il n'est pas conforme.
10. La notification de ce qui a été fait sur le document est envoyé à l'utilisateur.

## Résultat attendu
L'échec OCR est géré gracieusement.
