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

// helpers API

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

function AdminPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [stats, _setStats] = useState({ totalUsers: 0, totalBooks: 0, pendingModeration: 0, approvedBooks: 0 });
  const [pendingBooks, _setPendingBooks] = useState([]);
  const [users, _setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    if (userType === 'USER') {
      navigate('/home');
      return;
    }

    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [s, books, us] = await Promise.all([fetchAdminStats(), fetchPendingBooks(), fetchUsers()]);
        if (!mounted) return;
        _setStats(s);
        _setPendingBooks(books);
        _setUsers(us);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('admin page load error', e);
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

  const handleModerateBook = (bookId) => {
    navigate(`/moderation/${bookId}`);
  };

  const handleViewBook = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const getAccountTypeChip = (type) => {
    const configs = {
      ADMIN: { color: 'error', label: 'Administrateur' },
      MODERATOR: { color: 'warning', label: 'Modérateur' },
      USER: { color: 'success', label: 'Utilisateur' },
    };
    const config = configs[type] || configs.USER;
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
                      {pendingBooks.map((book) => (
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
                <Typography variant="body1" color="text.secondary">
                  Liste complète des livres à implémenter...
                </Typography>
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
        </Paper>
      </Container>
    </Box>
  );
}

export default AdminPage;
