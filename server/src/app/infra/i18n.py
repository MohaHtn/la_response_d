"""
Lightweight i18n helper for FastAPI server.

Usage:
    from .i18n import get_lang, translate
    lang = get_lang(request)
    message = translate(lang, "health.ok", default="OK")
"""
from __future__ import annotations

from typing import Dict


TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "en": {
        "api.title": "Bibliotheko API",
        "api.description": "API for managing a digital library",
        "health.ok": "ok",
        "cors.ok": "CORS works correctly",
        "cors.preflight": "CORS preflight OK",
        "root.welcome": "Welcome to the Bibliotheko API",
        "errors.internal": "Internal server error",
        # SSE (server-sent events) – statuses and stages
        "sse.status.queued": "queued",
        "sse.status.processing": "processing",
        "sse.status.done": "done",
        "sse.status.error": "error",
        "sse.stage.init": "initialization",
        "sse.stage.ocr:start": "OCR started",
        "sse.stage.ocr:done": "OCR finished",
        "sse.stage.extraction:start": "Metadata extraction started",
        "sse.stage.extraction:done": "Metadata extraction finished",
        "sse.stage.security:start": "Security analysis started",
        "sse.stage.security:done": "Security analysis finished",
        "sse.stage.appropriateness:start": "Appropriateness check started",
        "sse.stage.appropriateness:done": "Appropriateness check finished",
        "sse.stage.deliver:markdown": "Delivering preview",
        "sse.stage.preview": "Preview generation",
        "sse.stage.compliance": "Compliance checks",
        "sse.stage.persist": "Persisting document",
        "sse.stage.deliver:final": "Delivering final result",
        "sse.stage.complete": "Completed",
        "sse.stage.failed": "Failed",
        # Auth
        "auth.username_exists": "Username already exists",
        "auth.registered": "User registered successfully",
        "auth.invalid_credentials": "Invalid username or password",
        "auth.verify_error": "Error while verifying credentials",
        "auth.login_success": "Login successful",
        "auth.logout_success": "Logout successful",
        # Admin
        "admin.user_not_found": "User not found",
        "admin.nothing_to_update": "Nothing to update",
        "admin.update_failed": "Failed to update user",
        "admin.user_updated": "User updated",
        "admin.user_deleted": "User deleted",
        # Documents
        "documents.unsupported_type": "Unsupported file type. Please send a PDF.",
        "documents.file_too_large": "File too large. Max size: {size} MB",
        "documents.processing_started": "Processing started",
        "documents.found_in_quarantine": "Document found in quarantine",
        "documents.not_found": "Document not found",
        "documents.none_found": "No documents found",
        # Moderation
        "moderation.quarantine_not_found": "Quarantined document not found",
        "moderation.approval_error": "Error while approving document",
        "moderation.approved_moved": "Document approved and moved to the library",
        "moderation.not_found_or_delete_failed": "Document not found or deletion failed",
        "moderation.rejected_deleted": "Document rejected and deleted",
        "moderation.doc_not_found": "Document not found",
        "moderation.error_approval": "Error during approval",
        "moderation.approved": "Document approved",
        "moderation.error_rejection": "Error during rejection",
        "moderation.rejected": "Document rejected",
        "moderation.invalid_action": "Invalid action. Use 'approve' or 'reject'.",
        "moderation.failed_move": "Failed to move document to approved documents.",
        "moderation.failed_delete": "Failed to delete quarantined document.",
        "moderation.moderation_failed": "Failed to moderate document: {error}",
        "moderation.validation_saved": "Validation saved",
        "moderation.no_valid_fields": "No valid fields to update",
        "moderation.q_update_failed": "Failed to update quarantined document",
        "moderation.q_updated": "Quarantined document updated",
        "moderation.publishing_not_allowed": "Publishing not allowed: fewer than 3 validations",
        "moderation.publish_failed": "Failed to publish document",
        "moderation.published": "Document published",
    },
    "fr": {
        "api.title": "Bibliothéko API",
        "api.description": "API pour la gestion d'une bibliothèque numérique",
        "health.ok": "ok",
        "cors.ok": "CORS fonctionne correctement",
        "cors.preflight": "CORS preflight OK",
        "root.welcome": "Bienvenue sur l'API Bibliothéko",
        "errors.internal": "Erreur interne du serveur",
        # SSE (server-sent events) – statuts et étapes
        "sse.status.queued": "en file d'attente",
        "sse.status.processing": "en cours",
        "sse.status.done": "terminé",
        "sse.status.error": "erreur",
        "sse.stage.init": "initialisation",
        "sse.stage.ocr:start": "Démarrage de l'OCR",
        "sse.stage.ocr:done": "OCR terminé",
        "sse.stage.extraction:start": "Début de l'extraction des métadonnées",
        "sse.stage.extraction:done": "Extraction des métadonnées terminée",
        "sse.stage.security:start": "Début de l'analyse de sécurité",
        "sse.stage.security:done": "Analyse de sécurité terminée",
        "sse.stage.appropriateness:start": "Début du contrôle d'adéquation",
        "sse.stage.appropriateness:done": "Contrôle d'adéquation terminé",
        "sse.stage.deliver:markdown": "Livraison de l'aperçu",
        "sse.stage.preview": "Génération de l'aperçu",
        "sse.stage.compliance": "Vérifications de conformité",
        "sse.stage.persist": "Enregistrement du document",
        "sse.stage.deliver:final": "Livraison du résultat final",
        "sse.stage.complete": "Terminé",
        "sse.stage.failed": "Échec",
        # Auth
        "auth.username_exists": "Le nom d'utilisateur existe déjà",
        "auth.registered": "Utilisateur enregistré avec succès",
        "auth.invalid_credentials": "Nom d'utilisateur ou mot de passe incorrect",
        "auth.verify_error": "Erreur lors de la vérification des identifiants",
        "auth.login_success": "Connexion réussie",
        "auth.logout_success": "Déconnexion réussie",
        # Admin
        "admin.user_not_found": "Utilisateur introuvable",
        "admin.nothing_to_update": "Aucune mise à jour à effectuer",
        "admin.update_failed": "Échec de la mise à jour de l'utilisateur",
        "admin.user_updated": "Utilisateur mis à jour",
        "admin.user_deleted": "Utilisateur supprimé",
        # Documents
        "documents.unsupported_type": "Type de fichier non supporté. Veuillez envoyer un PDF.",
        "documents.file_too_large": "Fichier trop volumineux. Taille maximale : {size} Mo",
        "documents.processing_started": "Traitement lancé",
        "documents.found_in_quarantine": "Document trouvé en quarantaine",
        "documents.not_found": "Document introuvable",
        "documents.none_found": "Aucun document trouvé",
        # Moderation
        "moderation.quarantine_not_found": "Document en quarantaine introuvable",
        "moderation.approval_error": "Erreur lors de l'approbation du document",
        "moderation.approved_moved": "Document approuvé et déplacé vers la bibliothèque",
        "moderation.not_found_or_delete_failed": "Document introuvable ou suppression impossible",
        "moderation.rejected_deleted": "Document rejeté et supprimé",
        "moderation.doc_not_found": "Document introuvable",
        "moderation.error_approval": "Erreur lors de l'approbation",
        "moderation.approved": "Document approuvé",
        "moderation.error_rejection": "Erreur lors du rejet",
        "moderation.rejected": "Document rejeté",
        "moderation.invalid_action": "Action invalide. Utilisez 'approve' ou 'reject'.",
        "moderation.failed_move": "Échec du déplacement du document vers les documents approuvés.",
        "moderation.failed_delete": "Échec de la suppression du document en quarantaine.",
        "moderation.moderation_failed": "Échec de la modération du document : {error}",
        "moderation.validation_saved": "Validation enregistrée",
        "moderation.no_valid_fields": "Aucun champ valide à mettre à jour",
        "moderation.q_update_failed": "Échec de la mise à jour du document en quarantaine",
        "moderation.q_updated": "Document en quarantaine mis à jour",
        "moderation.publishing_not_allowed": "Publication impossible: moins de 3 validations",
        "moderation.publish_failed": "Échec de la publication du document",
        "moderation.published": "Document publié",
    },
}


def get_lang(request) -> str:
    """Resolve preferred language from request Accept-Language header.

    Returns 'en' as default.
    """
    # First, allow explicit query parameter override
    try:
        qp_lang = request.query_params.get("lang")  # type: ignore[attr-defined]
        if qp_lang:
            base = str(qp_lang).lower().split("-")[0]
            if base in TRANSLATIONS:
                return base
    except Exception:
        # If request doesn't have query_params like in tests, ignore
        pass

    header = request.headers.get("accept-language", "").lower()
    for token in header.split(","):
        code = token.strip().split(";")[0]
        if not code:
            continue
        # map language-only codes like 'fr' or 'en-US' → base 'fr'/'en' if available
        base = code.split("-")[0]
        if base in TRANSLATIONS:
            return base
    return "en"


def translate(lang: str, key: str, default: str | None = None) -> str:
    """Translate a key for a given language, fallback to default then key.
    """
    return TRANSLATIONS.get(lang, {}).get(key, default or key)
