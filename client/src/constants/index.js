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
  // Pages principales
  PRESENTATION: '/',
  HOME: '/home',
  AUTH: '/auth',
  UPLOAD: '/upload',

  // Pages de lecture et visualisation
  BOOK: (id) => `/book/${id}`,

  // Pages de modération
  MODERATION: (id) => `/moderation/${id}`,
  MODERATOR_PAGE: '/moderator',

  // Pages d'administration
  ADMIN: '/admin',
  ADMIN_QUARANTINE: '/admin/quarantine',
  QUARANTINE_PAGE: '/quarantine',

  // Configuration
  SETUP: '/setup',
};

// Clés de stockage local
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_TYPE: 'userType',
  USERNAME: 'username',
};

// Statuts des documents
export const DOCUMENT_STATUS = {
  WAITING: 'WAITING',
  OK: 'OK',
  REJECTED: 'REJECTED',
  IN_QUARANTINE: 'IN_QUARANTINE',
};

// Actions de modération
export const MODERATION_ACTIONS = {
  APPROVE: 'approve',
  REJECT: 'reject',
};

// Taille maximale des fichiers (en bytes)
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_TYPES: ['application/pdf'],
};

// Configuration de la pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// Messages
export const MESSAGES = {
  // Authentification
  LOGIN_SUCCESS: 'Connexion réussie',
  LOGIN_ERROR: 'Erreur lors de la connexion',
  REGISTER_SUCCESS: 'Inscription réussie',
  REGISTER_ERROR: 'Erreur lors de l\'inscription',

  // Upload et documents
  UPLOAD_SUCCESS: 'Document uploadé avec succès',
  UPLOAD_ERROR: 'Erreur lors de l\'upload',
  DOCUMENT_PROCESSING: 'Traitement du document en cours...',

  // Modération
  MODERATION_APPROVED: 'Document approuvé',
  MODERATION_REJECTED: 'Document rejeté',
  MODERATION_ERROR: 'Erreur lors de la modération',
  QUARANTINE_DOCUMENT_FOUND: 'Document en quarantaine trouvé',

  // Setup
  SETUP_REQUIRED: 'Configuration initiale requise',
  ADMIN_CREATED: 'Administrateur créé avec succès',
  SETUP_COMPLETE: 'Configuration terminée',

  // Erreurs générales
  NETWORK_ERROR: 'Erreur réseau',
  SERVER_ERROR: 'Erreur serveur',
  UNAUTHORIZED: 'Non autorisé',
  FORBIDDEN: 'Accès interdit',
  NOT_FOUND: 'Ressource non trouvée',
};

// Configuration de l'API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  TIMEOUT: 30000,
  ENDPOINTS: {
    // Health & Root
    HEALTH: '/health',
    ROOT: '/',

    // Authentication
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',

    // Documents
    DOCUMENTS_UPLOAD: '/documents/upload',
    DOCUMENTS_LIST: '/documents/',
    DOCUMENT_DETAILS: (id) => `/documents/${id}`,

    // Moderation
    MODERATION_QUARANTINE: '/moderation/quarantine',
    MODERATION_QUARANTINE_DOCUMENT: (id) => `/moderation/quarantine/${id}`,
    MODERATION_QUARANTINE_APPROVE: (id) => `/moderation/quarantine/${id}/approve`,
    MODERATION_QUARANTINE_REJECT: (id) => `/moderation/quarantine/${id}/reject`,
    MODERATION_QUARANTINE_MODERATE: (id) => `/moderation/quarantine/${id}/moderate`,
    MODERATION_PENDING: '/moderation/pending',
    MODERATION_APPROVE: (id) => `/moderation/${id}/approve`,
    MODERATION_REJECT: (id) => `/moderation/${id}/reject`,

    // Setup (Configuration initiale)
    SETUP_STATUS: '/setup/status',
    SETUP_ADMINS: '/setup/admins',
  },
};

