import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
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
          <Typography variant="h6" component="div" style={headerStyles.title}>
            La réponse D | Bibliothéko
          </Typography>
          <div>
            <Link to="/auth" style={headerStyles.navButton}>Se connecter</Link>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

