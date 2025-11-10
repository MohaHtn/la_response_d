import React from 'react';
import { Typography, Paper, Container, Box } from '@mui/material';
import Header from './components/Header';

const styles = {
  root: {
    minHeight: '100vh',
    paddingTop: '64px',
    paddingBottom: '40px',
    backgroundColor: '#f5f5f5'
  },
  paper: {
    padding: '32px',
    marginBottom: '24px'
  },
  section: {
    marginBottom: '32px'
  },
  title: {
    marginBottom: '24px',
    color: '#1976d2',
    fontWeight: 'bold'
  },
  subtitle: {
    marginBottom: '16px',
    color: '#333'
  },
  feature: {
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  docsButton: {
    marginTop: '16px'
  },
  docLink: {
    textDecoration: 'none',
    color: '#1976d2',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
};

function Presentation() {
  return (
    <Box sx={styles.root}>
      <Header />
      <Container maxWidth="lg">
        <Paper sx={styles.paper} elevation={3}>
          <Typography variant="h3" component="h1" sx={styles.title}>
            Bibliothéko - Votre bibliothèque numérique collaborative
          </Typography>
          
          <Box sx={styles.section}>
            <Typography variant="h5" sx={styles.subtitle}>
              À propos du projet
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
              Bibliothéko est une plateforme innovante qui permet la numérisation, le partage et la consultation
              d'œuvres littéraires dans le respect du droit d'auteur. Notre objectif est de faciliter l'accès 
              à la connaissance tout en préservant notre patrimoine littéraire.
            </Typography>
          </Box>

          <Box sx={styles.section}>
            <Typography variant="h5" sx={styles.subtitle}>
              Fonctionnalités principales
            </Typography>
            <Box sx={{ marginLeft: '16px' }}>
              <Typography sx={styles.feature}>
                📚 Consultation d'œuvres numérisées
              </Typography>
              <Typography sx={styles.feature}>
                🔍 Reconnaissance de texte (OCR) avancée
              </Typography>
              <Typography sx={styles.feature}>
                📝 Édition collaborative de contenus
              </Typography>
              <Typography sx={styles.feature}>
                🔐 Gestion des droits d'accès et modération
              </Typography>
            </Box>
          </Box>



          <Box sx={styles.section}>
            <Typography variant="h5" sx={styles.subtitle}>
              Commencer à utiliser Bibliothéko
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
              Pour profiter pleinement de toutes les fonctionnalités, créez un compte ou connectez-vous :
            </Typography>

          </Box>
        </Paper>

        <Paper sx={styles.paper} elevation={3}>
          <Typography variant="h5" sx={styles.subtitle}>
            Pourquoi utiliser Bibliothéko ?
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
            Notre plateforme offre une approche unique pour la préservation et le partage du savoir :
          </Typography>
          <Box sx={{ marginLeft: '16px' }}>
            <Typography sx={styles.feature}>
              ✨ Interface moderne et intuitive
            </Typography>
            <Typography sx={styles.feature}>
              🤝 Collaboration entre membres
            </Typography>
            <Typography sx={styles.feature}>
              📱 Accessible sur tous les appareils
            </Typography>
            <Typography sx={styles.feature}>
              🔒 Sécurité et respect des droits d'auteur
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Presentation;
