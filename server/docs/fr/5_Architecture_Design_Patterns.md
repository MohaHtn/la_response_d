# Choix d’architecture et Design Patterns — Serveur

Architecture recommandée:
- Couches: Domaine, Services applicatifs, Infrastructure, Interface (API).
- Tâches longues (OCR) potentiellement asynchrones.

Design patterns pertinents:
- Strategy — sélection du provider OCR (Gemini, Pixtral)
- Adapter — unifier les réponses des IA
- Repository — abstraire Redis/stockage
- Facade — coordonner plusieurs sous-systèmes via des services
- Factory/Singleton — gestion centralisée des clients externes

Réfs: `../../../docs/fr/Journal de conception.md`.
