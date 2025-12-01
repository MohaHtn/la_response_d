# Guide des Bonnes Pratiques

Ce document définit les standards de code et les bonnes pratiques à suivre pour ce projet.

## 📁 Organisation des Fichiers

### Règle de Nommage
- **Composants React** : PascalCase (ex: `LoginForm.jsx`)
- **Services/Utilitaires** : camelCase (ex: `auth.service.js`)
- **Constantes** : snake_case en MAJUSCULES dans le fichier
- **Fichiers CSS** : kebab-case (ex: `common-styles.css`)

### Où placer vos fichiers ?

```
src/
├── components/     → Composants UI réutilisables
├── pages/          → Pages complètes de l'application
├── services/       → Logique métier, appels API
├── hooks/          → Hooks React personnalisés
├── utils/          → Fonctions utilitaires pures
├── constants/      → Configuration et constantes
├── styles/         → Styles réutilisables
└── assets/         → Images, fonts, etc.
```

## 🎨 Structure d'un Composant

### Template Standard
```javascript
/**
 * Description du composant
 */

// 1. Imports externes (React, bibliothèques)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Imports internes (services, hooks, utils)
import { useAuth } from '../hooks';
import { api } from '../services';
import { Button, Alert } from '../components';

// 3. Imports de constantes et styles
import { ROUTES, USER_TYPES } from '../constants';
import { colors, spacing } from '../styles';

// 4. Styles locaux (si nécessaire)
const styles = {
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
};

// 5. Composant
export const MyComponent = ({ prop1, prop2 }) => {
  // État
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Hooks personnalisés
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Effets
  useEffect(() => {
    // ...
  }, []);
  
  // Gestionnaires d'événements
  const handleClick = () => {
    // ...
  };
  
  // Rendu conditionnel tôt (early return)
  if (loading) return <div>Chargement...</div>;
  if (!data) return null;
  
  // Rendu principal
  return (
    <div style={styles.container}>
      {/* Contenu */}
    </div>
  );
};

// 6. Export par défaut (si nécessaire)
export default MyComponent;
```

## 🔧 Services

### Création d'un nouveau service
```javascript
/**
 * Service de gestion des livres
 */

import { api } from './api';
import { API_CONFIG } from '../constants';

export const bookService = {
  /**
   * Récupère tous les livres
   */
  getAll: async () => {
    return await api.get(API_CONFIG.ENDPOINTS.BOOKS);
  },
  
  /**
   * Récupère un livre par son ID
   */
  getById: async (id) => {
    return await api.get(`${API_CONFIG.ENDPOINTS.BOOKS}/${id}`);
  },
  
  /**
   * Crée un nouveau livre
   */
  create: async (bookData) => {
    return await api.post(API_CONFIG.ENDPOINTS.BOOKS, bookData);
  },
};
```

## 🪝 Hooks Personnalisés

### Template de Hook
```javascript
/**
 * Hook pour gérer les livres
 */

import { useState, useEffect } from 'react';
import { bookService } from '../services';

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    loadBooks();
  }, []);
  
  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookService.getAll();
      setBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return { books, loading, error, reload: loadBooks };
};
```

## 📝 Validation

### Utiliser les validateurs existants
```javascript
import { validateEmail, validatePassword } from '../utils';

// ✅ BON
if (!validateEmail(email)) {
  setError('Email invalide');
  return;
}

// ❌ MAUVAIS - Ne pas réinventer la roue
if (!email.includes('@')) {
  setError('Email invalide');
  return;
}
```

## 🎨 Styles

### Utiliser les styles communs
```javascript
import { colors, spacing, button } from '../styles';

// ✅ BON - Utilise les valeurs centralisées
const myStyle = {
  backgroundColor: colors.primary,
  padding: spacing.md,
};

// ❌ MAUVAIS - Valeurs en dur
const myStyle = {
  backgroundColor: '#2196f3',
  padding: '16px',
};
```

### Quand créer des styles locaux ?
- Styles spécifiques à un seul composant
- Styles complexes ou calculés
- Styles qui ne seront jamais réutilisés

### Quand utiliser les styles communs ?
- Couleurs de marque
- Espacements
- Styles de boutons/inputs standards
- Alertes et notifications

## 🔐 Authentification

### Utiliser le hook useAuth
```javascript
import { useAuth } from '../hooks';

function MyComponent() {
  const { isAuthenticated, userType } = useAuth();
  
  // ✅ BON
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  // ❌ MAUVAIS - Ne pas accéder directement au localStorage
  if (!localStorage.getItem('authToken')) {
    return <LoginPrompt />;
  }
}
```

### Utiliser les services d'auth
```javascript
import { login, logout } from '../services';

// ✅ BON
const handleLogin = async () => {
  try {
    await login(username, password);
    navigate('/home');
  } catch (err) {
    setError(err.message);
  }
};

// ❌ MAUVAIS - Ne pas gérer l'auth manuellement
const handleLogin = async () => {
  const res = await fetch('...');
  localStorage.setItem('authToken', data.token);
};
```

## 🌐 Appels API

### Toujours utiliser le service API
```javascript
import { api } from '../services';

// ✅ BON
const books = await api.get('/api/books');

// ❌ MAUVAIS - Ne pas utiliser fetch directement
const res = await fetch('http://localhost:8000/api/books');
const books = await res.json();
```

