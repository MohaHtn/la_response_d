// Exemple minimal d’appel API côté Node pour démonstration
// Lit la variable VITE_API_BASE_URL depuis le fichier .env du client

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function loadEnvVar(name) {
  // Recherche un .env dans le dossier client
  const envPath = path.resolve(__dirname, '../../../.env');
  let value = process.env[name];
  if (value) return value;
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && m[1] === name) {
        value = m[2].replace(/^"|"$/g, '');
        break;
      }
    }
  }
  return value;
}

const baseUrl = loadEnvVar('VITE_API_BASE_URL') || 'http://localhost:8000';
const url = `${baseUrl.replace(/\/$/, '')}/health`;

console.log('Appel de:', url);

const client = url.startsWith('https') ? https : http;
client
  .get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log('Statut:', res.statusCode);
      console.log('Corps:', data);
    });
  })
  .on('error', (err) => {
    console.error('Erreur de requête:', err.message);
  });
