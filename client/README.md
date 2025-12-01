# 📚 Bibliothéko - Application de Bibliothèque Numérique

Application web React pour la gestion et la consultation d'une bibliothèque numérique.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Créer le fichier de configuration
cp .env.example .env

# Lancer en mode développement
npm run dev

# Compiler pour la production
npm run build
```

## 📁 Structure du Projet

```
client/
├── src/
│   ├── components/          # Composants UI réutilisables
│   │   ├── Alert.jsx
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Header.jsx
│   │
│   ├── pages/               # Pages de l'application
│   │   ├── AdminPage.jsx
│   │   ├── ModeratorPage.jsx
│   │   ├── QuarantinePage.jsx
│   │   └── ReadBookPage.jsx
│   │
│   ├── services/            # Services et logique métier
│   │   ├── api.js          # Client API centralisé
│   │   └── auth.service.js # Service d'authentification
│   │
│   ├── hooks/               # Hooks React personnalisés
│   │   └── useAuth.js
│   │
│   ├── utils/               # Fonctions utilitaires
│   │   └── validators.js
│   │
│   ├── constants/           # Configuration et constantes
│   │   └── index.js
│   │
│   └── styles/              # Styles réutilisables
│       └── commonStyles.js
│
├── public/                  # Fichiers statiques
├── .env.example            # Variables d'environnement
├── package.json
├── vite.config.js
│
└── Documentation/
    ├── REFACTORING.md      # Guide de la nouvelle structure
    ├── MIGRATION_GUIDE.md  # Guide de migration
    ├── CHANGELOG.md        # Historique des changements
    └── BEST_PRACTICES.md   # Guide des bonnes pratiques
```

## 🎯 Fonctionnalités

### Authentification
- ✅ Connexion / Inscription
- ✅ Gestion des sessions
- ✅ Rôles utilisateurs (User, Moderator, Admin)
- ✅ Routes protégées par rôle

### Bibliothèque
- 📖 Consultation des livres
- 📤 Upload de documents
- 🔍 Recherche et filtres
- 📚 Gestion des collections

### Administration
- 👥 Gestion des utilisateurs
- 📋 Modération des contenus
- 🚨 Quarantaine des documents
- 📊 Statistiques

## 🛠️ Technologies

- **React 19** - Framework UI
- **React Router 7** - Routing
- **Material-UI 7** - Composants UI
- **Vite** - Build tool
- **React Markdown** - Rendu Markdown
- **KaTeX** - Formules mathématiques

## 📖 Documentation

### Pour commencer
- Lisez [REFACTORING.md](./REFACTORING.md) pour comprendre la structure
- Consultez [BEST_PRACTICES.md](./BEST_PRACTICES.md) pour les conventions de code

### Pour migrer du code existant
- Suivez le [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

### Historique
- Consultez [CHANGELOG.md](./CHANGELOG.md) pour les changements récents

## 💡 Exemples d'Usage

### Utiliser le service API
```javascript
import { api } from './services';

// GET
const books = await api.get('/api/books');

// POST
const newBook = await api.post('/api/books', bookData);
```

### Utiliser l'authentification
```javascript
import { useAuth } from './hooks';
import { login, logout } from './services';

function MyComponent() {
  const { isAuthenticated, userType } = useAuth();
  
  const handleLogin = async () => {
    await login(username, password);
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Déconnexion</button>
      ) : (
        <button onClick={handleLogin}>Connexion</button>
      )}
    </div>
  );
}
```

### Créer un composant avec les styles communs
```javascript
import { Button, Input, Alert } from './components';
import { colors, spacing } from './styles';

function MyForm() {
  return (
    <div style={{ padding: spacing.lg }}>
      <Input placeholder="Email" />
      <Button variant="primary">Envoyer</Button>
      <Alert type="success" message="Succès !" />
    </div>
  );
}
```

## 🔒 Routes

| Route | Description | Accès |
|-------|-------------|-------|
| `/` | Page de présentation | Public |
| `/auth` | Connexion/Inscription | Public |
| `/home` | Bibliothèque | Authentifié |
| `/upload` | Upload de documents | Authentifié |
| `/book/:id` | Lecture d'un livre | Authentifié |
| `/moderation/:id` | Modération | Moderator/Admin |
| `/admin` | Administration | Admin |
| `/admin/quarantine` | Quarantaine | Admin |

## 🧪 Tests (À venir)

```bash
# Lancer les tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 📦 Scripts NPM

```bash
npm run dev          # Lance le serveur de développement
npm run build        # Compile pour la production
npm run preview      # Prévisualise le build de production
npm run lint         # Vérifie le code avec ESLint
```

## 🌐 Configuration

### Variables d'Environnement

Créez un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:8000
```

## 🤝 Contribution

### Workflow

1. Créer une branche depuis `main`
```bash
git checkout -b feature/ma-fonctionnalite
```

2. Développer en suivant [BEST_PRACTICES.md](./BEST_PRACTICES.md)

3. Tester localement
```bash
npm run dev
npm run lint
```

4. Commiter avec des messages clairs
```bash
git commit -m "feat: ajout de la fonctionnalité X"
```

5. Créer une Pull Request

### Convention de Commits

- `feat:` Nouvelle fonctionnalité
- `fix:` Correction de bug
- `refactor:` Refactorisation
- `docs:` Documentation
- `style:` Formatage
- `test:` Tests
- `chore:` Maintenance

## 🐛 Debugging

### Problèmes courants

**Erreur de connexion à l'API**
```bash
# Vérifier que le backend est lancé
# Vérifier VITE_API_URL dans .env
```

**Erreur d'authentification**
```bash
# Nettoyer le localStorage
localStorage.clear()
```

**Erreur de build**
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📊 Performance

Le projet utilise plusieurs optimisations :
- Code splitting
- Lazy loading des pages
- Memoization des composants coûteux
- Bundle optimisé avec Vite

## 🔐 Sécurité

- ✅ Authentification par token
- ✅ Routes protégées
- ✅ Validation côté client
- ✅ Protection CSRF (à implémenter côté backend)
- ✅ Headers sécurisés (à configurer)

## 📝 License

[Votre License]

## 👥 Équipe

- **Développeur Principal** : [Votre Nom]
- **Contributeurs** : Voir [CONTRIBUTORS.md](./CONTRIBUTORS.md)

## 📞 Support

Pour toute question ou problème :
1. Consultez la documentation dans `docs/`
2. Ouvrez une issue sur GitHub
3. Contactez l'équipe de développement

## 🗺️ Roadmap

### Version 2.1 (Q1 2025)
- [ ] Migration vers TypeScript
- [ ] Tests unitaires complets
- [ ] Storybook pour les composants

### Version 2.2 (Q2 2025)
- [ ] React Query pour le cache
- [ ] Optimisation des performances
- [ ] Mode hors ligne (PWA)

### Version 3.0 (Q3 2025)
- [ ] Refonte complète de l'UI
- [ ] Dark mode
- [ ] Internationalisation (i18n)

---

**Version actuelle** : 2.0.0  
**Dernière mise à jour** : 2025-12-01  
**Status** : ✅ En production

