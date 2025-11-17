# Architecture Frontend - La Réponse d'V2

## Diagramme de l'architecture

```plantuml
@startuml
!define RECTANGLE class

skinparam packageStyle rectangle
skinparam component {
  BackgroundColor<<app>> #e3f2fd
  BackgroundColor<<router>> #bbdefb
  BackgroundColor<<page>> White
  BackgroundColor<<component>> #fff9c4
  BackgroundColor<<lib>> #f3e5f5
}

package "Application React" {
  component [main.jsx\nPoint d'entrée] as Main <<app>>
  component [React Router\nGestion des routes] as Router <<router>>
}

package "Pages Principales" {
  component [Presentation.jsx\nPage d'accueil publique] as Presentation <<page>>
  component [Auth.jsx\nAuthentification/Inscription] as Auth <<page>>
  component [Home.jsx\nBibliothèque principale] as Home <<page>>
  component [Upload.jsx\nUpload de PDF] as Upload <<page>>
}

package "Pages Livres" {
  component [ReadBookPage.jsx\nLecture d'un livre] as ReadBook <<page>>
  component [ModerationPage.jsx\nModération d'un livre] as Moderation <<page>>
}

package "Composants Réutilisables" {
  component [Header.jsx\nBarre de navigation] as Header <<component>>
  component [ModeratorValidationTable.jsx\nTableau de validation] as ModTable <<component>>
}

package "Bibliothèques Externes" {
  component [Material-UI\nComposants UI] as MUI <<lib>>
  component [ReactMarkdown\nRendu Markdown] as Markdown <<lib>>
  component [KaTeX\nFormules mathématiques] as Math <<lib>>
}

Main --> Router

Router --> Presentation
Router --> Auth
Router --> Home
Router --> Upload
Router --> ReadBook
Router --> Moderation

Presentation --> Header
Auth --> Header
Home --> Header
Upload --> Header
ReadBook --> Header
Moderation --> Header
Moderation --> ModTable

Home ..> ReadBook : Lien
Home ..> Moderation : Lien

Presentation --> MUI
Auth --> MUI
ReadBook --> MUI
ReadBook --> Markdown
ReadBook --> Math
Moderation --> MUI
ModTable --> MUI
Upload --> Markdown
Upload --> Math
Header --> MUI

@enduml
```

## Description de l'architecture

### Structure de routage

```
/ → Presentation (Page publique de présentation)
/auth → Auth (Connexion/Inscription)
/home → Home (Bibliothèque - Accueil utilisateur)
/upload → Upload (Upload de PDF)
/book/:bookId → ReadBookPage (Lecture d'un livre)
/moderator?book=:id → ModerationPage (Modération d'un livre)
```

### Composants principaux

#### 1. **main.jsx**
- Point d'entrée de l'application
- Configuration du routeur React Router
- Définition de toutes les routes

#### 2. **Pages**

**Presentation.jsx**
- Page d'accueil publique
- Présentation du projet
- Accès à la documentation
- Accessible sans authentification

**Auth.jsx**
- Page d'authentification
- Formulaires de connexion et d'inscription
- Appels API vers `/api/login` et `/api/register`

**Home.jsx**
- Bibliothèque principale
- Affichage des livres commencés
- Affichage de tous les livres disponibles
- Navigation vers ReadBookPage et ModerationPage

**Upload.jsx**
- Interface d'upload de PDF
- Prévisualisation du contenu

**ReadBookPage.jsx**
- Page de lecture d'un livre
- Rendu Markdown avec support LaTeX
- Récupération du contenu via API

**ModerationPage.jsx**
- Interface de modération d'un livre
- Affichage des métadonnées
- Tableau de validation des modérateurs
- Onglets pour différentes sections

#### 3. **Composants réutilisables**

**Header.jsx**
- Barre de navigation fixe en haut
- Liens vers Home, Upload
- Utilisé par toutes les pages

**ModeratorValidationTable.jsx**
- Tableau de statut de validation
- Affiche les 3 modérateurs
- États: En attente, Approuvé, Rejeté

### Bibliothèques utilisées

- **React Router DOM** : Navigation et routage
- **Material-UI (MUI)** : Composants UI (AppBar, Typography, Paper, Table, etc.)
- **ReactMarkdown** : Rendu des fichiers Markdown
- **remark-math / rehype-katex** : Support des formules mathématiques LaTeX
- **KaTeX** : Rendu des équations mathématiques

### Flux de navigation

1. **Accès initial** : `/` → Presentation
2. **Authentification** : Presentation → `/auth` → Auth
3. **Après connexion** : Auth → `/home` → Home
4. **Lecture d'un livre** : Home → `/book/:id` → ReadBookPage
5. **Modération** : Home → `/moderator?book=:id` → ModerationPage
6. **Upload** : Header (Upload button) → `/upload` → Upload

### État et données

- Les données utilisateurs sont stockées dans `users.json` (backend)
- Les livres sont récupérés via des appels API
- Le tableau de modération utilise des données mockées (à remplacer par API)

### Style et responsive

- Utilisation de styles inline avec des objets JavaScript
- Design responsive avec `100vw` et `100vh`
- Couleurs principales : bleu (#2196f3, #1976d2) et gris (#f5f5f5)
```

## Diagramme de flux utilisateur

```plantuml
@startuml
[*] --> Presentation

Presentation --> Auth : Connexion
Auth --> Home : Authentifié
Home --> ReadBook : Lire un livre
Home --> Moderation : Modérer
Home --> Upload : Via Header
ReadBook --> Home : Retour
Moderation --> Home : Retour
Upload --> Home : Retour
Home --> Auth : Déconnexion
Auth --> [*]

@enduml
```

## Diagramme de composants

```plantuml
@startuml

skinparam component {
  BackgroundColor<<shared>> #ffeb3b
  BackgroundColor<<page>> White
}

package "Composants UI Partagés" {
  component [Header] as H <<shared>>
  component [ModeratorValidationTable] as MVT <<shared>>
}

package "Pages" {
  component [Presentation] as P <<page>>
  component [Auth] as A <<page>>
  component [Home] as Ho <<page>>
  component [Upload] as U <<page>>
  component [ReadBookPage] as RB <<page>>
  component [ModerationPage] as M <<page>>
}

H .down.> P : utilisé par
H .down.> A : utilisé par
H .down.> Ho : utilisé par
H .down.> U : utilisé par
H .down.> RB : utilisé par
H .down.> M : utilisé par

MVT .down.> M : utilisé par

@enduml
```

