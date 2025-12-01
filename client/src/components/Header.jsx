import React, { useState, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {Link, useNavigate} from "react-router-dom";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('USER');
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier si un token valide existe dans localStorage
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
        const t = localStorage.getItem('userType') || 'USER';
        setUserType(t);
      } catch {
        setIsAuthenticated(false);
        setUserType('USER');
      }
    };

    checkAuth();

    // Écouter l'événement personnalisé pour les changements d'authentification
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userType');
      setIsAuthenticated(false);
      setUserType('USER');
      // Notifier le changement d'authentification
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

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
                <Link to="/upload" style={{...headerStyles.navButton, backgroundColor: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.6)'}}>Envoyer un document</Link>
            )}
            {isAuthenticated && userType === 'ADMIN' && (
                <Link to="/admin/quarantine" style={{...headerStyles.navButton, backgroundColor: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.6)'}}>Quarantaine</Link>
            )}
          </div>

          {/* Groupe droit : Se connecter */}
          <div>
            {isAuthenticated ? (
              <button onClick={handleLogout} style={headerStyles.logoutButton}>
                Se déconnecter
              </button>
            ) : (
              <Link to="/auth" style={headerStyles.navButton}>Se connecter</Link>
            )}
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

