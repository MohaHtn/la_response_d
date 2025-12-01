import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ModeratorValidationTable from '../components/ModeratorValidationTable';
import Header from '../components/Header';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Chip,
    CircularProgress,
    Alert,
    Divider,
} from '@mui/material';

const styles = {
    root: {
        minHeight: '100vh',
        paddingTop: '80px',
        paddingBottom: '40px',
        backgroundColor: '#f5f5f5',
    },
    paper: {
        padding: '24px',
        marginBottom: '24px',
    },
    section: {
        marginBottom: '24px',
    },
    splitContainer: {
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start',
    },
    leftColumn: {
        flex: '0 0 40%',
        maxWidth: '40%',
    },
    rightColumn: {
        flex: '1',
        position: 'sticky',
        top: '90px',
        maxHeight: 'calc(100vh - 110px)',
        overflowY: 'auto',
    },
    markdownContent: {
        padding: '32px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        '& h1': {
            fontSize: '2em',
            fontWeight: 'bold',
            marginTop: '0.5em',
            marginBottom: '0.5em',
            color: '#333',
        },
        '& h2': {
            fontSize: '1.5em',
            fontWeight: 'bold',
            marginTop: '1em',
            marginBottom: '0.5em',
            color: '#444',
        },
        '& p': {
            lineHeight: '1.6',
            marginBottom: '1em',
        },
        '& code': {
            backgroundColor: '#f5f5f5',
            padding: '2px 6px',
            borderRadius: '3px',
            fontFamily: 'monospace',
        },
    },
};

function ModeratorPage() {
    const { bookId } = useParams();
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log('ModeratorPage rendered - bookId:', bookId);

    useEffect(() => {
        // Charger les données du livre depuis l'API
        const fetchBookData = async () => {
            console.log('Fetching book data for:', bookId);
            try {
                setLoading(true);
                const url = `http://localhost:8000/api/documents/${bookId}`;
                console.log('Fetching from URL:', url);
                const response = await fetch(url);
                console.log('Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: Impossible de charger les données du livre`);
                }

                const data = await response.json();
                console.log('Received data:', data);

                // Transformer les données de l'API pour correspondre à l'interface
                const transformedData = {
                    id: data.document_id || bookId,
                    title: data.metadata?.title || 'Titre non défini',
                    author: data.metadata?.author || 'Auteur non défini',
                    submittedBy: data.uploader?.username || 'Utilisateur inconnu',
                    submissionDate: data.uploader?.upload_date || new Date().toISOString(),
                    status: data.moderation?.approval_process?.status || 'WAITING',
                    description: data.metadata?.description || '',
                    publisher: data.metadata?.publisher || '',
                    date: data.metadata?.parution_date || '',
                    totalPages: data.processing_info?.total_pages || 0,
                    markdownContent: data.markdown?.content || '# Contenu non disponible\n\nLe contenu du document n\'a pas pu être chargé.',
                };

                console.log('Transformed data:', transformedData);
                setBookData(transformedData);
                setError(null);
            } catch (err) {
                console.error('Erreur lors du chargement du livre:', err);
                setError(err.message);

                // Données de secours pour continuer à afficher la page
                const fallbackData = {
                    id: bookId,
                    title: 'Livre en modération',
                    author: 'Auteur inconnu',
                    submittedBy: 'Utilisateur',
                    submissionDate: new Date().toISOString(),
                    status: 'WAITING',
                    description: 'Erreur lors du chargement des données...',
                    publisher: '',
                    date: '',
                    totalPages: 0,
                };
                console.log('Using fallback data:', fallbackData);
                setBookData(fallbackData);
            } finally {
                setLoading(false);
                console.log('Loading finished');
            }
        };

        if (bookId) {
            fetchBookData();
        } else {
            console.error('No bookId provided!');
            setLoading(false);
        }
    }, [bookId]);

    console.log('Current state - loading:', loading, 'bookData:', bookData, 'error:', error);

    if (loading) {
        console.log('Rendering loading state');
        return (
            <Box sx={styles.root}>
                <Header />
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress />
                        <Typography sx={{ marginLeft: 2 }}>Chargement des données du livre...</Typography>
                    </Box>
                </Container>
            </Box>
        );
    }

    console.log('Rendering main content');

    return (
        <Box sx={styles.root}>
            <Header />
            <Container maxWidth="xl">
                {/* En-tête de la page */}
                <Box sx={styles.section}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Modération du livre
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Validez ou rejetez ce livre en tant que modérateur
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="warning" sx={{ marginBottom: 2 }}>
                        Attention: {error}
                    </Alert>
                )}

                {/* Layout en deux colonnes */}
                {bookData && (
                    <Box sx={styles.splitContainer}>
                        {/* Colonne gauche : Modération */}
                        <Box sx={styles.leftColumn}>
                            {/* Informations du livre */}
                            <Paper sx={styles.paper}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Informations du livre
                                </Typography>
                                <Divider sx={{ marginBottom: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Titre
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            {bookData.title || 'Non défini'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Auteur
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            {bookData.author || 'Non défini'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Soumis par
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            {bookData.submittedBy || 'Non défini'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Date de soumission
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            {bookData.submissionDate
                                                ? new Date(bookData.submissionDate).toLocaleDateString('fr-FR')
                                                : 'Non défini'}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Statut
                                        </Typography>
                                        <Chip
                                            label={
                                                bookData.status === 'WAITING' ? 'En attente' :
                                                bookData.status === 'IN_QUARANTINE' ? 'Validé (3/3)' :
                                                bookData.status === 'ACCEPTED' ? 'Publié' :
                                                bookData.status === 'REJECTED' ? 'Rejeté' :
                                                bookData.status || 'Inconnu'
                                            }
                                            color={
                                                bookData.status === 'WAITING' ? 'warning' :
                                                bookData.status === 'IN_QUARANTINE' ? 'info' :
                                                bookData.status === 'ACCEPTED' ? 'success' :
                                                bookData.status === 'REJECTED' ? 'error' :
                                                'default'
                                            }
                                            sx={{ marginTop: 1 }}
                                        />
                                    </Grid>

                                    {bookData.description && (
                                        <Grid item xs={12}>
                                            <Typography variant="body2" color="text.secondary">
                                                Description
                                            </Typography>
                                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                                                {bookData.description}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>

                            {/* Tableau de validation */}
                            <Paper sx={styles.paper}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    État de la validation
                                </Typography>
                                <Divider sx={{ marginBottom: 2 }} />
                                <ModeratorValidationTable bookId={bookId} />
                            </Paper>
                        </Box>

                        {/* Colonne droite : Contenu du document */}
                        <Box sx={styles.rightColumn}>
                            <Paper sx={{ ...styles.paper, minHeight: '80vh' }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                                    📖 Contenu du document
                                </Typography>
                                <Divider sx={{ marginBottom: 3 }} />
                                <Box sx={styles.markdownContent}>
                                    <ReactMarkdown>
                                        {bookData.markdownContent}
                                    </ReactMarkdown>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>
                )}

                {!bookData && (
                    <Alert severity="error">
                        Impossible de charger les données du livre
                    </Alert>
                )}
            </Container>
        </Box>
    );
}

export default ModeratorPage;

