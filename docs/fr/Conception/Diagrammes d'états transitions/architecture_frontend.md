# Architecture Frontend - La Réponse d'V2

## Diagramme de l'architecture

```mermaid
graph TB
    subgraph "Application React"
        Main[main.jsx<br/>Point d'entrée]
        Router[React Router<br/>Gestion des routes]
    end
    
    subgraph "Pages Principales"
        Presentation[Presentation.jsx<br/>Page d'accueil publique]
        Auth[Auth.jsx<br/>Authentification/Inscription]
        Home[Home.jsx<br/>Bibliothèque principale]
        Upload[Upload.jsx<br/>Upload de PDF]
    end
    
    subgraph "Pages Livres"
        ReadBook[ReadBookPage.jsx<br/>Lecture d'un livre]
        Moderation[ModerationPage.jsx<br/>Modération d'un livre]
    end
    
    subgraph "Composants Réutilisables"
        Header[Header.jsx<br/>Barre de navigation]
        ModTable[ModeratorValidationTable.jsx<br/>Tableau de validation]
    end
    
    subgraph "Bibliothèques Externes"
        MUI[Material-UI<br/>Composants UI]
        Markdown[ReactMarkdown<br/>Rendu Markdown]
        Math[KaTeX<br/>Formules mathématiques]
    end
    
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
    
    Home -.Lien.-> ReadBook
    Home -.Lien.-> Moderation
    
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
    
    style Main fill:#e3f2fd
    style Router fill:#bbdefb
    style Header fill:#fff9c4
    style ModTable fill:#fff9c4
    style MUI fill:#f3e5f5
    style Markdown fill:#f3e5f5
    style Math fill:#f3e5f5
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

```mermaid
stateDiagram-v2
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
```

## Diagramme de composants

```mermaid
graph LR
    subgraph "Composants UI Partagés"
        H[Header]
        MVT[ModeratorValidationTable]
    end
    
    subgraph "Pages"
        P[Presentation]
        A[Auth]
        Ho[Home]
        U[Upload]
        RB[ReadBookPage]
        M[ModerationPage]
    end
    
    H -.utilisé par.-> P
    H -.utilisé par.-> A
    H -.utilisé par.-> Ho
    H -.utilisé par.-> U
    H -.utilisé par.-> RB
    H -.utilisé par.-> M
    
    MVT -.utilisé par.-> M
    
    style H fill:#ffeb3b
    style MVT fill:#ffeb3b
```

