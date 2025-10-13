← [Accueil des scénarios](_Scenarios.md)

# Scénario 3 : Numériser et proposer une œuvre

## Nom du Scénario
Numériser et proposer une œuvre

## Description
Un membre numérise une œuvre physique au format PDF et la propose pour partage dans la bibliothèque numérique.

## Acteurs
- **Membre** : Utilisateur authentifié souhaitant partager une œuvre
- **Système** : Application de bibliothèque numérique

## Préconditions
- Le membre est connecté à son compte
- Le membre dispose d'un fichier PDF de l'œuvre numérisée
- L'œuvre respecte les contraintes de taille (définie par l'administration)

## Étapes
1. Le membre accède à la section "Proposer une œuvre"
2. Le membre sélectionne le fichier PDF à téléverser
3. Le système vérifie le format et la taille du fichier
4. Le membre saisit les métadonnées de base (titre, auteur, année de publication)
5. Le membre sélectionne la/les catégorie(s) de l'œuvre (Livre, Musique, Vidéo, Article)
6. Le membre indique le statut des droits d'auteur (domaine public, sous droits, inconnu)
7. Le système génère un identifiant unique pour l'œuvre
8. Le système stocke le fichier dans le répertoire "a_moderer"
9. Le système enregistre les métadonnées dans la base de données
10. Le système envoie une notification au membre confirmant la soumission
11. Le système notifie les bibliothécaires de la nouvelle œuvre à modérer

## Résultat attendu
L'œuvre est stockée dans le répertoire de modération et en attente de validation par un bibliothécaire.
