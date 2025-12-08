/**
 * Composant pour protéger les routes selon le type d'utilisateur
 */

import { Navigate } from 'react-router-dom';
import { getAuthData } from '../services/auth.service';
import { ROUTES, USER_TYPES } from '../constants';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, userType } = getAuthData();

  if (!token) {
    return <Navigate to={ROUTES.AUTH} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[USER_TYPES.ADMIN]}>
    {children}
  </ProtectedRoute>
);

export const ModeratorRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={[USER_TYPES.MODERATOR, USER_TYPES.ADMIN]}>
    {children}
  </ProtectedRoute>
);

