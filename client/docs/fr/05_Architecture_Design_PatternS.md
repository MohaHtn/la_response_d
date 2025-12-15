# Architecture et Design Patterns — Frontend

## Architecture
- React (composants fonctionnels) organisés par pages et modules.
- Services d’accès API dédiés (fetch/axios), découplés des composants.
- État local par composant + éventuellement contexte pour l’utilisateur.
- Gestion d’erreurs et loaders unifiée (toasts/skeletons).

## Choix justifiés
- Découplage UI/Services: facilite les tests et l’évolution de l’API.
- Variables d’environnement `VITE_*`: configuration par environnement (dev, prod).
- Modélisation UI (OeuvreUI/UserUI): évite de propager tel‑quel les DTO serveur.

## Patterns
- Container/Presentational: composants conteneurs (logique, data) vs présentations (rendu pur).
- Adapter: mapping des réponses API vers les modèles UI.
- Strategy: tri/filtrage : stratégie interchangeable selon besoin.
- Observer (réactivité): UI réagit aux changements d’état.
- Facade: service API unique exposant des opérations simples pour l’UI.

## Qualités visées
- Testabilité, lisibilité, extensibilité, séparation des responsabilités.
