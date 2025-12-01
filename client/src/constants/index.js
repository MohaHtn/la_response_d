/**
 * Constantes et configurations de l'application
 */

// Types d'utilisateurs
export const USER_TYPES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN',
};

// Types d'alertes
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Routes de l'application
export const ROUTES = {
  HOME: '/home',
  AUTH: '/auth',
  PRESENTATION: '/',
  UPLOAD: '/upload',
  ADMIN: '/admin',
  ADMIN_QUARANTINE: '/admin/quarantine',
  BOOK: (id) => `/book/${id}`,
  MODERATION: (id) => `/moderation/${id}`,
};

// Clés de stockage local
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_TYPE: 'userType',
  USERNAME: 'username',
};

// Messages
export const MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGIN_ERROR: 'Erreur lors de la connexion',
  REGISTER_SUCCESS: 'Inscription réussie',
  REGISTER_ERROR: 'Erreur lors de l\'inscription',
  NETWORK_ERROR: 'Erreur réseau',
  SERVER_ERROR: 'Erreur serveur',
  UNAUTHORIZED: 'Non autorisé',
};

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  ENDPOINTS: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    BOOKS: '/api/books',
    ADMIN_STATS: '/api/admin/stats',
    ADMIN_QUARANTINE: '/api/admin/quarantine',
  },
};

