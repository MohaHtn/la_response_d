/**
 * Service API centralisé pour toutes les requêtes HTTP
 */

import { API_CONFIG, STORAGE_KEYS, ROUTES } from '../constants';

const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Gère les erreurs API de manière cohérente
 */
const handleApiError = async (response) => {
  // Gestion spécifique 401: token invalide/expiré -> retour à la présentation
  if (response.status === 401) {
    try {
      // Nettoyage minimal local
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
      localStorage.removeItem(STORAGE_KEYS.USERNAME);
      window.dispatchEvent(new Event('authChange'));
    } catch {}
    // Rediriger vers la page de présentation
    if (typeof window !== 'undefined') {
      window.location.replace(ROUTES.PRESENTATION);
    }
  }
  const payload = await response.json().catch(() => null);
  const message =
    (payload && (payload.error || payload.detail || payload.message)) ||
    response.statusText ||
    'Erreur serveur';
  throw new Error(message);
};

/**
 * Effectue une requête API avec gestion des erreurs
 */
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const requestOptions = {
      mode: 'cors',
      credentials: 'include',
      ...options,
      headers,
    };

    // Ajouter un timeout
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout de la requête')), API_CONFIG.TIMEOUT || 30000)
    );

    const fetchPromise = fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      // Gestion spéciale pour les erreurs CORS
      if (response.status === 0) {
        throw new Error('Erreur CORS: Impossible de contacter le serveur. Vérifiez que le serveur backend est démarré.');
      }
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
    // Amélioration des messages d'erreur
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Erreur réseau: Impossible de contacter le serveur. Vérifiez votre connexion et que le serveur backend est démarré.');
    }
    throw new Error(error?.message || 'Erreur réseau');
  }
};

/**
 * Méthodes HTTP simplifiées
 */
export const api = {
  get: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),

  post: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  patch: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};
