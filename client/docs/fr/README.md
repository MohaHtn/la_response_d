# Documentation côté Client

Ce dossier regroupe la documentation destinée au client (frontend). Il réemploie les éléments existants du dépôt `docs/fr` et fournit des points d’entrée par thème.

- 1. Glossaire métier et technique → `1_Glossaire.md`
- 2. Cas d’utilisation et scénarios → `2_Use_Cases.md`
- 3. Diagrammes de séquence → `3_Diagrammes_Sequence/README.md`
- 4. Diagrammes de classes → `4_Diagrammes_Classes/README.md`
- 5. Choix d’architecture et design patterns → `5_Architecture_Design_Patterns.md`
- 6. Guide de nommage → `6_Guide_Nommage.md`
- 7. Arborescence Git du dépôt → `7_Arborescence_Depot.md`
- 8. Paramétrage des variables d’environnement (.env) → `8_Parametrage_Env.md`

Références utiles globales du dépôt:
- Conception générale: `../../..//docs/fr/Conception/Conception.md`
- Journal de conception: `../../..//docs/fr/Journal de conception.md`

---

## 1. Glossaire métier et technique

Ce glossaire synthétise les termes utilisés côté client. Pour le fonds documentaire complet, se référer au dossier `docs/fr`.

- Œuvre: document numérique (PDF, audio, vidéo, article) géré par l’application.
- Membre: utilisateur authentifié pouvant proposer, emprunter et consulter des œuvres.
- Bibliothécaire: rôle de modération (validation, enrichissement des métadonnées, rejet).
- Fond commun: œuvres libres de droit.
- Séquestre: zone restreinte pour œuvres sous droit en attente.
- À modérer: zone où les œuvres proposées attendent la modération.
- Emprunt: mise à disposition temporaire sous droit (2 semaines).

Voir également:
- `../../..//docs/fr/Projet Encadré.md` (sections Glossaire et Travail demandé)

## 2. Cas d’utilisation et scénarios

Les scénarios principaux sont détaillés ici: `../../..//docs/fr/Conception/Scenarios/_Scenarios.md`.

Exemples liés au client:
- Accès à l’application web (navigation, pages publiques)
- Devenir membre (UI d’inscription/connexion)
- Rechercher une œuvre (barre de recherche, résultats, filtres)
- Consulter une œuvre (lecture, métadonnées, actions disponibles)
- Proposer une œuvre (upload, suivi de statut)
- Modérer une œuvre (UI dédiée aux bibliothécaires)

## 3. Diagrammes de séquence

Se référer aux scénarios pour les séquences détaillées. Les diagrammes PlantUML sont stockés sous:
- `../../..//docs/fr/Conception/Diagrammes d'états transitions/`

Pour la partie client, focaliser sur:
- Flux d’authentification
- Recherche et affichage des résultats
- Proposition d’une œuvre (upload + feedback)
- Parcours de modération côté UI

## 4. Diagrammes de classes

Voir:
- `../../..//docs/fr/Conception/Diagrammes de classes/`
- `../../..//docs/fr/Conception/Diagrammes de classes/Scenarios/`

Classes front typiques à refléter dans la modélisation (niveau UI/état):
- Composants de pages: `Home`, `AdminPage`, `ModeratorPage`, `QuarantinePage`
- Stores/State (si utilisés): gestion des statuts d’œuvres, pagination, filtres
- Services d’API: modules d’appel HTTP, gestion des erreurs et loaders

## 5. Choix d’architecture et design patterns

Approche côté client:
- Architecture par pages et composants fonctionnels, découplés des services d’accès API.
- Gestion de configuration via variables `VITE_*`.
- Patterns utiles: Container/Presentational, Adapter (mapping API → modèles UI), Strategy (tri/filtrage), Observer (réactivité état/UI).

Réfs:
- `../../..//docs/fr/Journal de conception.md`

## 6. Guide de nommage

- Composants: `PascalCase` (ex: `ModeratorPage.jsx`).
- Hooks et fonctions: `camelCase`.
- Constantes: `SCREAMING_SNAKE_CASE`.
- Fichiers: cohérents avec composant principal (`QuarantinePage.jsx`).
- i18n/labels: clés stables, anglais/FR selon conventions, éviter le texte en dur répétitif.
- Respect du vocabulaire du glossaire (ex.: « Œuvre », « Membre », « Modération »).

## 7. Arborescence Git du dépôt (vue client)

Extrait:
- `client/src/main.jsx` (bootstrap de l’app)
- `client/src/Home.jsx`
- `client/src/pages/AdminPage.jsx`
- `client/src/pages/ModeratorPage.jsx`
- `client/src/pages/QuarantinePage.jsx`
- `client/package.json` (scripts, dépendances)

Voir les recommandations complètes dans: `../../..//docs/fr/Conception/Conception.md`.

## 8. Paramétrage des variables d’environnement (.env)

Variables côté client (Vite):
- `VITE_API_BASE_URL` — URL de base de l’API serveur (ex.: `http://localhost:8000`).

Créer un fichier `client/.env.example` contenant:
```
VITE_API_BASE_URL=http://localhost:8000
```
