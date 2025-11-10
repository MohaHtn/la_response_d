import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import Header from '../components/Header';
import ModeratorValidationTable from '../components/ModeratorValidationTable';

// Données d'exemple (à remplacer par un appel API)
const MOCK_BOOK_DATA = {
  id: 'book123',
  title: 'Les Misérables',
  author: 'Victor Hugo',
  submissionDate: '2025-11-10',
};

const MOCK_MODERATION_DATA = [
  {
    moderatorId: 'mod1',
    moderatorName: 'Jean Martin',
    role: 'Modérateur Principal',
    status: 'approved',
    date: '2025-11-09',
    comment: 'Contenu vérifié et conforme',
  },
  {
    moderatorId: 'mod2',
    moderatorName: 'Marie Dubois',
    role: 'Vérificateur OCR',
    status: 'pending',
    date: null,
    comment: null,
  },
  {
    moderatorId: 'mod3',
    moderatorName: 'Pierre Durand',
    role: 'Expert Copyright',
    status: 'approved',
    date: '2025-11-08',
    comment: 'Droits d\'auteur vérifiés',
  },
];

const styles = {
  root: {
    minHeight: '100vh',
    paddingTop: '64px',
    paddingBottom: '40px',
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: '24px',
  },
  bookInfo: {
    padding: '20px',
    marginBottom: '24px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  },
  infoItem: {
    '& > h6': {
      color: '#666',
      marginBottom: '4px',
    },
  },
};

function ModerationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [moderationData, setModerationData] = useState(null);

  useEffect(() => {
    // Simuler un chargement de données
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simule un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // En production, remplacer par de vrais appels API
        setBookData(MOCK_BOOK_DATA);
        setModerationData(MOCK_MODERATION_DATA);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des données de modération');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // À exécuter une seule fois au montage

  return (
    <Box sx={styles.root}>
      <Header />
      <Container maxWidth="lg">
        <Box sx={styles.header}>
          <Typography variant="h4" component="h1">
            Modération du livre
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Suivi du processus de validation
          </Typography>
        </Box>

        {!isLoading && !error && bookData && (
          <Paper sx={styles.bookInfo}>
            <Typography variant="h6" component="h2">
              Informations sur le livre
            </Typography>
            <Box sx={styles.infoGrid}>
              <Box sx={styles.infoItem}>
                <Typography variant="subtitle2">Titre</Typography>
                <Typography>{bookData.title}</Typography>
              </Box>
              <Box sx={styles.infoItem}>
                <Typography variant="subtitle2">Auteur</Typography>
                <Typography>{bookData.author}</Typography>
              </Box>
              <Box sx={styles.infoItem}>
                <Typography variant="subtitle2">Date de soumission</Typography>
                <Typography>
                  {new Date(bookData.submissionDate).toLocaleDateString('fr-FR')}
                </Typography>
              </Box>
            </Box>
          </Paper>
        )}

        <ModeratorValidationTable
          bookData={bookData}
          moderationData={moderationData}
          isLoading={isLoading}
          error={error}
        />
      </Container>
    </Box>
  );
}

export default ModerationPage;
