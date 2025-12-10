/**
 * Service dédié à la modération/quarantaine
 */
import { api, apiRequest } from './api';
import { API_CONFIG } from '../constants';

const unwrap = (resp) => (resp && Object.prototype.hasOwnProperty.call(resp, 'data') ? resp.data : resp);

export const moderationService = {
  // Listes
  async getQuarantineList() {
    const resp = await api.get(API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE);
    return unwrap(resp);
  },
  async getPendingList() {
    const resp = await api.get(API_CONFIG.ENDPOINTS.MODERATION_PENDING);
    return unwrap(resp);
  },

  // Détails d'un document en quarantaine
  async getQuarantineDocument(id) {
    const resp = await api.get(API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_DOCUMENT(id));
    return unwrap(resp);
  },

  // Actions modération quarantaine
  async validateQuarantine(id) {
    const resp = await apiRequest(API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_VALIDATE(id), { method: 'POST' });
    return unwrap(resp);
  },
  async publishQuarantine(id) {
    const resp = await apiRequest(API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_PUBLISH(id), { method: 'POST' });
    return unwrap(resp);
  },
  async updateQuarantine(id, updates) {
    const resp = await api.patch(API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_UPDATE(id), updates);
    return unwrap(resp);
  },
  async moderateQuarantine(id, action) {
    const endpoint = `${API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_MODERATE(id)}?action=${encodeURIComponent(action)}`;
    const resp = await apiRequest(endpoint, { method: 'POST' });
    return unwrap(resp);
  },
};
