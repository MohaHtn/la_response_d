import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import {Link} from "react-router-dom";

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
  title: {
    fontWeight: 'bold',
  },
}

export default function Header() {
  return (
    <AppBar style={headerStyles.appBar}>
      <Toolbar>
        <div style={headerStyles.toolbarContent}>
          {/* Groupe gauche : titre + Upload (Upload après le titre) */}
          <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
            <Typography variant="h6" component="div" style={headerStyles.title}>
              La réponse D | Bibliothéko
            </Typography>
            <Link to="/page4" style={{...headerStyles.navButton, backgroundColor: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.6)'}}>Upload</Link>
          </div>

          {/* Groupe droit : Se connecter */}
          <div>
            <Link to="/page2" style={headerStyles.navButton}>Se connecter</Link>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}
