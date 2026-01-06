/**
 * Service d'authentification centralisé
 */

import { api } from './api';
import { USER_TYPES, STORAGE_KEYS, API_CONFIG, ROUTES } from '../constants';

/**
 * Normalise le type d'utilisateur renvoyé par l'API
 */
export const normalizeUserType = (rawType) => {
  if (!rawType) return USER_TYPES.USER;
  const upper = String(rawType).toUpperCase();
  if (upper === 'ADMIN') return USER_TYPES.ADMIN;
  if (upper === 'MEMBER' || upper === 'MODERATOR') return USER_TYPES.MODERATOR;
  return USER_TYPES.USER;
};

/**
 * Stocke les informations d'authentification
 */
export const setAuthData = (token, userType, username) => {
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER_TYPE, userType);
    if (username) {
      localStorage.setItem(STORAGE_KEYS.USERNAME, username);
    }
    window.dispatchEvent(new Event('authChange'));
  } catch (error) {
    console.error('Erreur lors du stockage des données d\'authentification:', error);
  }
};

/**
 * Récupère les informations d'authentification
 */
export const getAuthData = () => {
  try {
    return {
      token: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
      userType: localStorage.getItem(STORAGE_KEYS.USER_TYPE) || USER_TYPES.USER,
      username: localStorage.getItem(STORAGE_KEYS.USERNAME),
    };
  } catch {
    return { token: null, userType: USER_TYPES.USER, username: null };
  }
};

/**
 * Vérifie si le token est expiré
 */
export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false; // Si pas d'exp, on considère qu'il n'expire pas (rare pour JWT)

    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error);
    return true; // En cas d'erreur de décodage, on considère le token comme invalide/expiré
  }
};

/**
 * Vérifie si l'utilisateur est authentifié et que son token est valide
 */
export const isAuthenticated = () => {
  const { token } = getAuthData();
  return !!token && !isTokenExpired(token);
};

/**
 * Supprime les informations d'authentification
 */
export const clearAuthData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_TYPE);
    localStorage.removeItem(STORAGE_KEYS.USERNAME);
    window.dispatchEvent(new Event('authChange'));
  } catch (error) {
    console.error('Erreur lors de la suppression des données d\'authentification:', error);
  }
};

/**
 * Connexion utilisateur
 */
export const login = async (username, password) => {
  const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, { username, password }, { skipAuth: true });

  const token = response?.data?.token
  const rawType = response?.data?.user?.account_type

  setAuthData(token, rawType, username);

  return { ...response, rawType };
};

/**
 * Inscription utilisateur
 */
export const register = async (username, email, password) => {
  return await api.post(API_CONFIG.ENDPOINTS.REGISTER, { username, email, password }, { skipAuth: true });
};

/**
 * Déconnexion utilisateur
 */
export const logout = () => {
  clearAuthData();
};

/**
 * Détermine la route de redirection selon le type d'utilisateur
 */
export const getRedirectPath = (userType) => {
  switch (userType) {
    case USER_TYPES.ADMIN:
      return ROUTES.ADMIN;
    case USER_TYPES.MODERATOR:
      return ROUTES.HOME;
    default:
      return ROUTES.HOME;
  }
};
