import json
import os
from typing import Tuple, Dict, Any, LiteralString
from mistralai import Mistral

MODEL = "pixtral-large-latest"
OCR_MODEL = "mistral-ocr-latest"


def _load_api_key() -> str:
    """Loads the Pixtral/Mistral API key from apikey.json located in src/ directory.

    Searches relative to this file's directory to be robust to working directory.
    """
    here = os.path.dirname(__file__)
    path = os.path.join(here, "apikey.json")
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)["apikeys"]["pixtral"]


def get_client() -> Mistral:
    """Create and return a Mistral client using the configured API key."""
    api_key = _load_api_key()
    return Mistral(api_key=api_key)


def process_pdf(
        file_name: str,
        content: bytes,
        include_image_base64: bool = True,
        return_markdown: bool = False,
        embed_data_uris: bool = True,
        image_output_dir: str = "ocr_images",
) -> LiteralString | Any:
    """
    Traite un PDF via l'OCR Mistral.

    Args:
        file_name: Nom original du PDF.
        content: Octets du fichier PDF.
        include_image_base64: Inclure (ou non) les aperçus pages en base64.
        return_markdown: Si True, concatène le markdown des pages et l'ajoute au retour.
        embed_data_uris: Si True, insère directement les images en data URI dans le markdown.
                         Sinon, sauvegarde les images sur disque et référence leur chemin.
        image_output_dir: Dossier de sortie pour les images si embed_data_uris == False.

    Returns:
        Dict contenant la réponse OCR (clé 'ocr'). Si return_markdown=True, ajoute la clé 'markdown'.
    """
    client = get_client()

    uploaded_pdf = client.files.upload(
        file={
            "file_name": file_name or "uploaded_file.pdf",
            "content": content,
        },
        purpose="ocr",
    )

    signed_url = client.files.get_signed_url(file_id=uploaded_pdf.id)

    ocr_response = client.ocr.process(
        model=OCR_MODEL,
        document={
            "type": "document_url",
            "document_url": signed_url.url,
        },
        include_image_base64=include_image_base64,
    )

    ocr_dict = ocr_response.model_dump()

    if not return_markdown:
        return ocr_dict

    pages = ocr_dict.get("pages", [])
    markdown_parts = []
    if not embed_data_uris and not os.path.isdir(image_output_dir):
        os.makedirs(image_output_dir, exist_ok=True)

    for page in pages:
        # Corps markdown de la page (déjà segmenté)
        page_md = page.get("markdown", "")
        images = page.get("images", []) or []

        # Ajouter les références images sous le texte de la page
        image_md_lines = []
        for img in images:
            img_id = img.get("id") or "image"
            data_uri = img.get("image_base64")

            if embed_data_uris and data_uri:
                image_md_lines.append(f"![{img_id}]({data_uri})")
            else:
                if data_uri and data_uri.startswith("data:image/"):
                    header, b64data = data_uri.split(",", 1)
                    ext = header.split("/")[1].split(";")[0]
                else:
                    # Valeur par défaut
                    b64data = ""
                    ext = "png"
                out_name = f"{img_id}"
                if "." not in out_name:
                    out_name = f"{out_name}.{ext}"
                out_path = os.path.join(image_output_dir, out_name)
                if b64data:
                    import base64
                    try:
                        with open(out_path, "wb") as out_f:
                            out_f.write(base64.b64decode(b64data))
                    except Exception:
                        pass
                rel_path = f"{image_output_dir}/{out_name}"
                image_md_lines.append(f"![{img_id}]({rel_path})")

        block = page_md
        if image_md_lines:
            block = block.rstrip() + "\n\n" + "\n".join(image_md_lines)
        markdown_parts.append(block.strip())

    final_markdown = "\n\n---\n\n".join(markdown_parts) + "\n"

    print(final_markdown)

    return final_markdown



__all__ = ["process_pdf", "get_client", "MODEL", "OCR_MODEL"]