# Structure du projet refactorisé

Ce projet a été refactorisé pour améliorer la modularité, la maintenabilité et la réutilisabilité du code.

## 📁 Structure des dossiers

```
src/
├── components/          # Composants réutilisables
│   ├── Alert.jsx       # Composant d'alerte
│   ├── Button.jsx      # Composant bouton
│   ├── Input.jsx       # Composant input
│   ├── Header.jsx      # En-tête de l'application
│   ├── LoginForm.jsx   # Formulaire de connexion
│   ├── RegisterForm.jsx # Formulaire d'inscription
│   ├── ProtectedRoute.jsx # Routes protégées
│   └── ...
├── pages/              # Pages de l'application
│   ├── AdminPage.jsx
│   ├── ModeratorPage.jsx
│   ├── QuarantinePage.jsx
│   └── ReadBookPage.jsx
├── services/           # Services pour la logique métier
│   ├── api.js         # Client API centralisé
│   └── auth.service.js # Service d'authentification
├── hooks/              # Hooks React personnalisés
│   └── useAuth.js     # Hook pour l'authentification
├── utils/              # Fonctions utilitaires
│   └── validators.js  # Fonctions de validation
├── styles/             # Styles réutilisables
│   └── commonStyles.js # Styles communs
├── Auth.jsx           # Page d'authentification
├── Home.jsx           # Page d'accueil
├── Upload.jsx         # Page d'upload
├── Presentation.jsx   # Page de présentation
└── main.jsx           # Point d'entrée

```

## 🎯 Améliorations apportées

### 1. **Modularisation du code**
- Séparation claire entre la logique métier (services), la présentation (composants) et les utilitaires
- Chaque fichier a une responsabilité unique et bien définie

### 2. **Composants réutilisables**
- `Button`, `Input`, `Alert` : composants UI de base
- `LoginForm`, `RegisterForm` : formulaires avec validation intégrée
- `ProtectedRoute` : gestion centralisée des routes protégées

### 3. **Services centralisés**
- **api.js** : Client HTTP unique pour toutes les requêtes
- **auth.service.js** : Logique d'authentification centralisée
  - Connexion/Déconnexion
  - Gestion du token
  - Normalisation des types d'utilisateurs

### 4. **Hooks personnalisés**
- **useAuth** : Hook pour accéder facilement à l'état d'authentification dans n'importe quel composant

### 5. **Validation centralisée**
- Fonctions de validation réutilisables dans `utils/validators.js`
- Validation côté client avant l'envoi au serveur

### 6. **Styles cohérents**
- Styles réutilisables dans `styles/commonStyles.js`
- Palette de couleurs centralisée
- Espacement standardisé

## 🚀 Avantages

1. **Maintenabilité** : Code plus facile à comprendre et à modifier
2. **Réutilisabilité** : Composants et fonctions réutilisables dans tout le projet
3. **Testabilité** : Séparation claire facilite l'écriture de tests
4. **Performance** : Moins de code dupliqué, bundle plus léger
5. **DRY (Don't Repeat Yourself)** : Élimination de la duplication de code
6. **Évolutivité** : Structure qui facilite l'ajout de nouvelles fonctionnalités

## 📝 Utilisation

### Configuration

1. Copiez `.env.example` vers `.env` :
```bash
cp .env.example .env
```

2. Configurez l'URL de l'API dans `.env` si nécessaire

### Service d'authentification

```javascript
import { login, logout, isAuthenticated } from './services/auth.service';

// Connexion
const response = await login(username, password);

// Déconnexion
logout();

// Vérifier l'authentification
if (isAuthenticated()) {
  // ...
}
```

### Hook useAuth

```javascript
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, userType, username } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>Bonjour {username}</p>}
    </div>
  );
}
```

### API Client

```javascript
import { api } from './services/api';

// GET
const data = await api.get('/api/books');

// POST
const result = await api.post('/api/books', { title: 'Mon livre' });

// PUT
await api.put('/api/books/1', { title: 'Nouveau titre' });

// DELETE
await api.delete('/api/books/1');
```

### Composants réutilisables

```javascript
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Alert } from './components/Alert';

<Input 
  type="text" 
  placeholder="Entrez votre nom" 
  value={name} 
  onChange={(e) => setName(e.target.value)} 
/>

<Button variant="primary" onClick={handleSubmit}>
  Envoyer
</Button>

<Alert type="success" message="Opération réussie !" />
```

## 🔒 Routes protégées

```javascript
import { ProtectedRoute, AdminRoute, ModeratorRoute } from './components/ProtectedRoute';

// Route pour tous les utilisateurs authentifiés
<ProtectedRoute>
  <MyPage />
</ProtectedRoute>

// Route réservée aux admins
<AdminRoute>
  <AdminPage />
</AdminRoute>

// Route pour modérateurs et admins
<ModeratorRoute>
  <ModeratorPage />
</ModeratorRoute>
```

## 🎨 Styles

```javascript
import { colors, spacing, button, input } from './styles/commonStyles';

const myStyle = {
  backgroundColor: colors.primary,
  padding: spacing.md,
  ...button.base,
  ...button.primary,
};
```

## 📦 Prochaines étapes recommandées

1. **Tests unitaires** : Ajouter des tests pour les services et composants
2. **TypeScript** : Migrer vers TypeScript pour une meilleure sécurité de type
3. **Storybook** : Documenter les composants UI avec Storybook
4. **Context API** : Utiliser Context pour l'état global si nécessaire
5. **React Query** : Améliorer la gestion du cache et des requêtes API
6. **Lazy loading** : Charger les pages à la demande pour améliorer les performances

## 🤝 Contribution

Lors de l'ajout de nouvelles fonctionnalités :
- Utilisez les services existants pour les appels API
- Créez des composants réutilisables dans `components/`
- Ajoutez des hooks personnalisés dans `hooks/` si nécessaire
- Respectez la structure des dossiers
- Utilisez les styles communs pour la cohérence visuelle

