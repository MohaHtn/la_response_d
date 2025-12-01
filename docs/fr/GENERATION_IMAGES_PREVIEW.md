# Génération d'images de prévisualisation

## Vue d'ensemble

Ce document explique comment les images de prévisualisation sont générées automatiquement lors de l'upload d'un document.

## Fonctionnement

### 1. Backend (Python)

#### Service `PreviewImageGenerator`

Localisation : `/server/src/app/domain/image_generator.py`

Le service `PreviewImageGenerator` génère automatiquement :
1. **Un texte de prévisualisation** : Les 300 premiers caractères alphanumériques du markdown (sans balises)
2. **Une image de couverture** : Une image PNG de 400x560 pixels contenant :
   - Le titre du document
   - L'auteur
   - Le texte de prévisualisation

#### Méthodes principales

```python
# Extraire le texte de prévisualisation (300 caractères max)
preview_text = PreviewImageGenerator.extract_preview_text(markdown_content, max_chars=300)

# Générer l'image de prévisualisation
cover_image = PreviewImageGenerator.generate_preview_image(title, author, preview_text)

# Générer les deux en une seule fois
preview_text, cover_image = PreviewImageGenerator.generate_from_markdown(
    markdown_content=markdown_content,
    title="Titre du document",
    author="Auteur"
)
```

#### Nettoyage du markdown

Le service nettoie automatiquement le markdown pour extraire uniquement le texte pur :
- Supprime les images (base64 et autres)
- Supprime les liens markdown (garde le texte)
- Supprime les en-têtes (#, ##, ###)
- Supprime le formatage (gras, italique)
- Supprime les blocs de code
- Ne garde que les caractères alphanumériques et la ponctuation de base

### 2. Modèle de données

Le champ `cover_image` a été ajouté au modèle `Document` :

```python
class Document(BaseModel):
    metadata: DocumentMetadata
    uploader: DocumentUploader
    moderation: DocumentModeration
    markdown: DocumentMarkdown
    
    document_id: Optional[str] = None
    preview: Optional[str] = None
    cover_image: Optional[str] = None  # Image en base64 (data URI)
```

### 3. Route API `/api/send-book`

Lors de l'upload d'un document, la route :
1. Traite le PDF avec OCR
2. Extrait le markdown
3. **Génère automatiquement** le texte de prévisualisation et l'image de couverture
4. Stocke le tout dans Redis

```python
# Générer l'image de prévisualisation et le texte
preview_text, cover_image = PreviewImageGenerator.generate_from_markdown(
    markdown_content=markdown_content,
    title=doc_title,
    author=doc_author
)

# Créer le document avec l'image
document = Document(
    # ...
    preview=preview_text,
    cover_image=cover_image  # Stocké en base64
)
```

### 4. Frontend (React)

#### Récupération des données

Dans `Home.jsx`, lors de la récupération des documents :

```javascript
const books = data.documents.map(doc => ({
  id: doc.document_id,
  title: doc.metadata?.title || 'Sans titre',
  author: doc.metadata?.author || 'Auteur inconnu',
  status: doc.moderation?.status || 'unknown',
  preview: doc.preview || '',
  coverImage: doc.cover_image || null  // Image en base64
}));
```

#### Affichage des images

Dans `Home.jsx`, les images sont affichées avec une condition :

```jsx
{book.coverImage ? (
  <img 
    src={book.coverImage} 
    alt={`Couverture de ${book.title}`}
    style={styles.libraryCover}
  />
) : (
  <div style={styles.libraryCover} role="img" aria-label={`Couverture de ${book.title}`} />
)}
```

Si une image est disponible (`coverImage`), elle est affichée. Sinon, un placeholder coloré est affiché.

## Format de l'image

- **Format** : PNG
- **Dimensions** : 400 x 560 pixels
- **Encodage** : Base64 (data URI)
- **Couleurs** :
  - Fond : #e8eefb (bleu clair)
  - Texte : #0d47a1 (bleu foncé)
- **Police** : DejaVu Sans (avec fallback sur Liberation Sans et police par défaut)

## Stockage

L'image est stockée directement dans Redis en tant que chaîne base64 dans le document JSON :

```json
{
  "document_id": "abc123",
  "metadata": { ... },
  "preview": "Histoire de la Biologie La biologie est une science...",
  "cover_image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

## Avantages

1. **Automatique** : Génération automatique lors de l'upload
2. **Pas de stockage externe** : L'image est encodée en base64
3. **Rapide** : Génération en moins d'une seconde
4. **Personnalisée** : Chaque image est unique avec le titre, l'auteur et un extrait
5. **Responsive** : Affichage adaptatif avec fallback sur placeholder

## Test

Pour tester la génération d'images :

```bash
cd server/src
python test_image_generator.py
```

## Dépendances

- **Backend** : Pillow (PIL) pour la génération d'images
- **Frontend** : Aucune dépendance supplémentaire (images base64 natives)

## Exemple de résultat

Une image générée contient :
- **En haut** : Le titre du document (2-3 lignes max)
- **Sous le titre** : "par Auteur" (1-2 lignes max)
- **Ligne de séparation**
- **Corps** : Texte de prévisualisation (300 caractères max, environ 15-20 lignes)

Toutes les images ont le même style cohérent avec les couleurs de l'application.

