# La Réponse D - Bibliothèque Numérique

Bienvenue dans le projet **La Réponse D**, une plateforme de bibliothèque numérique moderne intégrant 
des capacités d'OCR avancées.

## 🚀 Aperçu

La Réponse D permet aux utilisateurs de :
- Parcourir et consulter des œuvres numériques.
- Utiliser l'IA (Pixtral) pour la reconnaissance de texte (OCR).
- Exporter des œuvres au format Markdown structuré.
- Gérer les membres et modérer les contenus.

## 🛠️ Installation et Développement Local

### Prérequis
- **Python** : 3.12 ou supérieur
- **Node.js** : 18 ou supérieur
- **Redis** : Requis pour le stockage en base

### Configuration du Backend (Serveur)

1. Accédez au dossier serveur :
   ```bash
   cd server
   ```

2. Créez votre fichier d'environnement :
   ```bash
   cp .env.example .env
   ```
   Configurez les clés API `GEMINI_API_KEY` et `PIXTRAL_API_KEY` dans le fichier `.env`.

3. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

4. Démarrez le serveur :
   ```bash
   python run_dev.py
   ```
   L'API sera disponible sur [http://localhost:8000](http://localhost:8000).

### Configuration du Frontend (Client)

1. Accédez au dossier client :
   ```bash
   cd client
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Démarrez le client :
   ```bash
   npm run dev
   ```
   L'application sera accessible sur [http://localhost:5173](http://localhost:5173).

## 🔑 Configuration Initiale (Admin)

Au premier démarrage, si aucun administrateur n'existe, vous serez redirigé vers une page de configuration pour créer les premiers comptes administrateurs.

Vous pouvez également utiliser le script CLI :
```bash
cd server
python src/create_admin_user.py --username admin --password votre_password --email admin@example.com
```

## 📖 Documentation

Pour plus de détails, consultez les guides suivants :
- [Guide de Déploiement Complet](docs/fr/Guide%20de%20déploiement.md)
- [Documentation de Conception](docs/fr/Conception/Conception.md)
- [Scénarios d'utilisation](docs/fr/Conception/Scenarios/README.md)

## 🏗️ Structure du Projet

- `/client` : Application frontend React/Vite.
- `/server` : API backend FastAPI.
- `/docs` : Documentation technique et fonctionnelle.

## 📄 Licence

Ce projet est sous licence [AGPL](LICENSE).
