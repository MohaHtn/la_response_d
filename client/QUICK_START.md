# 🚀 Guide de Démarrage Rapide

## Installation en 3 étapes

### 1️⃣ Installer les dépendances
```bash
cd client
npm install
```

### 2️⃣ Configurer l'environnement
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Éditer .env si nécessaire (par défaut: http://localhost:8000)
```

### 3️⃣ Lancer l'application
```bash
npm run dev
```

L'application sera disponible sur **http://localhost:5173** 🎉

## 📚 Utilisation Basique

### Import des modules principaux
```javascript
// Services
import { api, login, logout, getAuthData } from './services';

// Hooks
import { useAuth } from './hooks';

// Composants
import { Button, Input, Alert, LoginForm, RegisterForm } from './components';

// Constantes
import { USER_TYPES, ROUTES, STORAGE_KEYS } from './constants';

// Styles
import { colors, spacing, button } from './styles';
```

### Exemple: Créer une page authentifiée
```javascript
import { useAuth } from './hooks';
import { api } from './services';
import { Button } from './components';

function MyPage() {
  const { isAuthenticated, userType } = useAuth();
  
  const loadData = async () => {
    const data = await api.get('/api/my-endpoint');
    console.log(data);
  };
  
  if (!isAuthenticated) {
    return <div>Vous devez être connecté</div>;
  }
  
  return (
    <div>
      <h1>Bienvenue {userType}</h1>
      <Button onClick={loadData}>Charger les données</Button>
    </div>
  );
}
```

## 📖 Documentation Complète

- **Structure du projet** : [REFACTORING.md](./REFACTORING.md)
- **Migrer du code existant** : [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
- **Bonnes pratiques** : [BEST_PRACTICES.md](./BEST_PRACTICES.md)
- **Historique** : [CHANGELOG.md](./CHANGELOG.md)
- **Vue d'ensemble** : [REFACTORING_SUMMARY.md](./REFACTORING_SUMMARY.md)

## 🛠️ Commandes Utiles

```bash
# Développement
npm run dev              # Lance le serveur de dev

# Build
npm run build            # Compile pour la production
npm run preview          # Prévisualise le build

# Qualité de code
npm run lint             # Vérifie le code

# Nettoyage
rm -rf node_modules      # Supprimer node_modules
npm install              # Réinstaller
```

## 🔥 Démarrage Ultra-Rapide

Si vous voulez juste tester :

```bash
# Une seule commande !
npm install && npm run dev
```

## ❓ Problèmes Fréquents

**Port déjà utilisé ?**
```bash
# Changer le port dans vite.config.js ou:
PORT=3000 npm run dev
```

**Erreur de connexion API ?**
```bash
# Vérifier que le backend est lancé sur le port 8000
# Ou modifier VITE_API_URL dans .env
```

**Cache problématique ?**
```bash
# Nettoyer le cache
rm -rf node_modules/.vite
npm run dev
```

## 🎯 Prochaines Étapes

1. ✅ Lire [REFACTORING.md](./REFACTORING.md) pour comprendre la structure
2. ✅ Explorer les exemples dans `src/Auth.jsx` et `src/components/`
3. ✅ Suivre [BEST_PRACTICES.md](./BEST_PRACTICES.md) pour développer
4. ✅ Consulter [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) pour migrer du code

---

**Besoin d'aide ?** Consultez la documentation ou ouvrez une issue ! 🤝

