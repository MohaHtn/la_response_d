# Glossaire métier et technique — Frontend

Ce glossaire couvre les termes et objets manipulés côté client (application web).

## Métiers
- Œuvre: Ressource documentaire (PDF, audio, vidéo, article) consultable dans l’UI.
- Membre: Utilisateur authentifié ayant accès à des fonctions avancées.
- Bibliothécaire (Modérateur): Rôle habilité à valider/rejeter des œuvres proposées.
- Fond commun: Œuvres libres disponibles à tous.
- Séquestre: Espace restreint pour les œuvres sous droits en attente ou en litige.
- À modérer: File d’œuvres proposées en attente de décision.
- Emprunt: Mise à disposition temporaire (ex.: 14 jours) d’une œuvre sous droits.

## Techniques (Frontend)
- Composant: Unité UI (React) encapsulant un rendu et une logique locale.
- Page: Composant de haut niveau lié à une route (ex.: `Home`, `ModeratorPage`).
- Service API: Module JS centralisant les appels HTTP à l’API serveur.
- State/Store: État applicatif (filtres, pagination, statut d’opération).
- Loader/Skeleton: Indicateur visuel lors du chargement de données.
- Toast/Notification: Message éphémère (succès/erreur/avertissement).
- Environment Variables: Variables injectées au build via `VITE_*`.

## Objets principaux côté UI
- Work (OeuvreUI): { id, titre, auteurs, statut, vignettes, droits }
- User (UtilisateurUI): { id, rôle, nomAffiché }
- Filter (FiltreRecherche): { texte, facettes[], tri }
- UploadRequest (PropositionOeuvre): { fichier, métadonnées, progression, statut }

## Statuts d’une œuvre (vue client)
- "proposée" → visible en attente côté modérateur
- "validée" → apparaît dans le fond commun
- "rejetée" → notifiée au proposeur avec motif
- "séquestre" → non exposée publiquement, accès restreint
