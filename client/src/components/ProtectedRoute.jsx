/**
 * Composant pour protéger les routes selon le type d'utilisateur
 */

import { Navigate } from 'react-router-dom';
import { getAuthData } from '../services/auth.service';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, userType } = getAuthData();

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['ADMIN']}>
    {children}
  </ProtectedRoute>
);

export const ModeratorRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['MODERATOR', 'ADMIN']}>
    {children}
  </ProtectedRoute>
);

