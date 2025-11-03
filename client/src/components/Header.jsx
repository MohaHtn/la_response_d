import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

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
            <Button color="inherit">Se connecter</Button>
          </div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

