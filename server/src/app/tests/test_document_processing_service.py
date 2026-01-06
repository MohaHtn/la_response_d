import pytest
from app.domain.services.document_processing_service import DocumentProcessingService

def test_normalize_metadata():
    extracted = {"author": "Victor Hugo", "date": "1862"}
    author, date = DocumentProcessingService.normalize_metadata(extracted)
    assert author == "Victor Hugo"
    assert date == "1862"

    extracted_empty = {}
    author, date = DocumentProcessingService.normalize_metadata(extracted_empty)
    assert author == "Inconnu"
    assert date == ""

def test_determine_compliance_compliant():
    security = {"has_security_prompts": False}
    content = {"is_appropriate": True}
    is_compliant, issues = DocumentProcessingService.determine_compliance(security, content)
    assert is_compliant is True
    assert len(issues) == 0

def test_determine_compliance_non_compliant():
    security = {"has_security_prompts": True}
    content = {"is_appropriate": False}
    is_compliant, issues = DocumentProcessingService.determine_compliance(security, content)
    assert is_compliant is False
    assert "Injection de prompt détectée" in issues
    assert "Contenu inapproprié détecté" in issues

def test_create_document_model():
    doc = DocumentProcessingService.create_document_model(
        title="Les Misérables",
        author="Victor Hugo",
        parution_date="1862",
        username="admin",
        markdown_content="# Chapitre 1",
        content_analysis={"is_appropriate": True},
        is_compliant=True,
        compliance_issues=[],
        preview_text="Les Misérables...",
        cover_image="base64-image"
    )
    
    assert doc.metadata.title == "Les Misérables"
    assert doc.uploader.username == "admin"
    assert doc.markdown.content == "# Chapitre 1"
    assert doc.preview == "Les Misérables..."
