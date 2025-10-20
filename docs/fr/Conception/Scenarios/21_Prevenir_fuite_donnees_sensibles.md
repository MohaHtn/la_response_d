← [Accueil des scénarios](_Scenarios.md)

# Scénario 21 : Prévenir les fuites de données sensibles (œuvre hors domaine public)

## Nom du Scénario
Prévenir les fuites de données sensibles (œuvre hors domaine public)

## Description
Lorsqu'un bibliothécaire soumet une œuvre, le système utilise une IA pour extraire les métadonnées et estimer si l'œuvre est dans le domaine public. Si l'IA signale un risque (œuvre protégée ou contenu sensible), la publication est bloquée et le dossier est remis à un modérateur humain qui prend la décision finale.

## Acteurs
- **Bibliothécaire** : personne qui soumet l'œuvre
- **IA d'analyse** : service qui extrait métadonnées, estime le statut légal et détecte contenu sensible
- **Modérateur** : décideur humain pour les dossiers à risque
- **Système backend** : orchestration des analyses, stockage temporaire, files d'attente et audit

## Préconditions
- Le bibliothécaire est connecté
- L'œuvre (PDF) a été téléversée via l'interface web
- Le service IA est disponible ou le système dispose d'une politique de repli

## Étapes
1. Le bibliothécaire téléverse le fichier et renseigne les métadonnées initiales si disponibles.
2. Le backend enregistre le fichier en zone temporaire et crée un ticket d'analyse.
3. Le backend soumet le document à l'IA pour : extraction de métadonnées, estimation du statut légal (score "domaine public"), détection de contenu sensible, et production d'éléments justificatifs.
4. L'IA renvoie un rapport structuré : métadonnées extraites, score de confiance, indicateurs de sensibilité et preuves (dates, mentions légales, etc.).
5. Le système compare le score aux seuils configurables :
   - Si score >= seuil de publication automatique et aucun indicateur sensible : marquer comme « prêt à publier ». Selon la politique, publier automatiquement ou proposer pour révision rapide.
   - Si score < seuil bas ou indicateur sensible présent : bloquer la publication et placer en file de modération.
6. Le modérateur reçoit la notification, consulte le PDF, les métadonnées et les preuves IA, et choisit : Valider / Rejeter / Demander complément.
7. Si validé : publier et enregistrer une entrée d'audit.
   Si rejeté : maintenir en non-publication et conserver les preuves dans la zone restreinte selon la politique de conservation.

## Résultat attendu
L'œuvre n'est pas publiée automatiquement si l'IA indique un risque ; le modérateur peut consulter les preuves et décider ; toutes les actions sont enregistrées pour audit.

## Remarques techniques
- Endpoints suggérés : POST /api/upload-book, GET /api/tickets/:id, POST /api/tickets/:id/decision
- Tickets : id, uploader_id, status, public_domain_score, sensitivity_flags, evidence
- Seuils configurables pour décision automatique (ex: auto_publish >= 0.9, require_moderation < 0.6)
- Politique de repli : si l'IA est indisponible, bloquer et exiger modération pour éviter fuites
- Conservation et sécurité : chiffrement au repos pour fichiers non publiés, accès restreint, journalisation immuable

## Cas de test rapides
- Document clairement domaine public -> publication automatique ou prêt à publication
- Document protégé -> bloqué, file modération
- IA incertaine -> file modération, modérateur valide -> publication
- IA détecte contenu sensible -> bloqué et signal interne



