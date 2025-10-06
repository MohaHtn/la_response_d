# Scénario 4 : Reconnaissance de texte d'une œuvre (OCR)

## Nom du Scénario
Reconnaissance de texte d'une œuvre (OCR)

## Description
Le système utilise l'intelligence artificielle pour extraire et reconnaître le texte contenu dans un fichier PDF, permettant la recherche et l'export en Markdown.

## Acteurs
- **Système** : Application de bibliothèque numérique
- **IA OCR** : Services Gemini (Google) ou Pixtral (Mistral)
- **Bibliothécaire** : Peut déclencher manuellement le processus

## Préconditions
- Une œuvre PDF est présente dans le système
- Les clés API pour les services d'IA sont configurées
- Le fichier PDF est lisible et non corrompu

## Étapes
1. Le système détecte un nouveau fichier PDF à traiter
2. Le système sélectionne le service d'IA disponible (Gemini ou Pixtral)
3. Le système découpe le PDF en pages individuelles
4. Pour chaque page, le système envoie l'image à l'API d'IA
5. L'IA analyse l'image et extrait le texte
6. L'IA identifie la mise en page (titres, paragraphes, tableaux, images)
7. Le système agrège les résultats de toutes les pages
8. Le système structure le texte en format Markdown
9. Le système sauvegarde le texte extrait dans la base de données
10. Le système met à jour le statut de l'œuvre (OCR effectué)
11. Le système génère un rapport de qualité de reconnaissance

## Résultat attendu
L'œuvre dispose d'une version texte searchable et exportable en Markdown avec préservation de la mise en page.
