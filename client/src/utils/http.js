// Common HTTP helpers for API requests
import i18n from '../i18n';
import { STORAGE_KEYS } from '../constants';

/**
 * Build common headers with Accept-Language and optional Authorization.
 * @param {Object} options
 * @param {boolean} [options.skipAuth=false] - do not include Authorization header
 * @param {Object} [options.extraHeaders] - additional headers to merge
 * @returns {Record<string,string>}
 */
export function getCommonHeaders({ skipAuth = false, extraHeaders = {} } = {}) {
  const lang = (i18n?.language || localStorage.getItem('i18nextLng') || 'en').split('-')[0];
  const headers = {
    'Accept-Language': lang,
    ...extraHeaders,
  };

  if (!skipAuth) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}
