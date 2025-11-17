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

// Données mockées (à remplacer par des appels API)
const MOCK_STATS = {
  totalUsers: 42,
  totalBooks: 156,
  pendingModeration: 8,
  approvedBooks: 148,
};

const MOCK_PENDING_BOOKS = [
  {
    id: 'book1',
    title: 'Les Misérables',
    author: 'Victor Hugo',
    submittedBy: 'user123',
    submissionDate: '2025-11-15',
    status: 'en_cours',
    approvals: 1,
  },
  {
    id: 'book2',
    title: 'Notre-Dame de Paris',
    author: 'Victor Hugo',
    submittedBy: 'user456',
    submissionDate: '2025-11-14',
    status: 'en_cours',
    approvals: 2,
  },
  {
    id: 'book3',
    title: 'Le Comte de Monte-Cristo',
    author: 'Alexandre Dumas',
    submittedBy: 'user789',
    submissionDate: '2025-11-13',
    status: 'en_cours',
    approvals: 0,
  },
];

const MOCK_USERS = [
  {
    username: 'thomas',
    email: 'thomas@example.com',
    accountType: 'ADMIN',
    registrationDate: '2025-01-10',
  },
  {
    username: 'marie_user',
    email: 'marie@example.com',
    accountType: 'USER',
    registrationDate: '2025-03-15',
  },
  {
    username: 'jean_moderator',
    email: 'jean@example.com',
    accountType: 'MODERATOR',
    registrationDate: '2025-02-20',
  },
];

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
  const [stats, setStats] = useState(MOCK_STATS);
  const [pendingBooks, setPendingBooks] = useState(MOCK_PENDING_BOOKS);
  const [users, setUsers] = useState(MOCK_USERS);

  useEffect(() => {
    // TODO: Vérifier si l'utilisateur est admin
    // Si non, rediriger vers /home
    const userType = localStorage.getItem('userType');
    if (userType === 'USER') {
      navigate('/home');
    }
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
                            {new Date(book.submissionDate).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${book.approvals}/3`} 
                              color={book.approvals === 3 ? 'success' : 'warning'}
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
                            {new Date(user.registrationDate).toLocaleDateString('fr-FR')}
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

