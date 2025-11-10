import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Button,
  Divider,
  Alert,
  TextField,
  Stack
} from '@mui/material';
import Header from '../components/Header';
import ModeratorValidationTable from '../components/ModeratorValidationTable';
import { useParams } from 'react-router-dom';

// Données d'exemple (à remplacer par un appel API)
const MOCK_BOOK_DATA = {
  id: 'book123',
  title: 'Les Misérables',
  author: 'Victor Hugo',
  submissionDate: '2025-11-10',
  pages: 1488,
  status: 'en_cours', // en_cours, validé, rejeté
  ocrQuality: 95,
  format: 'PDF',
  language: 'Français',
  submittedBy: 'Alexandre Dupont',
  issues: [
    { type: 'ocr', page: 45, description: 'Texte flou sur le côté droit' },
    { type: 'metadata', description: 'Date de publication manquante' }
  ]
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
  section: {
    marginBottom: '24px',
  },
  tabContent: {
    padding: '20px',
  },
  actionButton: {
    minWidth: '150px',
  },
  issueItem: {
    padding: '12px',
    marginBottom: '8px',
    backgroundColor: '#fff3e0',
    borderRadius: '4px',
  }
};

function ModerationPage() {
  const { bookId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [moderationData, setModerationData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // En production, remplacer par de vrais appels API avec bookId
        if (!bookId) {
          throw new Error('ID du livre manquant');
        }

        setBookData({ ...MOCK_BOOK_DATA, id: bookId });
        setModerationData(MOCK_MODERATION_DATA);
        setError(null);
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des données de modération');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookId]);  // Dépendance sur bookId

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleApprove = () => {
    // TODO: Implémenter la validation
    console.log('Approuver avec commentaire:', comment);
  };

  const handleReject = () => {
    // TODO: Implémenter le rejet
    console.log('Rejeter avec commentaire:', comment);
  };

  if (isLoading) {
    return (
      <Box sx={styles.root}>
        <Header />
        <Container maxWidth="lg">
          <Typography>Chargement...</Typography>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={styles.root}>
        <Header />
        <Container maxWidth="lg">
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

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

        {bookData && (
          <>
            <Paper sx={styles.section}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Informations générales" />
                <Tab label="Validation" />
                <Tab label="Problèmes détectés" />
              </Tabs>

              <Box sx={styles.tabContent}>
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Détails du livre</Typography>
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
                      <Box sx={styles.infoItem}>
                        <Typography variant="subtitle2">Nombre de pages</Typography>
                        <Typography>{bookData.pages}</Typography>
                      </Box>
                      <Box sx={styles.infoItem}>
                        <Typography variant="subtitle2">Qualité OCR</Typography>
                        <Typography>{bookData.ocrQuality}%</Typography>
                      </Box>
                      <Box sx={styles.infoItem}>
                        <Typography variant="subtitle2">Format</Typography>
                        <Typography>{bookData.format}</Typography>
                      </Box>
                      <Box sx={styles.infoItem}>
                        <Typography variant="subtitle2">Langue</Typography>
                        <Typography>{bookData.language}</Typography>
                      </Box>
                      <Box sx={styles.infoItem}>
                        <Typography variant="subtitle2">Soumis par</Typography>
                        <Typography>{bookData.submittedBy}</Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>État de la validation</Typography>
                    <ModeratorValidationTable
                      bookData={bookData}
                      moderationData={moderationData}
                      isLoading={false}
                      error={null}
                    />
                    <Divider sx={{ my: 3 }} />
                    <Typography variant="h6" gutterBottom>Action de modération</Typography>
                    <Stack spacing={2}>
                      <TextField
                        multiline
                        rows={4}
                        fullWidth
                        label="Commentaire de modération"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          sx={styles.actionButton}
                          onClick={handleApprove}
                        >
                          Approuver
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          sx={styles.actionButton}
                          onClick={handleReject}
                        >
                          Rejeter
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    <Typography variant="h6" gutterBottom>Problèmes détectés</Typography>
                    {bookData.issues.map((issue, index) => (
                      <Paper key={index} sx={styles.issueItem}>
                        <Typography variant="subtitle2" color="error">
                          {issue.type === 'ocr' ? 'Problème OCR' : 'Problème de métadonnées'}
                        </Typography>
                        {issue.page && (
                          <Typography variant="body2">Page: {issue.page}</Typography>
                        )}
                        <Typography>{issue.description}</Typography>
                      </Paper>
                    ))}
                    {bookData.issues.length === 0 && (
                      <Alert severity="success">
                        Aucun problème détecté
                      </Alert>
                    )}
                  </Box>
                )}
              </Box>
            </Paper>
          </>
        )}
      </Container>
    </Box>
  );
}

export default ModerationPage;
