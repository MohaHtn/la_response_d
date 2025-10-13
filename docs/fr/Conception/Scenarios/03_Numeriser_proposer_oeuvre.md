# Scénario 3 : Numériser et proposer une œuvre (Application web avec IA)

## Nom du Scénario
Numériser et proposer une œuvre avec extraction automatique des métadonnées et vérification du domaine public

## Description
Un membre utilise l'application web pour numériser une œuvre physique au format PDF et la proposer pour partage dans la bibliothèque numérique. L'IA intégrée analyse le fichier PDF et propose automatiquement des métadonnées (titre, auteur, année, etc.) ainsi qu'une vérification du statut du domaine public basée sur l'année de publication et les informations de droits d'auteur. Après soumission, un modérateur vérifie les suggestions de l'IA, notamment concernant le statut du domaine public, avant de valider la publication dans la bibliothèque.

## Acteurs
- **Membre** : Utilisateur authentifié souhaitant partager une œuvre
- **Système** : Application web de bibliothèque numérique
- **IA** : Module d'intelligence artificielle pour l'extraction automatique des métadonnées
- **Modérateur** : Utilisateur habilité à valider et corriger les métadonnées

## Préconditions
- Le membre est connecté à son compte
- Le membre dispose d'un fichier PDF de l'œuvre numérisée
- L'œuvre respecte les contraintes de taille (définie par l'administration)

## Étapes
1. Le membre accède à la section "Proposer une œuvre" sur l'application web
2. Le membre sélectionne le fichier PDF à téléverser
3. Le système vérifie le format et la taille du fichier
4. L'IA analyse le fichier PDF et :
   - Extrait automatiquement les métadonnées (titre, auteur, année de publication, etc.)
   - Vérifie le statut du domaine public en analysant l'année de publication et les mentions de droits d'auteur
   - Signale si des restrictions de droits d'auteur sont détectées
5. Le système présente les résultats de l'analyse de l'IA au modérateur
6. Le système génère un identifiant unique pour l'œuvre
7. Le système stocke le fichier dans le répertoire "a_moderer"
8. Le système enregistre les métadonnées et l'analyse du statut juridique dans la base de données
9. Le système envoie une notification au membre confirmant la soumission
10. Le système notifie les modérateurs de la nouvelle œuvre à valider
11. Le modérateur accède à la fiche de l'œuvre en attente
12. Le modérateur :
    - Vérifie et valide les métadonnées suggérées par l'IA
    - Confirme le statut du domaine public détecté par l'IA
    - Peut consulter les détails de l'analyse de l'IA concernant les droits d'auteur
13. Si le modérateur confirme que l'œuvre est dans le domaine public :
    - Le système publie l'œuvre dans la bibliothèque
14. Si le modérateur détermine que l'œuvre n'est pas dans le domaine public :
    - Le système rejette la proposition
    - Le système notifie le membre du rejet pour cause de droits d'auteur
    - Le système déplace l'œuvre dans un répertoire d'archives

## Résultat attendu
- Si l'œuvre est dans le domaine public : elle est publiée dans la bibliothèque avec ses métadonnées validées
- Si l'œuvre n'est pas dans le domaine public : elle est rejetée et archivée, le membre est notifié
