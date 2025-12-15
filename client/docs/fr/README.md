# Documentation côté Client

Ce dossier regroupe TOUTE la documentation destinée au client (frontend) et est autonome. Aucun renvoi au dossier `docs` à la racine n’est nécessaire: tout le contenu requis est présent ici.

- 1. Glossaire métier et technique → `01_Glossaire.md`
- 2. Cas d’utilisation et scénarios → `02_Use_Cases/README.md`
- 3. Diagrammes de séquence → `03_Diagrammes_Sequence/README.md`
- 4. Diagrammes de classes et d’états → `04_Diagrammes_Classes/README.md`
- 5. Justification des choix d’architecture et design patterns → `05_Architecture_Design_Patterns.md`
- 6. Guide de nommage → `06_Guide_Nommage.md`
- 7. Arborescence Git du dépôt (vue client) → `07_Arborescence_Depot.md`
- 8. Paramétrage des variables d’environnement (.env) → `08_Parametrage_Env.md`
- 9. Scripts d’implémentation sommaire → `08_Scripts/README.md`

---

## 1. Glossaire métier et technique

Voir `01_Glossaire.md` pour les définitions front détaillées (œuvre, membre, bibliothécaire, fond commun, séquestre, à modérer, emprunt, etc.).

## 2. Cas d’utilisation et scénarios

Voir `02_Use_Cases/README.md` avec le diagramme global des use cases et les scénarios détaillés (pré/post-conditions, flux principal, alternatives, erreurs).

## 3. Diagrammes de séquence

Voir `03_Diagrammes_Sequence/README.md` pour les séquences Authentification, Recherche, Upload/Feedback, Modération.

## 4. Diagrammes de classes et d’états

Voir `04_Diagrammes_Classes/README.md` pour les classes globales, classes par scénario et les diagrammes d’états des composants/objets critiques.

## 5. Choix d’architecture et design patterns

Voir `05_Architecture_Design_Patterns.md` (pages/composants, services API, gestion d’état, patterns: Container/Presentational, Adapter, Strategy, Observer, Facade pour l’API, etc.).

## 6. Guide de nommage

Voir `06_Guide_Nommage.md` (PascalCase composants, camelCase hooks/fonctions, SCREAMING_SNAKE_CASE constantes, conventions fichiers, i18n, CSS Modules/Tailwind si applicable).

## 7. Arborescence Git du dépôt (vue client)

Voir `07_Arborescence_Depot.md` pour la structure conforme aux recommandations du cours.

## 8. Paramétrage des variables d’environnement (.env)

Voir `08_Parametrage_Env.md` et `../.env.example`.
