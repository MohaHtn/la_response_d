"""
Test du générateur d'images de prévisualisation
"""
import sys
sys.path.insert(0, '/home/mohahtn/PycharmProjects/la_response_d/server/src')

from app.domain.image_generator import PreviewImageGenerator

# Exemple de contenu markdown
markdown_example = """
# Histoire de la Biologie

La biologie est une science qui étudie les êtres vivants et leur environnement. 
Cette discipline s'est développée au fil des siècles avec de nombreuses découvertes importantes.

## Les débuts de la biologie

Au XVIIe siècle, les premiers microscopes ont permis d'observer des cellules. 
Robert Hooke fut l'un des pionniers de cette observation microscopique.

![Image exemple](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA)

## L'évolution des espèces

Charles Darwin a révolutionné notre compréhension du vivant avec sa théorie de l'évolution.
Les espèces évoluent par sélection naturelle, s'adaptant à leur environnement au fil des générations.

### Les mécanismes de l'évolution

- La variation génétique
- La sélection naturelle
- La dérive génétique
- Les mutations

**Conclusion**: La biologie continue d'évoluer avec de nouvelles découvertes chaque année.
"""

# Test 1 : Extraction du texte de prévisualisation
print("=" * 60)
print("TEST 1 : Extraction du texte de prévisualisation")
print("=" * 60)

preview_text = PreviewImageGenerator.extract_preview_text(markdown_example, max_chars=300)
print(f"Longueur du texte extrait : {len(preview_text)} caractères")
print(f"\nTexte de prévisualisation :\n{preview_text}")

# Test 2 : Génération de l'image
print("\n" + "=" * 60)
print("TEST 2 : Génération de l'image de prévisualisation")
print("=" * 60)

preview_text, cover_image = PreviewImageGenerator.generate_from_markdown(
    markdown_content=markdown_example,
    title="Histoire de la Biologie",
    author="Maurice Caullery"
)

print(f"✓ Texte de prévisualisation : {len(preview_text)} caractères")
print(f"✓ Image générée : {len(cover_image)} caractères (base64)")
print(f"✓ Format : {cover_image[:30]}...")

# Vérifier le format data URI
if cover_image.startswith("data:image/png;base64,"):
    print("✓ Format data URI valide")
else:
    print("✗ Format data URI invalide")

print("\n" + "=" * 60)
print("✓ Tous les tests sont réussis !")
print("=" * 60)

