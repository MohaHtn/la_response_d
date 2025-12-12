import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, CircularProgress, Alert, Button } from '@mui/material';
import MarkdownRenderer from '../components/MarkdownRenderer';
import Header from '../components/Header';
import { API_CONFIG, STORAGE_KEYS, MESSAGES } from '../constants';
import { getCommonHeaders } from '../utils/http';
import { mapDocumentToBook } from '../utils/mappers';

import 'katex/dist/katex.min.css';

const styles = {
  root: {
    minHeight: '100vh',
    paddingTop: '64px',
    paddingBottom: '40px',
    backgroundColor: '#f5f5f5',
  },
  paper: {
    padding: '32px',
    marginTop: '24px',
  },
  title: {
    marginBottom: '24px',
    color: '#1976d2',
  },
  content: {
    '& img': {
      maxWidth: '100%',
      height: 'auto',
    },
    '& h1, & h2, & h3, & h4': {
      marginTop: '24px',
      marginBottom: '16px',
      color: '#333',
    },
    '& p': {
      marginBottom: '16px',
      lineHeight: 1.6,
    },
  },
};


function ReadBookPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper pour aligner la structure d'un document (détails) avec celle utilisée dans Home.jsx
  const mapDocumentToBook = (doc) => ({
    id: doc?.document_id,
    title: doc?.metadata?.title || 'Sans titre',
    author: doc?.metadata?.author || 'Auteur inconnu',
    status: doc?.moderation?.status || doc?.moderation?.approval_process?.status || 'unknown',
    preview: doc?.preview || '',
    uploadedAt: doc?.uploaded_at || doc?.uploader?.upload_date || null,
    coverImage: doc?.cover_image || null,
    // Champs spécifiques à la page de lecture
    content: doc?.markdown?.content || 'Aucun contenu disponible',
    uploader: doc?.uploader?.username || null,
    uploadDate: doc?.uploader?.upload_date || doc?.uploaded_at || null,
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const response = await fetch(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENT_DETAILS(bookId)}`,
          {
            headers: getCommonHeaders({ skipAuth: !token })
          }
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Livre non trouvé');
          }
          if (response.status === 401) {
            throw new Error(MESSAGES.UNAUTHORIZED);
          }
          if (response.status === 403) {
            throw new Error(MESSAGES.FORBIDDEN);
          }
          throw new Error(`Erreur lors du chargement du document: ${response.status}`);
        }

        const result = await response.json();

        // Appliquer le même mapping que dans Home.jsx (adapté au détail d'un document)
        const mapped = mapDocumentToBook(result.data);

        setBook(mapped);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <Box sx={styles.root}>
        <Header />
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={styles.root}>
        <Header />
        <Container>
          <Alert 
            severity="error" 
            sx={{ mt: 4 }}
            onClose={() => navigate('/')}
          >
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={styles.root}>
      <Header />
      <Container>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/home')}
            startIcon={<span>←</span>}
          >
            Retour à la bibliothèque
          </Button>
        </Box>
        <Paper sx={styles.paper}>
          <Typography variant="h4" component="h1" sx={styles.title}>
            {book?.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            par {book?.author}
          </Typography>
          {book?.uploader && (
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Uploadé par {book.uploader}
              {book.uploadDate && ` le ${new Date(book.uploadDate).toLocaleDateString('fr-FR')}`}
            </Typography>
          )}
          <Box sx={styles.content}>
            <MarkdownRenderer
              content={book?.content || 'Aucun contenu disponible'}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ReadBookPage;
