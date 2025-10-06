# Scénario 8 : Exporter une œuvre au format Markdown

## Nom du Scénario
Exporter une œuvre au format Markdown

## Description
Un membre exporte une œuvre dont le texte a été reconnu par OCR vers un fichier Markdown structuré.

## Acteurs
- **Membre** : Utilisateur authentifié souhaitant exporter une œuvre
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre est connecté à son compte
- L'œuvre a subi un traitement OCR réussi
- Le membre a accès à l'œuvre (empruntée ou libre de droits)
- Le texte de l'œuvre est disponible en base de données

## Étapes
1. Le membre consulte une œuvre disponible
2. Le membre clique sur "Exporter en Markdown"
3. Le système vérifie les droits d'accès à l'œuvre
4. Le système récupère le texte structuré de l'OCR
5. Le système applique le formatage Markdown (titres, paragraphes, listes)
6. Le système préserve la structure originale (chapitres, sections)
7. Le système génère les métadonnées d'en-tête (titre, auteur, date d'export)
8. Le système ajoute une table des matières automatique si applicable
9. Le système propose le téléchargement du fichier .md
10. Le membre télécharge le fichier Markdown
11. Le système enregistre l'export dans l'historique du membre

## Résultat attendu
Le membre obtient un fichier Markdown structuré et lisible de l'œuvre avec préservation de la mise en page originale.
