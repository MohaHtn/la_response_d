"""
Service de traitement des documents
"""
from typing import Dict, Tuple, Optional
from datetime import datetime
from ...api.models import (
    Document, DocumentMetadata, DocumentUploader, 
    DocumentModeration, DocumentMarkdown, ApprovalProcess, BookStatus
)
class DocumentProcessingService:
    """Service pour le traitement et la validation des documents"""
    @staticmethod
    def normalize_metadata(extracted_metadata: Dict) -> Tuple[str, str]:
        """
        Normalise les métadonnées extraites du PDF
        Args:
            extracted_metadata: Métadonnées extraites par l'OCR
        Returns:
            Tuple (author, parution_date) normalisés
        """
        # Normaliser l'auteur
        metadata_author = extracted_metadata.get("author")
        if isinstance(metadata_author, list):
            metadata_author = ", ".join(metadata_author) if metadata_author else "Inconnu"
        elif not metadata_author:
            metadata_author = "Inconnu"
        # Normaliser la date de parution
        parution_date_raw = (
            extracted_metadata.get("date") or 
            extracted_metadata.get("parution_date")
        )
        parution_date = str(parution_date_raw) if parution_date_raw else ""
        return metadata_author, parution_date
    @staticmethod
    def determine_compliance(
        security_analysis: Dict, 
        content_analysis: Dict
    ) -> Tuple[bool, list]:
        """
        Détermine si un document est conforme
        Args:
            security_analysis: Analyse de sécurité
            content_analysis: Analyse du contenu
        Returns:
            Tuple (is_compliant, compliance_issues)
        """
        is_compliant = True
        compliance_issues = []
        # Vérifier les problèmes de sécurité
        if security_analysis.get("has_security_prompts", False):
            is_compliant = False
            compliance_issues.append("Injection de prompt détectée")
        # Vérifier le contenu approprié
        is_appropriate = content_analysis.get("is_appropriate", True)
        if not is_appropriate:
            is_compliant = False
            compliance_issues.append("Contenu inapproprié détecté")
        return is_compliant, compliance_issues
    @staticmethod
    def create_document_model(
        title: str,
        author: str,
        parution_date: str,
        username: str,
        markdown_content: str,
        content_analysis: Dict,
        is_compliant: bool,
        compliance_issues: list,
        preview_text: str,
        cover_image: str
    ) -> Document:
        """
        Crée un modèle Document Pydantic
        Args:
            title: Titre du document
            author: Auteur du document
            parution_date: Date de parution
            username: Nom d utilisateur de l uploader
            markdown_content: Contenu markdown
            content_analysis: Analyse du contenu
            is_compliant: Le document est-il conforme
            compliance_issues: Liste des problèmes de conformité
            preview_text: Texte de prévisualisation
            cover_image: Image de couverture (base64)
        Returns:
            Instance de Document
        """
        current_date = datetime.now().isoformat()
        return Document(
            metadata=DocumentMetadata(
                title=title,
                author=author,
                parution_date=parution_date,
                is_appropriate=str(content_analysis.get("is_appropriate", True)),
                is_harmful=not content_analysis.get("is_appropriate", True)
            ),
            uploader=DocumentUploader(
                username=username or "anonymous",
                upload_date=current_date
            ),
            moderation=DocumentModeration(
                approval_process=ApprovalProcess(
                    status=BookStatus.WAITING,
                    date=current_date,
                    details="; ".join(compliance_issues) if not is_compliant else ""
                ),
                approved_by=[]
            ),
            markdown=DocumentMarkdown(content=markdown_content),
            preview=preview_text,
            cover_image=cover_image
        )
    @staticmethod
    def enrich_document_data(
        document_data: Dict,
        security_analysis: Dict,
        content_analysis: Dict,
        compliance_issues: list
    ) -> Dict:
        """
        Enrichit les données du document avec les analyses
        Args:
            document_data: Données du document
            security_analysis: Analyse de sécurité
            content_analysis: Analyse du contenu
            compliance_issues: Problèmes de conformité
        Returns:
            Données enrichies
        """
        document_data["security_analysis"] = security_analysis
        document_data["content_analysis"] = content_analysis
        document_data["compliance_issues"] = compliance_issues
        return document_data
    @staticmethod
    def prepare_response_metadata(
        extracted_metadata: Dict,
        title: str,
        author: str,
        parution_date: str,
        username: Optional[str]
    ) -> Dict:
        """
        Prépare les métadonnées normalisées pour la réponse
        Args:
            extracted_metadata: Métadonnées extraites
            title: Titre du document
            author: Auteur du document
            parution_date: Date de parution
            username: Nom d utilisateur
        Returns:
            Métadonnées normalisées
        """
        return {
            "title": title,
            "author": author,
            "date": parution_date,
            "publisher": extracted_metadata.get("publisher", "Non spécifié"),
            "description": extracted_metadata.get(
                "description", 
                f"Document uploadé par {username or repr('anonymous`')}"
            )
        }
    @staticmethod
    def build_success_response(
        is_compliant: bool,
        document_id: str,
        title: str,
        author: str,
        username: Optional[str],
        current_date: str,
        compliance_issues: list,
        markdown_content: str,
        normalized_metadata: Dict,
        security_analysis: Dict,
        content_analysis: Dict,
        ocr_result: Dict
    ) -> Dict:
        """
        Construit la réponse de succès complète
        Args:
            is_compliant: Document conforme?
            document_id: ID du document
            title: Titre
            author: Auteur
            username: Utilisateur
            current_date: Date actuelle
            compliance_issues: Problèmes de conformité
            markdown_content: Contenu markdown
            normalized_metadata: Métadonnées normalisées
            security_analysis: Analyse de sécurité
            content_analysis: Analyse du contenu
            ocr_result: Résultat OCR complet
        Returns:
            Dictionnaire de réponse
        """
        return {
            "success": True,
            "message": (
                "Document traité avec succès." 
                if is_compliant 
                else "Document placé en quarantaine pour révision administrative."
            ),
            "document_id": document_id,
            "quarantine_status": "approved" if is_compliant else "quarantined",
            "is_compliant": is_compliant,
            "compliance_issues": compliance_issues,
            "document": {
                "title": title,
                "author": author,
                "uploader": username or "anonymous",
                "upload_date": current_date,
                "status": BookStatus.WAITING.value,
                "in_quarantine": not is_compliant
            },
            "preview": markdown_content[:200],
            "metadata": normalized_metadata,
            "security_analysis": security_analysis,
            "content_analysis": content_analysis,
            "markdown": markdown_content,
            "ocr": ocr_result.get("ocr", {}),
            "processing_info": ocr_result.get("processing_info", {})
        }
