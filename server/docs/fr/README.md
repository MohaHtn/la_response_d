# Documentation côté Serveur

Ce dossier regroupe la documentation destinée au serveur (backend). Il s’inspire et reprend des éléments du dossier global `docs/fr` afin d’offrir un point d’entrée dédié par thème.

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

Termes clefs côté serveur:
- Document/Œuvre: entité manipulée par les services (ingestion, OCR, modération, export MD).
- Statut d’une œuvre: `PENDING`, `QUARANTINE`, `APPROVED`, etc. (cf. constantes côté client et règles côté serveur).
- Métadonnées: titre, auteur, catégories, droits, etc.
- Service: composant applicatif (domain/service, infra) offrant une fonctionnalité (OCR, dépôt, export, indexation).

Voir également: `../../..//docs/fr/Projet Encadré.md`.

## 2. Cas d’utilisation et scénarios

Liste principale: `../../..//docs/fr/Conception/Scenarios/_Scenarios.md`.
Pertinence serveur:
- Numériser et proposer une œuvre (ingestion, stockage, file d’attente)
- Reconnaissance de texte d’une œuvre (OCR via IA externes)
- Modérer une œuvre (workflow de validation/rejet)
- Exporter une œuvre au format Markdown
- Diffusion automatique des œuvres libres de droits

## 3. Diagrammes de séquence

Se référer aux scénarios et aux diagrammes PlantUML sous:
- `../../..//docs/fr/Conception/Diagrammes d'états transitions/`

Séquences serveur typiques:
- Pipeline d’OCR (réception → envoi au provider → stockage résultat)
- Changement de statut (PENDING → QUARANTINE/APPROVED)
- Export Markdown (extraction contenu → rendu → persistance)

## 4. Diagrammes de classes

Réfs:
- `../../..//docs/fr/Conception/Diagrammes de classes/`
- `../../..//docs/fr/Conception/Diagrammes de classes/Scenarios/`

Domaines cibles:
- Entités: `Document`, `User`, `Metadata`, `Category`
- Services: `DocumentService`, `DocumentProcessingService`
- Repositories/Infra: accès Redis, stockage, intégrations IA

## 5. Choix d’architecture et design patterns

Architecture:
- Couches: Domain (métier), Application/Services, Infra (accès Redis, IA, Git si applicable), Interface (API web).
- Asynchronisme (si applicable) pour les tâches longues (OCR).

Patterns:
- Strategy (sélection du provider OCR: Gemini, Pixtral)
- Adapter (normalisation des réponses IA)
- Repository (abstraction de la persistance / Redis)
- Facade (service applicatif coordonnant plusieurs sous-systèmes)
- Singleton/Factory (gestion centralisée de clients externes)

Réfs: `../../..//docs/fr/Journal de conception.md`.

## 6. Guide de nommage

- Python: `snake_case` pour fonctions/variables, `PascalCase` pour classes.
- Modules: noms courts, significatifs (`ocr`, `repositories`, `infra`).
- Constantes: `SCREAMING_SNAKE_CASE`.
- Exceptions: suffixe `Error`.
- Logs: messages actionnables, contexte (doc_id, user_id, statut).
- Cohérence avec le glossaire (ex.: « œuvre », « modération ») dans les docs et noms de domaines.

## 7. Arborescence Git du dépôt (vue serveur)

Extrait:
- `server/src/app/main.py`
- `server/src/app/infra/database/redis_manager.py`
- `server/src/app/domain/services/document_service.py`
- `server/src/app/domain/services/document_processing_service.py`
- `server/src/app/infra/ocr/pixtral_service.py`

## 8. Paramétrage des variables d’environnement (.env)

Variables côté serveur:
- `PIXTRAL_API_KEY` — clé du provider Pixtral
- `GEMINI_API_KEY` — clé du provider Gemini
- `REDIS_URL` — ex.: `redis://localhost:6379/0`

Créer un fichier `server/.env.example` contenant:
```
PIXTRAL_API_KEY=
GEMINI_API_KEY=
REDIS_URL=redis://localhost:6379/0
```