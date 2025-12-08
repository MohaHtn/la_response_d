/**
 * Hook personnalisé pour gérer l'authentification
 */

import { useState, useEffect } from 'react';
import { getAuthData, isAuthenticated as checkAuth } from '../services/auth.service';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('USER');
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const updateAuth = () => {
      const { token, userType: type, username: user } = getAuthData();
      console.log('🔍 useAuth - getAuthData result:', { token: !!token, userType: type, username: user });
      setIsAuthenticated(!!token);
      setUserType(type);
      setUsername(user);
    };

    updateAuth();

    // Écouter les changements d'authentification
    window.addEventListener('authChange', updateAuth);

    return () => {
      window.removeEventListener('authChange', updateAuth);
    };
  }, []);

  return {
    isAuthenticated,
    userType,
    username,
    checkAuth,
  };
};

