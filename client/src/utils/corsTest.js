/**
 * Utilitaire pour tester la connexion CORS avec le serveur
 */

import { API_CONFIG } from '../constants';

export const testCorsConnection = async () => {
  console.log('🔄 Test de connexion CORS...');

  try {
    // Test 1: Health check
    console.log('1️⃣ Test du health check...');
    const healthResponse = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check réussi:', healthData);
    } else {
      console.error('❌ Health check échoué:', healthResponse.status);
      return false;
    }

    // Test 2: Test CORS spécifique
    console.log('2️⃣ Test de l\'endpoint CORS...');
    const corsResponse = await fetch(`${API_CONFIG.BASE_URL}/test-cors`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (corsResponse.ok) {
      const corsData = await corsResponse.json();
      console.log('✅ Test CORS réussi:', corsData);
    } else {
      console.error('❌ Test CORS échoué:', corsResponse.status);
      return false;
    }

    // Test 3: Test avec authentification (si token disponible)
    const token = localStorage.getItem('authToken');
    if (token) {
      console.log('3️⃣ Test avec authentification...');
      const authResponse = await fetch(`${API_CONFIG.BASE_URL}/setup/status`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (authResponse.ok) {
        console.log('✅ Test authentification réussi');
      } else {
        console.warn('⚠️ Test authentification échoué (normal si pas connecté)');
      }
    }

    console.log('🎉 Tous les tests CORS sont passés avec succès!');
    return true;

  } catch (error) {
    console.error('❌ Erreur lors des tests CORS:', error);

    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      console.error('💡 Solution: Vérifiez que le serveur backend est démarré sur le port 8000');
    }

    return false;
  }
};

export const logCorsDebugInfo = () => {
  console.group('🐛 Debug CORS');
  console.log('URL API configurée:', API_CONFIG.BASE_URL);
  console.log('Origin actuelle:', window.location.origin);
  console.log('Protocole:', window.location.protocol);
  console.log('Host:', window.location.host);
  console.log('Port:', window.location.port);

  // Vérifier si on est en développement
  const isDev = import.meta.env.DEV;
  console.log('Mode développement:', isDev);

  if (isDev) {
    console.log('💡 En développement, utilisez le proxy Vite ou vérifiez la config CORS du serveur');
  }

  console.groupEnd();
};
