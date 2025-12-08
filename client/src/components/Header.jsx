import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { logout } from '../services/auth.service';

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

  return (
    <AppBar style={headerStyles.appBar}>
      <Toolbar>
        <div style={headerStyles.toolbarContent}>
          {/* Groupe gauche : titre + Navigation */}
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <Link to={isAuthenticated ? "/home" : "/"} style={{textDecoration: 'none', color: 'white'}}>
              <Typography variant="h6" component="div" style={headerStyles.title}>
                La réponse D | Bibliothéko
              </Typography>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/home"
                  style={{
                    ...headerStyles.navButton,
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.6)'
                  }}
                >
                  📚 Bibliothèque
                </Link>
                <Link
                  to="/upload"
                  style={{
                    ...headerStyles.navButton,
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.6)'
                  }}
                >
                  📤 Upload
                </Link>
                {userType === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin"
                      style={{
                        ...headerStyles.navButton,
                        backgroundColor: 'transparent',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.6)'
                      }}
                    >
                      👨‍💼 Admin
                    </Link>
                    <Link
                      to="/admin/quarantine"
                      style={{
                        ...headerStyles.navButton,
                        backgroundColor: 'transparent',
                        color: '#ffffff',
                        border: '1px solid rgba(255,255,255,0.6)'
                      }}
                    >
                      🔒 Quarantaine
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Groupe droit : Authentification */}
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

