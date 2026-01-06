import React, { useEffect } from 'react';
import { Typography, Paper, Container, Box } from '@mui/material';
import Header from './components/Header';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getSetupStatus } from './services/setup.service';
import { ROUTES } from './constants';

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
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const status = await getSetupStatus();
        if (status && status.needs_setup) {
          navigate(ROUTES.SETUP);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du setup:', error);
      }
    };
    checkSetup();
  }, [navigate]);
  return (
    <Box sx={styles.root}>
      <Header />
      <Container maxWidth="lg">
        <Paper sx={styles.paper} elevation={3}>
          <Typography variant="h3" component="h1" sx={styles.title}>
            {t('presentation.title')}
          </Typography>
          
          <Box sx={styles.section}>
            <Typography variant="h5" sx={styles.subtitle}>
              {t('presentation.about')}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
              {t('presentation.aboutText')}
            </Typography>
          </Box>

          <Box sx={styles.section}>
            <Typography variant="h5" sx={styles.subtitle}>
              {t('presentation.features')}
            </Typography>
            <Box sx={{ marginLeft: '16px' }}>
              <Typography sx={styles.feature}>
                {t('presentation.featureList.consult')}
              </Typography>
              <Typography sx={styles.feature}>
                {t('presentation.featureList.ocr')}
              </Typography>
              <Typography sx={styles.feature}>
                {t('presentation.featureList.edit')}
              </Typography>
              <Typography sx={styles.feature}>
                {t('presentation.featureList.rights')}
              </Typography>
            </Box>
          </Box>



          <Box sx={styles.section}>
            <Typography variant="h5" sx={styles.subtitle}>
              {t('presentation.gettingStarted')}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
              {t('presentation.gettingStartedText')}
            </Typography>

          </Box>
        </Paper>

        <Paper sx={styles.paper} elevation={3}>
          <Typography variant="h5" sx={styles.subtitle}>
            {t('presentation.why')}
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '1rem' }}>
            {t('presentation.whyText')}
          </Typography>
          <Box sx={{ marginLeft: '16px' }}>
            <Typography sx={styles.feature}>
              {t('presentation.whyList.ui')}
            </Typography>
            <Typography sx={styles.feature}>
              {t('presentation.whyList.collab')}
            </Typography>
            <Typography sx={styles.feature}>
              {t('presentation.whyList.responsive')}
            </Typography>
            <Typography sx={styles.feature}>
              {t('presentation.whyList.security')}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Presentation;
