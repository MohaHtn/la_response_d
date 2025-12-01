# Visualisation Grille et Liste - Documentation

## Vue d'ensemble

Cette fonctionnalité permet aux utilisateurs de basculer entre deux modes d'affichage pour consulter les documents de la bibliothèque :
- **Vue Grille** : Affichage en cartes avec les couvertures
- **Vue Liste** : Affichage ligne par ligne, plus compact et plus lisible

## Fonctionnalités

### 1. Boutons de bascule

Les utilisateurs peuvent basculer entre les deux modes via des boutons situés **en haut à droite de la page**, à côté du titre "Bibliothèque — Accueil" :
- `⊞ Grille` : Affichage en grille (cartes)
- `☰ Liste` : Affichage en liste (lignes)

Le bouton actif est mis en surbrillance avec un fond bleu (#2196f3).

**Avantage** : Les boutons sont visibles une seule fois, évitant la répétition et améliorant l'expérience utilisateur.

### 2. Vue Grille (Mode par défaut)

**Caractéristiques :**
- Cartes de 280px de large
- Grille responsive avec gap de 18px
- Image de couverture (400x560px générée ou placeholder)
- Titre et auteur
- Texte de prévisualisation (300 caractères, 3 lignes max)
- Boutons d'action (Lire, Modérer)

**Style visuel :**
```
┌─────────────────┐
│   [Couverture]  │
│                 │
│  Titre          │
│  Auteur         │
│  Preview...     │
│                 │
│ [Lire] [Modérer]│
└─────────────────┘
```

### 3. Vue Liste (Nouveau)

**Caractéristiques :**
- Affichage ligne par ligne
- Miniature de couverture (80x112px) à gauche
- Informations sur une seule ligne horizontale
- Plus d'espace pour le texte de prévisualisation (2 lignes)
- Boutons d'action alignés à droite
- Effet hover : ombre plus prononcée

**Style visuel :**
```
┌────┬───────────────────────────────────────────────┬────────────┐
│    │ Titre                                         │            │
│[C] │ Auteur                                        │ [Lire]     │
│    │ Preview text lorem ipsum dolor sit amet...   │ [Modérer]  │
└────┴───────────────────────────────────────────────┴────────────┘
```

### 4. Sections concernées

Les deux modes sont disponibles pour :
1. **Mes documents uploadés** - Documents uploadés par l'utilisateur connecté
2. **Tous les livres** - Bibliothèque complète

## Implémentation technique

### État React

```javascript
const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'list'
```

### Styles principaux

#### Vue Grille
- `libraryGrid` : Grille responsive avec grid
- `libraryCard` : Carte de document avec flexbox vertical

#### Vue Liste
- `libraryList` : Container flex vertical
- `libraryListItem` : Ligne de document avec flexbox horizontal
- `listCover` : Miniature de couverture (80x112px)
- `listContent` : Contenu principal (titre, auteur, preview)
- `listActions` : Boutons d'action alignés à droite

### Boutons de bascule

```javascript
<div style={styles.viewToggleButtons}>
  <button
    style={{
      ...styles.viewToggleButton,
      ...(viewMode === 'grid' ? styles.viewToggleButtonActive : {})
    }}
    onClick={() => setViewMode('grid')}
  >
    ⊞ Grille
  </button>
  <button
    style={{
      ...styles.viewToggleButton,
      ...(viewMode === 'list' ? styles.viewToggleButtonActive : {})
    }}
    onClick={() => setViewMode('list')}
  >
    ☰ Liste
  </button>
</div>
```

### Affichage conditionnel

```javascript
{viewMode === 'grid' ? (
  <div style={styles.libraryGrid}>
    {/* Cartes de la vue grille */}
  </div>
) : (
  <div style={styles.libraryList}>
    {/* Lignes de la vue liste */}
  </div>
)}
```

## Avantages de chaque vue

### Vue Grille
✅ Visuellement attractive  
✅ Met en valeur les couvertures générées  
✅ Idéal pour parcourir visuellement  
✅ Espacement généreux  

❌ Prend plus d'espace vertical  
❌ Moins de documents visibles à l'écran  

### Vue Liste
✅ Affichage compact et dense  
✅ Plus de documents visibles simultanément  
✅ Plus de texte de prévisualisation visible  
✅ Idéal pour rechercher rapidement  
✅ Meilleure utilisation de l'espace horizontal  

❌ Couvertures plus petites  
❌ Moins d'impact visuel  

## Expérience utilisateur

### Cohérence
- Le mode sélectionné s'applique à toutes les sections (Mes documents + Tous les livres)
- Le mode persiste tant que l'utilisateur ne le change pas
- Transitions fluides entre les modes

### Accessibilité
- Boutons avec titre (title attribute)
- Images avec texte alternatif
- Contraste des couleurs respectant les normes WCAG
- Navigation au clavier possible

### Responsive
- Vue grille : S'adapte automatiquement avec auto-fit
- Vue liste : Reste lisible sur écrans moyens et grands
- Sur petits écrans, la vue liste peut nécessiter du scroll horizontal (à améliorer)

## Améliorations futures

1. **Persistance du mode** : Sauvegarder le choix dans localStorage
2. **Vue compacte** : Ajouter une troisième vue encore plus dense
3. **Filtres et tri** : Ajouter des options de filtrage par statut, date, etc.
4. **Responsive mobile** : Adapter la vue liste pour les petits écrans
5. **Animations** : Ajouter des transitions animées entre les modes
6. **Vue tableau** : Ajouter une vue tableau avec colonnes triables

## Exemples d'utilisation

### Cas d'usage 1 : Parcourir la bibliothèque
**Recommandation : Vue Grille**  
L'utilisateur peut voir visuellement les couvertures et se laisser guider par l'aspect visuel.

### Cas d'usage 2 : Chercher un livre spécifique
**Recommandation : Vue Liste**  
L'utilisateur peut scanner rapidement les titres et auteurs, avec plus de contenu visible.

### Cas d'usage 3 : Gérer ses uploads (modérateur)
**Recommandation : Vue Liste**  
Les administrateurs peuvent voir plus d'informations d'un coup d'œil (dates, statuts).

## Tests

Pour tester la fonctionnalité :

1. Démarrer le serveur et le client
2. Naviguer vers la page d'accueil
3. Cliquer sur le bouton "☰ Liste"
4. Vérifier que l'affichage change en liste
5. Cliquer sur "⊞ Grille" pour revenir
6. Vérifier les effets hover sur les lignes en mode liste
7. Tester avec différents navigateurs

## Code

Les modifications ont été apportées au fichier :
- `/client/src/Home.jsx`

Aucune modification backend nécessaire.

