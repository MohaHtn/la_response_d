/**
 * Styles réutilisables pour l'application
 */

export const colors = {
  primary: '#2196f3',
  secondary: '#4caf50',
  error: '#f44336',
  warning: '#ff9800',
  success: '#4caf50',
  background: '#f5f5f5',
  white: '#ffffff',
  textPrimary: '#333',
  textSecondary: '#666',
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const button = {
  base: {
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    fontWeight: '500',
  },
  primary: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.white,
  },
  danger: {
    backgroundColor: colors.error,
    color: colors.white,
  },
  disabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
};

export const input = {
  base: {
    padding: '10px 12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
};

export const container = {
  base: {
    width: '100%',
    padding: spacing.xl,
    boxSizing: 'border-box',
    margin: 0,
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const card = {
  base: {
    backgroundColor: colors.white,
    borderRadius: '8px',
    padding: spacing.lg,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
};

export const alert = {
  success: {
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: '#d4edda',
    color: '#155724',
    marginBottom: '10px',
  },
  error: {
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    marginBottom: '10px',
  },
  warning: {
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: '#fff3cd',
    color: '#856404',
    marginBottom: '10px',
  },
  info: {
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: '#d1ecf1',
    color: '#0c5460',
    marginBottom: '10px',
  },
};

