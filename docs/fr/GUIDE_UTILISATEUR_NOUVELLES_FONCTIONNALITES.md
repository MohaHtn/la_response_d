# Guide utilisateur - Nouvelles fonctionnalités

## 🎨 Images de prévisualisation automatiques

### Qu'est-ce que c'est ?

Lorsque vous uploadez un document PDF, le système génère automatiquement une **image de couverture** personnalisée contenant :
- Le titre du document
- L'auteur
- Un extrait du contenu (300 caractères)

### Comment ça marche ?

1. **Uploadez votre PDF** via le formulaire d'upload
2. Le système effectue l'OCR et extrait le texte
3. **Automatiquement**, une image de prévisualisation est créée
4. L'image est stockée avec votre document
5. Elle apparaît dans la bibliothèque

### Exemple visuel

```
┌─────────────────────────┐
│                         │
│  Histoire de la         │
│  Biologie               │
│                         │
│  par Maurice Caullery   │
│  ─────────────────      │
│                         │
│  La biologie est une    │
│  science qui étudie     │
│  les êtres vivants...   │
│                         │
└─────────────────────────┘
```

### Avantages

- ✅ **Aucune action nécessaire** - Tout est automatique
- ✅ **Unique** - Chaque couverture reflète le contenu réel
- ✅ **Rapide** - Génération en moins d'une seconde
- ✅ **Professionnel** - Style cohérent avec l'application

---

## 📊 Modes d'affichage - Grille et Liste

### Qu'est-ce que c'est ?

Vous pouvez maintenant choisir comment afficher les documents de la bibliothèque :

#### 🔲 **Mode Grille** (par défaut)
Affichage en cartes avec grandes couvertures

```
┌────────┐  ┌────────┐  ┌────────┐
│ [IMG]  │  │ [IMG]  │  │ [IMG]  │
│ Titre  │  │ Titre  │  │ Titre  │
│ Auteur │  │ Auteur │  │ Auteur │
│ [Lire] │  │ [Lire] │  │ [Lire] │
└────────┘  └────────┘  └────────┘
```

**Idéal pour :**
- Parcourir visuellement la bibliothèque
- Découvrir de nouveaux livres
- Apprécier les couvertures

#### ☰ **Mode Liste** (nouveau)
Affichage ligne par ligne, plus compact

```
┌────┬──────────────────────────────────┬─────────┐
│[I] │ Titre - Auteur                   │ [Lire]  │
│[M] │ Preview text lorem ipsum...      │ [Modér.]│
├────┼──────────────────────────────────┼─────────┤
│[I] │ Autre titre - Auteur             │ [Lire]  │
│[M] │ Preview text lorem ipsum...      │ [Modér.]│
└────┴──────────────────────────────────┴─────────┘
```

**Idéal pour :**
- Chercher un livre spécifique
- Voir plus de documents à l'écran
- Lire plus de détails (previews plus longues)

### Comment basculer entre les modes ?

1. **Localisez les boutons** en haut à droite de chaque section :
   ```
   Mes documents uploadés (3)     [⊞ Grille] [☰ Liste]
   ```

2. **Cliquez sur "☰ Liste"** pour passer en mode liste

3. **Cliquez sur "⊞ Grille"** pour revenir en mode grille

4. **Votre choix est sauvegardé** - La prochaine fois que vous visitez la page, votre préférence sera conservée

### Sections concernées

Les deux modes sont disponibles pour :
- 📤 **Mes documents uploadés** (vos uploads personnels)
- 📚 **Tous les livres** (bibliothèque complète)

---

## 🎯 Cas d'usage

### Scénario 1 : Découvrir de nouveaux livres
**Recommandation : Mode Grille**

1. Allez sur la page d'accueil
2. Assurez-vous que le mode **⊞ Grille** est actif
3. Parcourez visuellement les couvertures
4. Cliquez sur un livre qui vous intéresse

### Scénario 2 : Retrouver un livre spécifique
**Recommandation : Mode Liste**

1. Cliquez sur **☰ Liste**
2. Scannez rapidement les titres (plus visibles en mode liste)
3. Utilisez les previews pour confirmer le contenu
4. Cliquez sur "Lire"

### Scénario 3 : Gérer vos uploads (administrateur)
**Recommandation : Mode Liste**

1. Allez dans "Mes documents uploadés"
2. Activez le mode **☰ Liste**
3. Voyez plus d'informations d'un coup (dates, statuts)
4. Modérez les documents nécessaires

---

## 💡 Astuces

### Astuces pour les images de prévisualisation

1. **Titres clairs** - Assurez-vous que vos PDFs ont des titres bien définis
2. **Métadonnées** - Les PDFs avec métadonnées produisent de meilleures couvertures
3. **Contenu lisible** - Un texte OCR de qualité produit de meilleures previews

### Astuces pour les modes d'affichage

1. **Raccourcis mentaux** :
   - 🔲 Grille = Visuel / Découverte
   - ☰ Liste = Efficacité / Recherche

2. **Changez selon le contexte** :
   - Début de session → Mode Grille (découvrir)
   - Recherche active → Mode Liste (efficacité)

3. **Testez les deux** - Chaque utilisateur a ses préférences !

---

## 🐛 Dépannage

### L'image de couverture ne s'affiche pas

**Causes possibles :**
- Le document a été uploadé avant l'implémentation de cette fonctionnalité
- Erreur lors de la génération (vérifier les logs serveur)

**Solution :**
- Re-uploadez le document pour générer une nouvelle image

### Mon mode de vue ne se sauvegarde pas

**Causes possibles :**
- Les cookies/localStorage sont désactivés dans votre navigateur
- Navigation privée/incognito

**Solution :**
- Activez localStorage dans les paramètres du navigateur
- Utilisez une fenêtre normale (pas incognito)

### Les images mettent du temps à charger

**Causes possibles :**
- Images base64 volumineuses
- Connexion internet lente

**Solution :**
- Normale - Les images sont générées une seule fois et mises en cache

---

## 📞 Support

Si vous rencontrez des problèmes avec ces fonctionnalités :

1. Vérifiez les logs du serveur (terminal backend)
2. Vérifiez la console du navigateur (F12)
3. Consultez la documentation technique dans `/docs/fr/`

---

## 🎉 Profitez de ces nouvelles fonctionnalités !

Ces améliorations rendent la bibliothèque plus visuelle, plus flexible et plus agréable à utiliser. N'hésitez pas à explorer et à trouver votre mode préféré !

