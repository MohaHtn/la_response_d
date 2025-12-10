import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown, {defaultUrlTransform} from 'react-markdown';
import ModeratorValidationTable from '../components/ModeratorValidationTable';
import Header from '../components/Header';
import { ROUTES, MESSAGES } from '../constants';
import { moderationService } from '../services/moderation.service';
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
    Button,
} from '@mui/material';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

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
    const navigate = useNavigate();
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Charger les données du livre depuis l'API (service centralisé)
        const fetchBookData = async () => {
            try {
                setLoading(true);
                const document = await moderationService.getQuarantineDocument(bookId);

                const transformedData = {
                    id: document.document_id || bookId,
                    title: document.metadata?.title || 'Titre non défini',
                    author: document.metadata?.author || 'Auteur non défini',
                    submittedBy: document.uploader?.username || 'Utilisateur inconnu',
                    submissionDate: document.uploader?.upload_date || new Date().toISOString(),
                    status: document.moderation?.approval_process?.status || 'WAITING',
                    description: document.metadata?.description || '',
                    publisher: document.metadata?.publisher || '',
                    date: document.metadata?.parution_date || '',
                    totalPages: document.processing_info?.total_pages || 0,
                    markdownContent: document.markdown?.content || document.content || document.preview || '# Contenu non disponible\n\nLe contenu du document n\'a pas pu être chargé.',
                };

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
                setBookData(fallbackData);
            } finally {
                setLoading(false);
            }
        };
        if (bookId) fetchBookData();
        else setLoading(false);
    }, [bookId]);

    if (loading) {
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

    return (
        <Box sx={styles.root}>
            <Header />
            <Container maxWidth="xl">
                {/* Bouton retour */}
                <Box sx={{ marginBottom: 2 }}>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(ROUTES.HOME)}
                        startIcon={<span>←</span>}
                    >
                        Retour à la bibliothèque
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate(ROUTES.ADMIN_QUARANTINE)}
                        startIcon={<span>←</span>}
                    >
                        Retour à la liste des documents en quarantaine
                    </Button>
                </Box>

                {/* En-tête de la page */}
                <Box sx={styles.section}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Modération du livre
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Validez ou rejetez ce livre en tant que modérateur.
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
                                    <ReactMarkdown
                                        children={bookData?.markdownContent || 'Aucun contenu disponible'}
                                        remarkPlugins={[remarkMath]}
                                        rehypePlugins={[rehypeKatex]}
                                        urlTransform={(url) =>url.startsWith('data:') ? url : defaultUrlTransform(url)}
                                        components={{
                                          img: ({node, ...props}) => (
                                              <img
                                                  {...props}
                                                  style={{
                                                    maxWidth: '100%',
                                                    height: 'auto',
                                                    display: 'block',
                                                    maxHeight: '500px',
                                                    objectFit: 'contain',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                    margin: '10px 0'
                                                  }}
                                                  alt={props.alt || 'Image'}
                                              />
                                          )
                                        }}
                                    />
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

