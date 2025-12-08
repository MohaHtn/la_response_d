import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/auth.service';
import { ROUTES, USER_TYPES } from '../constants';
import { testCorsConnection, logCorsDebugInfo } from '../utils/corsTest';

const headerStyles = {
  appBar: {
    backgroundColor: '#2196f3',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 1100,
  },
  toolbarContent: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  navButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#ffffff',
    color: 'black',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#c43b2d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    fontWeight: '500',
  },
  title: {
    fontWeight: 'bold',
  },
}

export default function Header() {
  const { isAuthenticated, userType } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTestCors = async () => {
    logCorsDebugInfo();
    const success = await testCorsConnection();
    if (success) {
      alert('✅ CORS fonctionne correctement! Vérifiez la console pour les détails.');
    } else {
      alert('❌ Erreur CORS détectée! Vérifiez la console et le guide CORS_TROUBLESHOOTING.md');
    }
  };

  const isDev = import.meta.env.DEV;

  return (
    <AppBar style={headerStyles.appBar}>
      <Toolbar>
        <div style={headerStyles.toolbarContent}>
          {/* Groupe gauche : titre + Upload (Upload après le titre) */}
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <Typography variant="h6" component="div" style={headerStyles.title}>
              La réponse D | Bibliothéko
            </Typography>
            {isAuthenticated && (
                <Link to={ROUTES.UPLOAD} style={{...headerStyles.navButton, backgroundColor: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.6)'}}>Envoyer un document</Link>
            )}
            {isAuthenticated && userType === USER_TYPES.ADMIN && (
                <Link to={ROUTES.ADMIN_QUARANTINE} style={{...headerStyles.navButton, backgroundColor: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.6)'}}>Quarantaine</Link>
            )}
            {isAuthenticated && (userType === USER_TYPES.ADMIN || userType === 'ADMIN') && (
                <Link to={ROUTES.ADMIN} style={{...headerStyles.navButton, backgroundColor: '#ff5722', color: '#ffffff', border: '1px solid rgba(255,255,255,0.8)', fontWeight: 'bold'}}>🔧 Admin</Link>
            )}
            {isDev && (
                <button onClick={handleTestCors} style={{...headerStyles.navButton, backgroundColor: '#ff9800', color: '#fff', border: 'none', fontSize: '12px'}}>Test CORS</button>
            )}
          </div>

          {/* Groupe droit : Se connecter */}
          <div>
            {isAuthenticated ? (
              <button onClick={handleLogout} style={headerStyles.logoutButton}>
                Se déconnecter
              </button>
            ) : (
              <Link to={ROUTES.AUTH} style={headerStyles.navButton}>Se connecter</Link>
            )}
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}
