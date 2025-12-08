#!/bin/bash

# Script pour démarrer le serveur de développement avec la configuration CORS

echo "🚀 Démarrage de l'application Bibliothéko en mode développement..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f ".env" ]; then
    echo "⚙️  Création du fichier .env..."
    cp .env.example .env
fi

# Afficher les informations de configuration
echo "📋 Configuration:"
echo "   - URL API: ${VITE_API_URL:-http://localhost:8000}"
echo "   - Mode: développement"
echo "   - Port client: 5173"

echo ""
echo "🔧 Assurez-vous que le serveur FastAPI backend est démarré sur le port 8000"
echo ""

# Démarrer le serveur de développement
echo "🌐 Démarrage du serveur de développement..."
npm run dev
