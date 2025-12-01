"""
Service de génération d'images de prévisualisation pour les documents
"""
from PIL import Image, ImageDraw, ImageFont
import io
import base64
import textwrap
import re


class PreviewImageGenerator:
    """Générateur d'images de prévisualisation pour les documents"""

    # Dimensions de l'image
    WIDTH = 400
    HEIGHT = 560

    # Couleurs
    BG_COLOR = (232, 238, 251)  # #e8eefb
    TEXT_COLOR = (13, 71, 161)  # #0d47a1
    TITLE_COLOR = (13, 71, 161)  # #0d47a1

    # Marges
    PADDING = 30

    @staticmethod
    def clean_markdown_text(markdown_content: str) -> str:
        """
        Nettoie le contenu markdown pour extraire le texte pur

        Args:
            markdown_content: Contenu markdown brut

        Returns:
            Texte nettoyé sans balises markdown
        """
        # Supprimer les images base64
        text = re.sub(r'!\[.*?\]\(data:image/.*?\)', '', markdown_content)

        # Supprimer les autres images
        text = re.sub(r'!\[.*?\]\(.*?\)', '', text)

        # Supprimer les liens mais garder le texte
        text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)

        # Supprimer les en-têtes markdown (#)
        text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)

        # Supprimer le gras et l'italique
        text = re.sub(r'\*\*([^\*]+)\*\*', r'\1', text)
        text = re.sub(r'\*([^\*]+)\*', r'\1', text)
        text = re.sub(r'__([^_]+)__', r'\1', text)
        text = re.sub(r'_([^_]+)_', r'\1', text)

        # Supprimer les blocs de code
        text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
        text = re.sub(r'`([^`]+)`', r'\1', text)

        # Nettoyer les espaces multiples
        text = re.sub(r'\s+', ' ', text)

        return text.strip()

    @staticmethod
    def extract_preview_text(markdown_content: str, max_chars: int = 300) -> str:
        """
        Extrait les premiers caractères alphanumériques du markdown

        Args:
            markdown_content: Contenu markdown complet
            max_chars: Nombre maximum de caractères à extraire

        Returns:
            Texte de prévisualisation (max 300 caractères)
        """
        # Nettoyer le markdown
        clean_text = PreviewImageGenerator.clean_markdown_text(markdown_content)

        # Ne garder que les caractères alphanumériques et la ponctuation de base
        preview = re.sub(r'[^\w\s\.,;:!?\-\'\"àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ]', '', clean_text)

        # Limiter à max_chars caractères
        if len(preview) > max_chars:
            preview = preview[:max_chars]
            # Couper au dernier mot complet
            last_space = preview.rfind(' ')
            if last_space > max_chars * 0.8:  # Si on peut couper proprement
                preview = preview[:last_space]
            preview += "..."

        return preview.strip()

    @staticmethod
    def generate_preview_image(
        title: str,
        author: str,
        preview_text: str
    ) -> str:
        """
        Génère une image de prévisualisation et la retourne en base64

        Args:
            title: Titre du document
            author: Auteur du document
            preview_text: Texte de prévisualisation (300 caractères max)

        Returns:
            Image encodée en base64 (format data URI)
        """
        # Créer une nouvelle image
        img = Image.new('RGB', (PreviewImageGenerator.WIDTH, PreviewImageGenerator.HEIGHT),
                       PreviewImageGenerator.BG_COLOR)
        draw = ImageDraw.Draw(img)

        try:
            # Essayer de charger une police système
            try:
                title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 24)
                author_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
                text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
            except:
                # Fallback sur les polices alternatives
                try:
                    title_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", 24)
                    author_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", 16)
                    text_font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", 14)
                except:
                    # Si aucune police n'est disponible, utiliser la police par défaut
                    title_font = ImageFont.load_default()
                    author_font = ImageFont.load_default()
                    text_font = ImageFont.load_default()
        except:
            # Ultime fallback
            title_font = ImageFont.load_default()
            author_font = ImageFont.load_default()
            text_font = ImageFont.load_default()

        y_position = PreviewImageGenerator.PADDING

        # Dessiner le titre (avec retour à la ligne si nécessaire)
        title_lines = textwrap.wrap(title, width=25)
        for line in title_lines[:3]:  # Maximum 3 lignes pour le titre
            draw.text((PreviewImageGenerator.PADDING, y_position),
                     line,
                     fill=PreviewImageGenerator.TITLE_COLOR,
                     font=title_font)
            y_position += 32

        y_position += 10

        # Dessiner l'auteur
        author_text = f"par {author}"
        author_lines = textwrap.wrap(author_text, width=30)
        for line in author_lines[:2]:  # Maximum 2 lignes pour l'auteur
            draw.text((PreviewImageGenerator.PADDING, y_position),
                     line,
                     fill=PreviewImageGenerator.TEXT_COLOR,
                     font=author_font)
            y_position += 24

        y_position += 20

        # Dessiner une ligne de séparation
        draw.line(
            [(PreviewImageGenerator.PADDING, y_position),
             (PreviewImageGenerator.WIDTH - PreviewImageGenerator.PADDING, y_position)],
            fill=PreviewImageGenerator.TITLE_COLOR,
            width=2
        )

        y_position += 20

        # Dessiner le texte de prévisualisation
        preview_lines = textwrap.wrap(preview_text, width=45)
        max_lines = (PreviewImageGenerator.HEIGHT - y_position - PreviewImageGenerator.PADDING) // 20

        for line in preview_lines[:max_lines]:
            if y_position + 20 > PreviewImageGenerator.HEIGHT - PreviewImageGenerator.PADDING:
                break
            draw.text((PreviewImageGenerator.PADDING, y_position),
                     line,
                     fill=PreviewImageGenerator.TEXT_COLOR,
                     font=text_font)
            y_position += 20

        # Convertir l'image en base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)

        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        return f"data:image/png;base64,{img_base64}"

    @staticmethod
    def generate_from_markdown(
        markdown_content: str,
        title: str = "Sans titre",
        author: str = "Auteur inconnu"
    ) -> tuple[str, str]:
        """
        Génère une image de prévisualisation à partir du contenu markdown

        Args:
            markdown_content: Contenu markdown complet
            title: Titre du document
            author: Auteur du document

        Returns:
            Tuple (preview_text, cover_image_base64)
        """
        # Extraire le texte de prévisualisation
        preview_text = PreviewImageGenerator.extract_preview_text(markdown_content)

        # Générer l'image
        cover_image = PreviewImageGenerator.generate_preview_image(
            title=title,
            author=author,
            preview_text=preview_text
        )

        return preview_text, cover_image

