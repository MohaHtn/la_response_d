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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { ROUTES, USER_TYPES, STORAGE_KEYS, API_CONFIG } from '../constants';
import i18n from '../i18n';
import { getCommonHeaders } from '../utils/http';
import { useTranslation } from 'react-i18next';

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
  return {
    'Content-Type': 'application/json',
    ...getCommonHeaders(),
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
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE}`, {
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
    const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USERS}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
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
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({ totalUsers: 0, totalBooks: 0, pendingModeration: 0, approvedBooks: 0 });
  const [pendingBooks, setPendingBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // États pour la gestion des utilisateurs (édition/suppression)
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [editAccountType, setEditAccountType] = useState(USER_TYPES.USER);
  const [editPassword, setEditPassword] = useState('');

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
        setError(t('admin.loading.data'));
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
      [USER_TYPES.ADMIN]: { color: 'error', label: t('admin.users.roles.admin') },
      [USER_TYPES.MODERATOR]: { color: 'warning', label: t('admin.users.roles.moderator') },
      [USER_TYPES.USER]: { color: 'success', label: t('admin.users.roles.user') },
    };
    const config = configs[type] || configs[USER_TYPES.USER];
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  // Rafraîchir la liste des utilisateurs
  const refreshUsers = async () => {
    try {
      const usersData = await fetchUsers();
      const transformedUsers = usersData.map(user => ({
        username: user.username || user.email || 'Inconnu',
        email: user.email || '',
        accountType: user.account_type || user.type || USER_TYPES.USER,
        registrationDate: user.created_at || user.registration_date || new Date().toISOString(),
      }));
      setUsers(transformedUsers);
      // Mettre à jour le compteur utilisateurs dans les stats
      setStats(prev => ({ ...prev, totalUsers: transformedUsers.length }));
    } catch (e) {
      console.warn('refreshUsers failed', e);
    }
  };

  // Ouvrir le dialogue d'édition
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditEmail(user.email || '');
    setEditAccountType(user.accountType || USER_TYPES.USER);
    setEditPassword('');
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedUser(null);
    setEditPassword('');
  };

  // Sauvegarder les modifications utilisateur
  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      const payload = {
        email: editEmail,
        account_type: editAccountType,
      };
      if (editPassword && editPassword.trim().length > 0) {
        payload.password = editPassword.trim();
      }

      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USER(selectedUser.username)}`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || t('admin.users.updateGenericError'));
      }
      await refreshUsers();
      handleCloseEdit();
    } catch (e) {
      console.error('handleSaveEdit error', e);
      setError(e?.message || t('admin.users.updateError'));
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (user) => {
    if (!user) return;
    const confirmed = window.confirm(
      t('admin.users.confirmDelete', { username: user.username })
    );
    if (!confirmed) return;
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ADMIN_USER(user.username)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || t('admin.users.deleteError'));
      }
      await refreshUsers();
    } catch (e) {
      console.error('handleDeleteUser error', e);
      setError(e?.message || t('admin.users.deleteError'));
    }
  };

  return (
    <Box sx={styles.root}>
      <Header />
      <Container maxWidth="xl">
        {/* En-tête */}
        <Box sx={styles.header}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {t('admin.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {t('admin.subtitle')}
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
                    <Typography variant="body2">{t('admin.stats.users')}</Typography>
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
                    <Typography variant="body2">{t('admin.stats.totalBooks')}</Typography>
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
                    <Typography variant="body2">{t('admin.stats.pendingModeration')}</Typography>
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
                    <Typography variant="body2">{t('admin.stats.approvedBooks')}</Typography>
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
              <Typography>{t('admin.loading.data')}</Typography>
            </Box>
          )}

          {!loading && (
            <>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label={t('admin.tabs.pending')} />
                <Tab label={t('admin.tabs.all')} />
                <Tab label={t('admin.tabs.users')} />
              </Tabs>

              <Box sx={styles.tabContent}>
                {/* Onglet 1: Livres en attente de modération */}
                {activeTab === 0 && (
                  <Box>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      {t('admin.pending.info')}
                    </Alert>

                    {/* Boutons de tri */}
                    <Box sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>{t('admin.pending.sortLabel')}</Typography>
                      <Button
                        size="small"
                        variant={sortBy === 'date' ? 'contained' : 'outlined'}
                        onClick={() => handleSort('date')}
                      >
                        {t('admin.pending.sort.date')} {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </Button>
                      <Button
                        size="small"
                        variant={sortBy === 'title' ? 'contained' : 'outlined'}
                        onClick={() => handleSort('title')}
                      >
                        {t('admin.pending.sort.title')} {sortBy === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </Button>
                      <Button
                        size="small"
                        variant={sortBy === 'author' ? 'contained' : 'outlined'}
                        onClick={() => handleSort('author')}
                      >
                        {t('admin.pending.sort.author')} {sortBy === 'author' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </Button>
                    </Box>

                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>{t('admin.pending.table.title')}</strong></TableCell>
                            <TableCell><strong>{t('admin.pending.table.author')}</strong></TableCell>
                            <TableCell><strong>{t('admin.pending.table.submittedBy')}</strong></TableCell>
                            <TableCell><strong>{t('admin.pending.table.date')}</strong></TableCell>
                            <TableCell><strong>{t('admin.pending.table.validations')}</strong></TableCell>
                            <TableCell><strong>{t('admin.pending.table.actions')}</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {getSortedPendingBooks().map((book) => (
                            <TableRow key={book.id}>
                              <TableCell>{book.title}</TableCell>
                              <TableCell>{book.author}</TableCell>
                              <TableCell>{book.submittedBy}</TableCell>
                              <TableCell>
                                {book.submissionDate ? new Date(book.submissionDate).toLocaleDateString(undefined) : ''}
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
                                  {t('admin.pending.buttons.moderate')}
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  onClick={() => handleViewBook(book.id)}
                                >
                                  {t('admin.pending.buttons.view')}
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
                      {t('admin.all.info')}
                    </Alert>
                    {allBooks.length === 0 ? (
                      <Typography variant="body1" color="text.secondary">
                        {t('admin.all.none')}
                      </Typography>
                    ) : (
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>{t('admin.all.table.title')}</strong></TableCell>
                              <TableCell><strong>{t('admin.all.table.author')}</strong></TableCell>
                              <TableCell><strong>{t('admin.all.table.submittedBy')}</strong></TableCell>
                              <TableCell><strong>{t('admin.all.table.date')}</strong></TableCell>
                              <TableCell><strong>{t('admin.all.table.status')}</strong></TableCell>
                              <TableCell><strong>{t('admin.all.table.actions')}</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {allBooks.map((book) => (
                              <TableRow key={book.id}>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.submittedBy}</TableCell>
                                <TableCell>
                                  {book.submissionDate ? new Date(book.submissionDate).toLocaleDateString(undefined) : ''}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={book.status === 'OK' ? t('admin.all.status.ok') : book.status === 'WAITING' ? t('admin.all.status.waiting') : book.status}
                                    color={book.status === 'OK' ? 'success' : book.status === 'WAITING' ? 'warning' : 'default'}
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
                                    {t('admin.all.buttons.moderate')}
                                  </Button>
                                  <Button
                                    size="small"
                                    variant="text"
                                    onClick={() => handleViewBook(book.id)}
                                  >
                                    {t('admin.all.buttons.view')}
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
                            <TableCell><strong>{t('admin.users.table.username')}</strong></TableCell>
                            <TableCell><strong>{t('admin.users.table.email')}</strong></TableCell>
                            <TableCell><strong>{t('admin.users.table.accountType')}</strong></TableCell>
                            <TableCell><strong>{t('admin.users.table.registrationDate')}</strong></TableCell>
                            <TableCell><strong>{t('admin.users.table.actions')}</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.username}>
                              <TableCell>{user.username}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{getAccountTypeChip(user.accountType)}</TableCell>
                              <TableCell>
                                {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString(undefined) : ''}
                              </TableCell>
                              <TableCell>
                                <Stack direction="row" spacing={1}>
                                  <Button size="small" variant="outlined" onClick={() => handleOpenEdit(user)}>
                                    {t('admin.users.buttons.edit')}
                                  </Button>
                                  <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteUser(user)}>
                                    {t('admin.users.buttons.delete')}
                                  </Button>
                                </Stack>
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

      {/* Dialogue édition utilisateur */}
      <Dialog open={editOpen} onClose={handleCloseEdit} fullWidth maxWidth="sm">
        <DialogTitle>{t('admin.users.dialog.editTitle')}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('admin.users.dialog.username')}
              value={selectedUser?.username || ''}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label={t('admin.users.dialog.email')}
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
            <FormControl>
              <InputLabel id="account-type-label">{t('admin.users.dialog.accountType')}</InputLabel>
              <Select
                labelId="account-type-label"
                label={t('admin.users.dialog.accountType')}
                value={editAccountType}
                onChange={(e) => setEditAccountType(e.target.value)}
              >
                <MenuItem value={USER_TYPES.USER}>{t('admin.users.roles.user')}</MenuItem>
                <MenuItem value={USER_TYPES.MODERATOR}>{t('admin.users.roles.moderator')}</MenuItem>
                <MenuItem value={USER_TYPES.ADMIN}>{t('admin.users.roles.admin')}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('admin.users.dialog.newPassword')}
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              helperText={t('admin.users.dialog.passwordHint')}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>{t('actions.cancel')}</Button>
          <Button variant="contained" onClick={handleSaveEdit}>{t('actions.save')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AdminPage;

