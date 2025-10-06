# Scénario 16 : Échec de l'OCR

## Nom du Scénario
Échec de l'OCR

## Description
Le processus de reconnaissance de texte échoue lors du traitement d'une œuvre PDF, empêchant l'extraction du contenu textuel.

## Acteurs
- **Système** : Application de bibliothèque numérique
- **IA OCR** : Services Gemini ou Pixtral (en échec)
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
5. Le système tente automatiquement avec l'autre service d'IA disponible
6. Si le second service échoue aussi, le système marque l'OCR comme "échec"
7. Le système enregistre l'erreur dans les logs avec détails techniques
8. Le système notifie un bibliothécaire de l'échec
9. Le système met l'œuvre en statut "OCR échoué - intervention manuelle requise"
10. Le bibliothécaire peut relancer manuellement ou marquer comme "texte non extractible"
11. L'œuvre reste accessible en PDF uniquement sans fonctionnalité de recherche textuelle

## Résultat attendu
L'échec OCR est géré gracieusement, l'œuvre reste disponible mais sans contenu textuel searchable.
