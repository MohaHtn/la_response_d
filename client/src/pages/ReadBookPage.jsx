import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Header from '../components/Header';

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

// Exemple de données mockées - à remplacer par un appel API
const MOCK_BOOKS = {
  'b1': {
    title: "Les Misérables",
    author: "Victor Hugo",
    content: `# Les Misérables

## Chapitre 1

En 1815, M. Charles-François-Bienvenu Myriel était évêque de Digne...`
  },
  'b2': {
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    content: `# Le Petit Prince

## Chapitre 1

Lorsque j'avais six ans j'ai vu, une fois, une magnifique image...`
  }
};

function ReadBookPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        // Simuler un appel API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const bookData = MOCK_BOOKS[bookId];
        if (!bookData) {
          throw new Error('Livre non trouvé');
        }
        
        setBook(bookData);
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
        <Paper sx={styles.paper}>
          <Typography variant="h4" component="h1" sx={styles.title}>
            {book?.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            par {book?.author}
          </Typography>
          <Box sx={styles.content}>
            <ReactMarkdown
              children={book?.content || ''}
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ReadBookPage;
