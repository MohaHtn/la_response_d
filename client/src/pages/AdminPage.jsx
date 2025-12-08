import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { ROUTES, USER_TYPES, STORAGE_KEYS, API_CONFIG } from '../constants';

const styles = {
  root: {
    minHeight: '100vh',
    paddingTop: '80px',
    paddingBottom: '40px',
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: '32px',
  },
  statsCard: {
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
    },
  },
  statsIcon: {
    fontSize: '48px',
    opacity: 0.9,
  },
  section: {
    marginBottom: '32px',
  },
  tabContent: {
    padding: '24px',
  },
};

// ==================== Fonctions API ====================

/**
 * Get authorization headers
 */
function getAuthHeaders() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
}

/**
 * Fetch all books/documents
 */
async function fetchAllBooks() {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENTS_LIST}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch (e) {
    console.warn('fetchAllBooks failed', e);
    return [];
  }
}

/**
 * Fetch pending moderation books
 */
async function fetchPendingBooks() {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODERATION_PENDING}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch (e) {
    console.warn('fetchPendingBooks failed', e);
    return [];
  }
}

/**
 * Fetch quarantine books (admin only)
 */
async function fetchQuarantineBooks() {
  try {
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch (e) {
    console.warn('fetchQuarantineBooks failed', e);
    return [];
  }
}

/**
 * Fetch all users (admin only)
 * Note: L'endpoint backend n'existe pas encore, retourne un tableau vide
 */
async function fetchUsers() {
  try {
    // TODO: Créer l'endpoint backend /api/users/
    console.warn('fetchUsers: endpoint non implémenté côté backend');
    return [];
  } catch (e) {
    console.warn('fetchUsers failed', e);
    return [];
  }
}

/**
 * Fetch admin statistics
 */
async function fetchAdminStats() {
  try {
    // Récupérer tous les documents et utilisateurs pour calculer les stats
    const [allDocs, pendingDocs, quarantineDocs, users] = await Promise.all([
      fetchAllBooks(),
      fetchPendingBooks(),
      fetchQuarantineBooks(),
      fetchUsers()
    ]);

    const approvedBooks = allDocs.filter(doc =>
      doc.moderation?.approval_process?.status === 'OK'
    ).length;

    return {
      totalUsers: users.length,
      totalBooks: allDocs.length + quarantineDocs.length,
      pendingModeration: pendingDocs.length,
      approvedBooks: approvedBooks
    };
  } catch (e) {
    console.warn('fetchAdminStats failed', e);
    return { totalUsers: 0, totalBooks: 0, pendingModeration: 0, approvedBooks: 0 };
  }
}

// ==================== Composant AdminPage ====================

function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({ totalUsers: 0, totalBooks: 0, pendingModeration: 0, approvedBooks: 0 });
  const [pendingBooks, setPendingBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // États pour le tri
  const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'author'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  useEffect(() => {
    const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
    if (userType === USER_TYPES.USER) {
      navigate(ROUTES.HOME);
      return;
    }

    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        // Charger toutes les données en parallèle
        const [statsData, pendingBooksData, usersData, allBooksData] = await Promise.all([
          fetchAdminStats(),
          fetchPendingBooks(),
          fetchUsers(),
          fetchAllBooks()
        ]);

        if (!mounted) return;

        // Transformer les livres en attente
        const transformedPendingBooks = pendingBooksData.map(book => ({
          id: book.document_id || book.id || '',
          title: book.metadata?.title || 'Sans titre',
          author: book.metadata?.author || 'Auteur inconnu',
          submittedBy: book.uploader?.username || 'Inconnu',
          submissionDate: book.uploader?.upload_date || new Date().toISOString(),
          approvals: book.moderation?.approved_by?.length || 0,
          status: book.moderation?.approval_process?.status || 'WAITING',
        }));

        // Transformer tous les livres
        const transformedAllBooks = allBooksData.map(book => ({
          id: book.document_id || book.id || '',
          title: book.metadata?.title || 'Sans titre',
          author: book.metadata?.author || 'Auteur inconnu',
          submittedBy: book.uploader?.username || 'Inconnu',
          submissionDate: book.uploader?.upload_date || new Date().toISOString(),
          approvals: book.moderation?.approved_by?.length || 0,
          status: book.moderation?.approval_process?.status || 'WAITING',
          totalPages: book.processing_info?.total_pages || 0,
        }));

        // Transformer les utilisateurs
        const transformedUsers = usersData.map(user => ({
          username: user.username || user.email || 'Inconnu',
          email: user.email || '',
          accountType: user.account_type || user.type || USER_TYPES.USER,
          registrationDate: user.created_at || user.registration_date || new Date().toISOString(),
        }));

        setStats(statsData);
        setPendingBooks(transformedPendingBooks);
        setAllBooks(transformedAllBooks);
        setUsers(transformedUsers);
      } catch (e) {
        console.error('Erreur lors du chargement des données admin:', e);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Fonction pour trier les livres
  const sortBooks = (books, criteria, order) => {
    const sorted = [...books].sort((a, b) => {
      let comparison = 0;

      switch (criteria) {
        case 'date':
          const dateA = new Date(a.submissionDate || 0);
          const dateB = new Date(b.submissionDate || 0);
          comparison = dateB - dateA; // Plus récent en premier par défaut
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '', 'fr');
          break;
        case 'author':
          comparison = (a.author || '').localeCompare(b.author || '', 'fr');
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  };

  // Fonction pour changer le critère de tri
  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      // Si on clique sur le même critère, on inverse l'ordre
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouveau critère, on commence par ordre descendant (sauf pour titre/auteur)
      setSortBy(criteria);
      setSortOrder(criteria === 'date' ? 'desc' : 'asc');
    }
  };

  // Obtenir les livres triés
  const getSortedPendingBooks = () => {
    return sortBooks(pendingBooks, sortBy, sortOrder);
  };

  const getSortedAllBooks = () => {
    return sortBooks(allBooks, sortBy, sortOrder);
  };

  const handleModerateBook = (bookId) => {
    navigate(ROUTES.MODERATION(bookId));
  };

  const handleViewBook = (bookId) => {
    navigate(ROUTES.BOOK(bookId));
  };

  const getAccountTypeChip = (type) => {
    const configs = {
      [USER_TYPES.ADMIN]: { color: 'error', label: 'Administrateur' },
      [USER_TYPES.MODERATOR]: { color: 'warning', label: 'Modérateur' },
      [USER_TYPES.USER]: { color: 'success', label: 'Utilisateur' },
    };
    const config = configs[type] || configs[USER_TYPES.USER];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Box sx={styles.root}>
      <Header />
      <Container maxWidth="xl">
        {/* En-tête */}
        <Box sx={styles.header}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Panneau d'administration
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gérez les utilisateurs, les livres et la modération
          </Typography>
        </Box>

        {/* Statistiques */}
        <Grid container spacing={3} sx={styles.section}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.statsCard}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stats.totalUsers}
                    </Typography>
                    <Typography variant="body2">Utilisateurs</Typography>
                  </Box>
                  <PeopleIcon sx={styles.statsIcon} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.statsCard}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stats.totalBooks}
                    </Typography>
                    <Typography variant="body2">Livres total</Typography>
                  </Box>
                  <LibraryBooksIcon sx={styles.statsIcon} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.statsCard}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stats.pendingModeration}
                    </Typography>
                    <Typography variant="body2">En modération</Typography>
                  </Box>
                  <PendingActionsIcon sx={styles.statsIcon} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={styles.statsCard}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {stats.approvedBooks}
                    </Typography>
                    <Typography variant="body2">Livres validés</Typography>
                  </Box>
                  <CheckCircleIcon sx={styles.statsIcon} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Onglets */}
        <Paper sx={styles.section}>
          {error && (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <Typography>Chargement des données...</Typography>
            </Box>
          )}

          {!loading && (
            <>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Livres en attente" />
                <Tab label="Tous les livres" />
                <Tab label="Utilisateurs" />
              </Tabs>

              <Box sx={styles.tabContent}>
                {/* Onglet 1: Livres en attente de modération */}
                {activeTab === 0 && (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Ces livres sont en attente de validation par les modérateurs
                    </Alert>

                    {/* Boutons de tri */}
                    <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>Trier par:</Typography>
                      <Button
                        size="small"
                        variant={sortBy === 'date' ? 'contained' : 'outlined'}
                        onClick={() => handleSort('date')}
                      >
                        Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </Button>
                      <Button
                        size="small"
                        variant={sortBy === 'title' ? 'contained' : 'outlined'}
                        onClick={() => handleSort('title')}
                      >
                        Titre {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </Button>
                      <Button
                        size="small"
                        variant={sortBy === 'author' ? 'contained' : 'outlined'}
                        onClick={() => handleSort('author')}
                      >
                        Auteur {sortBy === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </Button>
                    </Box>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Titre</strong></TableCell>
                            <TableCell><strong>Auteur</strong></TableCell>
                            <TableCell><strong>Soumis par</strong></TableCell>
                            <TableCell><strong>Date</strong></TableCell>
                            <TableCell><strong>Validations</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getSortedPendingBooks().map((book) => (
                            <TableRow key={book.id}>
                              <TableCell>{book.title}</TableCell>
                              <TableCell>{book.author}</TableCell>
                              <TableCell>{book.submittedBy}</TableCell>
                              <TableCell>
                                {book.submissionDate ? new Date(book.submissionDate).toLocaleDateString('fr-FR') : ''}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={`${book.approvals ?? 0}/3`}
                                  color={(book.approvals ?? 0) === 3 ? 'success' : 'warning'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => handleModerateBook(book.id)}
                                  sx={{ mr: 1 }}
                                >
                                  Modérer
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => handleViewBook(book.id)}
                                >
                                  Voir
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Onglet 2: Tous les livres */}
                {activeTab === 1 && (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Liste complète de tous les livres de la bibliothèque
                    </Alert>
                    {allBooks.length === 0 ? (
                      <Typography variant="body1" color="text.secondary">
                        Aucun livre disponible
                      </Typography>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Titre</strong></TableCell>
                              <TableCell><strong>Auteur</strong></TableCell>
                              <TableCell><strong>Soumis par</strong></TableCell>
                              <TableCell><strong>Date</strong></TableCell>
                              <TableCell><strong>Statut</strong></TableCell>
                              <TableCell><strong>Validations</strong></TableCell>
                              <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {allBooks.map((book) => (
                              <TableRow key={book.id}>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.submittedBy}</TableCell>
                                <TableCell>
                                  {book.submissionDate ? new Date(book.submissionDate).toLocaleDateString('fr-FR') : ''}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={book.status === 'OK' ? 'Approuvé' : book.status === 'WAITING' ? 'En attente' : book.status}
                                    color={book.status === 'OK' ? 'success' : book.status === 'WAITING' ? 'warning' : 'default'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={`${book.approvals ?? 0}/3`}
                                    color={(book.approvals ?? 0) === 3 ? 'success' : 'warning'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleModerateBook(book.id)}
                                    sx={{ mr: 1 }}
                                  >
                                    Modérer
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="text"
                                    onClick={() => handleViewBook(book.id)}
                                  >
                                    Voir
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </Box>
                )}

                {/* Onglet 3: Utilisateurs */}
                {activeTab === 2 && (
                  <Box>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Nom d'utilisateur</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Type de compte</strong></TableCell>
                            <TableCell><strong>Date d'inscription</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.username}>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{getAccountTypeChip(user.accountType)}</TableCell>
                              <TableCell>
                                {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString('fr-FR') : ''}
                              </TableCell>
                              <TableCell>
                                <Button size="small" variant="text">
                                  Gérer
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminPage;

