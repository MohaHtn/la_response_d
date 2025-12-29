← [Accueil des scénarios](_Scenarios.md)

# Scénario 10 : Échec de l'OCR

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
5. Le système notifie l'utilisateur de l'échec avec un message d'erreur.

## Résultat attendu
L'échec OCR est géré gracieusement.