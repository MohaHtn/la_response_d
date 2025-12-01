# Fonctionnalité Preview des Documents

## Vue d'ensemble

Chaque document possède maintenant un champ `preview` qui contient les 300 premiers caractères du contenu Markdown. Cette preview est utilisée pour afficher un aperçu du document dans la bibliothèque sans avoir à charger le contenu complet.

## Architecture

### Backend (Python/FastAPI)

#### 1. Modèle de données (`models.py`)
```python
class Document(BaseModel):
    metadata: DocumentMetadata
    uploader: DocumentUploader
    moderation: DocumentModeration
    markdown: DocumentMarkdown
    document_id: Optional[str] = None
    preview: Optional[str] = None  # Nouveau champ
```

#### 2. Génération automatique lors de l'upload (`routes.py`)
```python
# Générer une preview (300 premiers caractères du markdown)
preview_text = markdown_content[:300] + "..." if len(markdown_content) > 300 else markdown_content

# Ajouter au document
document = Document(
    # ... autres champs
    preview=preview_text
)
```

#### 3. Endpoints API
- `GET /api/documents` : Retourne tous les documents avec leur preview
- `GET /api/documents/{document_id}` : Retourne un document avec sa preview
- `GET /api/documents/uploader/{username}` : Retourne les documents d'un utilisateur avec preview
- `GET /api/documents/status/{status}` : Retourne les documents par statut avec preview

### Frontend (React)

#### 1. Affichage dans Home.jsx
```jsx
{book.preview && (
  <div style={styles.preview}>
    {book.preview}
  </div>
)}
```

#### 2. Style de la preview
```javascript
preview: {
  fontSize: '11px',
  color: '#666',
  lineHeight: '1.4',
  marginTop: '8px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 3,  // Limite à 3 lignes
  WebkitBoxOrient: 'vertical',
}
```

## Avantages

✅ **Performance** : Une seule requête pour afficher la bibliothèque avec les previews
✅ **Expérience utilisateur** : Les utilisateurs voient immédiatement le contenu des documents
✅ **Scalabilité** : Pas besoin de charger le contenu complet de chaque document
✅ **Responsive** : La preview s'adapte à la taille de l'écran (3 lignes max)

## Migration des documents existants

Pour ajouter la preview aux documents existants dans Redis :

```bash
cd /home/mohahtn/PycharmProjects/la_response_d/server/src/app/infra/repositories
python migrate_add_preview.py
```

Ce script :
1. Récupère tous les documents
2. Génère une preview pour ceux qui n'en ont pas
3. Met à jour Redis avec les nouvelles previews

## Exemple de données

### Document avec preview
```json
{
  "document_id": "doc_20251201123456_1",
  "metadata": {
    "title": "Introduction à Python",
    "author": "Jean Dupont"
  },
  "markdown": {
    "content": "# Introduction\n\nPython est un langage..."
  },
  "preview": "# Introduction\n\nPython est un langage de programmation interprété, multi-paradigme et multiplateformes. Il favorise la programmation impérative structurée, fonctionnelle et orientée objet. Il est doté d'un typage dynamique fort, d'une gestion automatique de la mémoire par ramasse-miettes et d'un système de gestion d'exceptions...",
  "uploader": {
    "username": "john_doe",
    "upload_date": "2025-12-01T12:34:56"
  }
}
```

## Notes importantes

- La preview est générée **automatiquement** lors de l'upload
- Elle contient **300 caractères maximum** + "..."
- Elle est stockée dans Redis avec le document
- Elle est incluse dans **toutes les réponses API** par défaut
- Le frontend affiche **3 lignes maximum** avec ellipsis

## Futures améliorations possibles

- 🎯 Preview intelligente (détection de paragraphes complets)
- 🖼️ Extraction d'images pour la preview
- 📊 Preview avec mise en forme Markdown
- 🔍 Highlight des termes de recherche dans la preview

