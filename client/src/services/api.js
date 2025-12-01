/**
 * Service API centralisé pour toutes les requêtes HTTP
 */

import { API_CONFIG, STORAGE_KEYS } from '../constants';

const API_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Gère les erreurs API de manière cohérente
 */
const handleApiError = async (response) => {
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
      ...options.headers,
    };

    if (token && !options.skipAuth) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    return await response.json();
  } catch (error) {
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

  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};
