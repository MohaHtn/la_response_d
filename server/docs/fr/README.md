# Documentation côté Serveur

Ce dossier regroupe TOUTE la documentation destinée au serveur (backend) et est autonome. Aucun renvoi au dossier `docs` à la racine n’est nécessaire: tout le contenu requis est présent ici.

- 1. Glossaire métier et technique → `01_Glossaire.md`
- 2. Cas d’utilisation et scénarios → `02_Use_Cases/README.md`
- 3. Diagrammes de séquence → `03_Diagrammes_Sequence/README.md`
- 4. Diagrammes de classes et d’états → `04_Diagrammes_Classes/README.md`
- 5. Justification des choix d’architecture et design patterns → `05_Architecture_Design_Patterns.md`
- 6. Guide de nommage → `06_Guide_Nommage.md`
- 7. Arborescence Git du dépôt (vue serveur) → `07_Arborescence_Depot.md`
- 8. Paramétrage des variables d’environnement (.env) → `08_Parametrage_Env.md`

---

## 1. Glossaire métier et technique

Voir `01_Glossaire.md` pour les définitions backend détaillées (Document, Métadonnées, Statuts, Services, Provider IA, Job asynchrone, etc.).

## 2. Cas d’utilisation et scénarios

Voir `02_Use_Cases/README.md` avec le diagramme global des use cases et les scénarios détaillés (pré/post-conditions, flux principal, alternatives, erreurs) orientés API/services.

## 3. Diagrammes de séquence

Voir `03_Diagrammes_Sequence/README.md` pour les séquences: Auth API, Pipeline OCR, Changement de statut, Export Markdown.

## 4. Diagrammes de classes et d’états

Voir `04_Diagrammes_Classes/README.md` pour les classes globales backend, classes par scénario et les diagrammes d’états des objets clés (Document, Job, ProviderClient).

## 5. Choix d’architecture et design patterns

Voir `05_Architecture_Design_Patterns.md` (couches Domain/Application/Infra/API, asynchronisme, Repository, Strategy Provider, Adapter IA, Facade Service, Factory clients externes).

## 6. Guide de nommage

Voir `06_Guide_Nommage.md`.

## 7. Arborescence Git du dépôt (vue serveur)

Voir `07_Arborescence_Depot.md`.

## 8. Paramétrage des variables d’environnement (.env)

Voir `08_Parametrage_Env.md` et `../../.env.example`.