### Gestion des erreurs
```javascript
// ✅ BON - Laisser le service gérer les erreurs
try {
  const data = await api.post('/api/books', bookData);
  setBooks(prev => [...prev, data]);
} catch (err) {
  setError(err.message); // Message d'erreur normalisé
}

// ❌ MAUVAIS - Gestion manuelle complexe
const res = await fetch('...');
if (!res.ok) {
  const err = await res.json();
  setError(err.detail || err.message || 'Erreur');
}
```

## 📋 Constantes

### Toujours utiliser les constantes
```javascript
import { USER_TYPES, ROUTES, STORAGE_KEYS } from '../constants';

// ✅ BON
if (userType === USER_TYPES.ADMIN) {
  navigate(ROUTES.ADMIN);
}
const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

// ❌ MAUVAIS - Chaînes en dur
if (userType === 'ADMIN') {
  navigate('/admin');
}
const token = localStorage.getItem('authToken');
```

### Ajouter de nouvelles constantes
```javascript
// constants/index.js
export const BOOK_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

export const API_CONFIG = {
  // ...existing code...
  ENDPOINTS: {
    // ...existing code...
    BOOKS_BY_STATUS: (status) => `/api/books?status=${status}`,
  },
};
```

## 🧪 Tests (À implémenter)

### Structure recommandée
```
src/
├── components/
│   ├── Button.jsx
│   └── Button.test.jsx       ← Test à côté du composant
├── services/
│   ├── api.js
│   └── api.test.js
└── __tests__/                ← Tests d'intégration
    └── auth.integration.test.js
```

## 📦 Imports

### Ordre des imports
1. React et bibliothèques externes
2. Services et hooks internes
3. Composants internes
4. Constantes et configuration
5. Styles et assets

### Utiliser les index
```javascript
// ✅ BON - Import depuis l'index
import { Button, Alert, Input } from '../components';
import { api, login, logout } from '../services';
import { useAuth } from '../hooks';

// ❌ MAUVAIS - Imports individuels
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import { Input } from '../components/Input';
```

## ✨ Performance

### Optimisations recommandées
- Utiliser `React.memo()` pour les composants coûteux
- Utiliser `useMemo()` et `useCallback()` quand approprié
- Lazy loading des pages avec `React.lazy()`
- Éviter les re-renders inutiles

```javascript
// Exemple de lazy loading
import { lazy, Suspense } from 'react';

const AdminPage = lazy(() => import('./pages/AdminPage'));

<Suspense fallback={<div>Chargement...</div>}>
  <AdminPage />
</Suspense>
```

## 🚫 Anti-Patterns à Éviter

### 1. Ne pas dupliquer le code
❌ **MAUVAIS**
```javascript
// Dans ComponentA.jsx
const fetchBooks = async () => {
  const res = await fetch('...');
  return res.json();
};

// Dans ComponentB.jsx (DUPLICATION)
const fetchBooks = async () => {
  const res = await fetch('...');
  return res.json();
};
```

✅ **BON**
```javascript
// services/book.service.js
export const getBooks = async () => {
  return await api.get('/api/books');
};

// Utilisé dans ComponentA et ComponentB
import { getBooks } from '../services';
```

### 2. Ne pas mélanger logique et présentation
❌ **MAUVAIS**
```javascript
function MyComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('...')
      .then(res => res.json())
      .then(data => setData(data));
  }, []);
  
  return <div>{data?.title}</div>;
}
```

✅ **BON**
```javascript
// Hook personnalisé pour la logique
function useBookData(bookId) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    bookService.getById(bookId)
      .then(setData);
  }, [bookId]);
  
  return data;
}

// Composant pour la présentation
function MyComponent({ bookId }) {
  const book = useBookData(bookId);
  return <div>{book?.title}</div>;
}
```

### 3. Ne pas accéder directement au localStorage
❌ **MAUVAIS**
```javascript
const token = localStorage.getItem('authToken');
```

✅ **BON**
```javascript
import { getAuthData } from '../services';
const { token } = getAuthData();
```

## 📖 Documentation

### Commenter votre code
- Ajouter des JSDoc pour les fonctions publiques
- Expliquer le "pourquoi", pas le "comment"
- Mettre à jour les docs quand vous changez le code

```javascript
/**
 * Récupère et formate les livres pour l'affichage en grille
 * @param {string} category - Catégorie de livres à récupérer
 * @param {number} limit - Nombre maximum de livres
 * @returns {Promise<Array>} Liste des livres formatés
 */
export const getFormattedBooks = async (category, limit = 10) => {
  // ...
};
```

## 🎯 Checklist Avant Commit

- [ ] Le code suit les conventions de nommage
- [ ] Les imports sont organisés correctement
- [ ] Pas de code dupliqué
- [ ] Utilisation des services/hooks existants
- [ ] Utilisation des constantes
- [ ] Pas d'erreurs ESLint (si configuré)
- [ ] Le code est commenté si nécessaire
- [ ] Testé manuellement

## 🚀 Évolution du Projet

Quand ajouter quelque chose de nouveau :

1. **Nouveau composant UI réutilisable** → `src/components/`
2. **Nouvelle page** → `src/pages/`
3. **Nouvelle logique API** → `src/services/`
4. **Nouveau hook** → `src/hooks/`
5. **Nouvelle fonction utilitaire** → `src/utils/`
6. **Nouvelles constantes** → `src/constants/index.js`
7. **Nouveaux styles réutilisables** → `src/styles/commonStyles.js`

## 📚 Ressources

- [React Best Practices](https://react.dev/learn)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
- Documentation du projet : `REFACTORING.md`, `MIGRATION_GUIDE.md`

---

**Rappelez-vous** : Code propre = code maintenable = équipe heureuse 🎉

