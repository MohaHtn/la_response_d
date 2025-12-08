import { api } from './api';
import { API_CONFIG } from '../constants';

export const getSetupStatus = async () => {
  return await api.get(API_CONFIG.ENDPOINTS.SETUP_STATUS, { skipAuth: true });
};

export const createAdmins = async (admins) => {
  return await api.post(API_CONFIG.ENDPOINTS.SETUP_ADMINS, admins, { skipAuth: true });
};
