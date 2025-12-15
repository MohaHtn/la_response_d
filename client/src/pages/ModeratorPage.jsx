import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import ReactMarkdown, {defaultUrlTransform} from 'react-markdown';
import ModeratorValidationTable from '../components/ModeratorValidationTable';
import Header from '../components/Header';
import { ROUTES, MESSAGES, USER_TYPES } from '../constants';
import { moderationService } from '../services/moderation.service';
import { getAuthData } from '../services/auth.service';
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { useTranslation } from 'react-i18next';

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
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const [bookData, setBookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const { userType } = getAuthData();

    useEffect(() => {
        // Charger les données du livre depuis l'API (service centralisé)
        const fetchBookData = async () => {
            try {
                setLoading(true);
                const isQuarantine = ['1', 'true', 'yes'].includes(
                  String(searchParams.get('is_quarantine') || '').toLowerCase()
                );
                let document = isQuarantine
                  ? await moderationService.getQuarantineDocument(bookId)
                  : await moderationService.getBook(bookId);

                const transformedData = {
                    id: document.document_id || bookId,
                    title: document.metadata?.title || t('moderator.undefined'),
                    author: document.metadata?.author || t('moderator.undefined'),
                    submittedBy: document.uploader?.username || t('moderator.unknownUser'),
                    submissionDate: document.uploader?.upload_date || new Date().toISOString(),
                    status: document.moderation?.approval_process?.status || 'WAITING',
                    description: document.metadata?.description || '',
                    publisher: document.metadata?.publisher || '',
                    date: document.metadata?.parution_date || '',
                    totalPages: document.processing_info?.total_pages || 0,
                    markdownContent: document.markdown?.content || document.content || document.preview || `# ${t('moderator.noContentTitle')}\n\n${t('moderator.noContentText')}`,
                };

                setBookData(transformedData);
                setError(null);
            } catch (err) {
                console.error('Erreur lors du chargement du livre:', err);
                const raw = err?.message || '';
                const isQuarantine = ['1', 'true', 'yes'].includes(
                  String(searchParams.get('is_quarantine') || '').toLowerCase()
                );
                const mapped = isQuarantine
                  ? (raw.includes('Document introuvable en quarantaine')
                      ? t('moderator.errors.notFoundInQuarantine')
                      : raw)
                  : (raw.includes('Document introuvable')
                      ? t('moderator.errors.notFound')
                      : raw);
                setError(mapped);

                // Données de secours pour continuer à afficher la page
                const fallbackData = {
                    id: bookId,
                    title: t('moderator.bookInModeration'),
                    author: t('moderator.unknownAuthor'),
                    submittedBy: t('moderator.user'),
                    submissionDate: new Date().toISOString(),
                    status: 'WAITING',
                    description: t('moderator.errorLoading'),
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
    }, [bookId, t, searchParams]);

    if (loading) {
        return (
            <Box sx={styles.root}>
                <Header />
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                        <CircularProgress />
                        <Typography sx={{ marginLeft: 2 }}>{t('moderator.loading')}</Typography>
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
                    {userType === USER_TYPES.ADMIN && (
                        <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate(ROUTES.ADMIN)}
                        startIcon={<span>←</span>}
                        >
                            {t('moderator.backToAdminPanel')}
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        style={{ marginLeft: '20px' }}
                        onClick={() => navigate(ROUTES.HOME)}
                        startIcon={<span>←</span>}
                    >
                        {t('moderator.backToLibrary')}
                    </Button>

                    {(userType === USER_TYPES.ADMIN || userType === USER_TYPES.MODERATOR) && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => setConfirmOpen(true)}
                        style={{ marginLeft: '20px' }}
                        disabled={deleting}
                      >
                        {deleting ? t('loading.generic') : 'Supprimer le livre'}
                      </Button>
                    )}

                </Box>

                {/* En-tête de la page */}
                <Box sx={styles.section}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {t('moderator.title')}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {t('moderator.subtitle')}
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="warning" sx={{ marginBottom: 2 }}>
                        {t('moderator.warning')}: {error}
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
                                    {t('moderator.bookInfo')}
                                </Typography>
                                <Divider sx={{ marginBottom: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('moderator.fields.title')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            {bookData.title || t('moderator.undefined')}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('moderator.fields.author')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            {bookData.author || t('moderator.undefined')}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('moderator.fields.submittedBy')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            {bookData.submittedBy || t('moderator.undefined')}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('moderator.fields.submissionDate')}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                                            {bookData.submissionDate
                                                ? new Date(bookData.submissionDate).toLocaleDateString(undefined)
                                                : t('moderator.undefined')}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            {t('moderator.fields.status')}
                                        </Typography>
                                        <Chip
                                            label={
                                                bookData.status === 'WAITING' ? t('moderator.status.waiting') :
                                                bookData.status === 'IN_QUARANTINE' ? t('moderator.status.inQuarantine') :
                                                bookData.status === 'ACCEPTED' ? t('moderator.status.accepted') :
                                                bookData.status === 'REJECTED' ? t('moderator.status.rejected') :
                                                bookData.status || t('moderator.status.unknown')
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
                                                {t('moderator.fields.description')}
                                            </Typography>
                                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                                                {bookData.description}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>

                            {/* Tableau de validation */}

                            {(['1','true','yes'].includes(String(searchParams.get('is_quarantine') || '').toLowerCase())) && (
                              <Paper sx={styles.paper}>
                                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                      {t('moderator.validationState')}
                                  </Typography>
                                  <Divider sx={{ marginBottom: 2 }} />
                                  <ModeratorValidationTable bookId={bookId} />
                              </Paper>
                            )}
                        </Box>

                        {/* Colonne droite : Contenu du document */}
                        <Box sx={styles.rightColumn}>
                            <Paper sx={{ ...styles.paper, minHeight: '80vh' }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                                    📖 {t('moderator.documentContent')}
                                </Typography>
                                <Divider sx={{ marginBottom: 3 }} />
                                <Box sx={styles.markdownContent}>
                                    <ReactMarkdown
                                        children={bookData?.markdownContent || t('moderator.noContent')}
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
                                                  alt={props.alt || t('moderator.image')}
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
                        {t('moderator.loadError')}
                    </Alert>
                )}

                {/* Boîte de confirmation suppression */}
                <Dialog open={confirmOpen} onClose={() => (!deleting && setConfirmOpen(false))}>
                  <DialogTitle>
                    {"Êtes-vous sûr de supprimer ce document ?"}
                  </DialogTitle>
                  <DialogContent>
                    <Typography variant="body2" color="text.secondary">
                      {bookData?.title ? `"${bookData.title}"` : ''}
                    </Typography>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={deleting}>
                      Annuler
                    </Button>
                    <Button
                      onClick={async () => {
                        try {
                          setDeleting(true);
                          await moderationService.rejectDocument(bookId);
                          // Succès: message et redirection
                          // Option: on pourrait afficher un toast; ici on redirige directement
                          navigate(ROUTES.ADMIN, { replace: true, state: { info: MESSAGES.MODERATION_REJECTED } });
                        } catch (e) {
                          console.error('Erreur suppression', e);
                          setError(e?.message || MESSAGES.MODERATION_ERROR);
                        } finally {
                          setDeleting(false);
                          setConfirmOpen(false);
                        }
                      }}
                      color="error"
                      variant="contained"
                      disabled={deleting}
                    >
                      Supprimer
                    </Button>
                  </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}

export default ModeratorPage;

