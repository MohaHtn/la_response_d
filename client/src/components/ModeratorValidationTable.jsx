import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

const styles = {
  container: {
    padding: '24px',
    margin: '24px 0',
    backgroundColor: '#fff',
  },
  title: {
    marginBottom: '20px',
    color: '#1976d2',
    fontWeight: 'bold',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    padding: '6px 12px',
    borderRadius: '4px',
    color: '#856404',
    fontWeight: 'bold',
  },
  statusApproved: {
    backgroundColor: '#d4edda',
    padding: '6px 12px',
    borderRadius: '4px',
    color: '#155724',
    fontWeight: 'bold',
  },
  statusRejected: {
    backgroundColor: '#f8d7da',
    padding: '6px 12px',
    borderRadius: '4px',
    color: '#721c24',
    fontWeight: 'bold',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px',
  },
  visualValidationContainer: {
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
  },
  validationLevel: {
    marginBottom: '24px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
  },
  validationLevelActive: {
    border: '2px solid #4caf50',
    boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)',
  },
  validationLevelCompleted: {
    border: '2px solid #4caf50',
    backgroundColor: '#e8f5e9',
  },
  levelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  levelTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  },
  adminBoxesContainer: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  adminBox: {
    flex: '1',
    minWidth: '150px',
    padding: '16px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    backgroundColor: '#fff',
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  adminBoxApproved: {
    border: '2px solid #4caf50',
    backgroundColor: '#e8f5e9',
  },
  adminBoxRejected: {
    border: '2px solid #f44336',
    backgroundColor: '#ffebee',
  },
  adminBoxPending: {
    border: '2px solid #ff9800',
    backgroundColor: '#fff3e0',
  },
  adminName: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  checkIcon: {
    fontSize: '48px',
    color: '#4caf50',
  },
};

// Données de test par défaut
const DEFAULT_MOCK_DATA = [
  {
    id: 1,
    moderatorName: "Jean Dupont",
    role: "Modérateur Principal",
    status: "approved",
    date: "2025-11-10",
    comment: "Contenu validé"
  },
  {
    id: 2,
    moderatorName: "Marie Martin",
    role: "Vérificateur OCR",
    status: "pending",
    date: null,
    comment: "En cours de vérification"
  },
  {
    id: 3,
    moderatorName: "Pierre Durand",
    role: "Expert Copyright",
    status: "pending",
    date: null,
    comment: "En attente"
  }
];

const ModeratorValidationTable = ({
  moderationData = null,
  isLoading = false,
  error = null,
  showTitle = true,
  showVisualValidation = true,
}) => {
  // Utiliser les données passées en props ou les données mockées par défaut
  const data = moderationData || DEFAULT_MOCK_DATA;

  // Calculer le nombre d'admins ayant validé
  const getApprovedCount = () => {
    return data.filter(mod => mod.status === 'approved').length;
  };

  const approvedCount = getApprovedCount();

  // Déterminer le niveau de validation actuel
  const getCurrentValidationLevel = () => {
    if (approvedCount === 0) return 1;
    if (approvedCount === 1) return 2;
    if (approvedCount === 2) return 3;
    return 4; // Tous validés
  };

  const currentLevel = getCurrentValidationLevel();

  // Grouper les admins par niveau selon le schéma
  const getAdminsForLevel = (level) => {
    if (level === 1) {
      // Niveau 1: Admin 1 seul
      return [data[0]];
    } else if (level === 2) {
      // Niveau 2: Admin 1 et Admin 2
      return [data[0], data[1]];
    } else if (level === 3) {
      // Niveau 3: Admin 1, Admin 2 et Admin 3
      return data;
    }
    return [];
  };

  const isLevelCompleted = (level) => {
    if (level === 1) return approvedCount >= 1;
    if (level === 2) return approvedCount >= 2;
    if (level === 3) return approvedCount >= 3;
    return false;
  };

  const isLevelActive = (level) => {
    return currentLevel === level;
  };

  const renderAdminBox = (admin) => {
    let boxStyle = { ...styles.adminBox };
    let icon;
    let statusText = 'En attente';

    if (admin.status === 'approved') {
      boxStyle = { ...boxStyle, ...styles.adminBoxApproved };
      icon = <CheckCircleIcon sx={styles.checkIcon} />;
      statusText = 'Validé';
    } else if (admin.status === 'rejected') {
      boxStyle = { ...boxStyle, ...styles.adminBoxRejected };
      icon = <CancelIcon sx={{ fontSize: '48px', color: '#f44336' }} />;
      statusText = 'Rejeté';
    } else {
      boxStyle = { ...boxStyle, ...styles.adminBoxPending };
      icon = <PendingIcon sx={{ fontSize: '48px', color: '#ff9800' }} />;
    }

    return (
      <Box key={admin.id || admin.moderatorId} sx={boxStyle}>
        {icon}
        <Typography sx={styles.adminName}>{admin.moderatorName}</Typography>
        <Typography variant="caption" display="block" sx={{ color: '#666', mb: 1 }}>
          {admin.role}
        </Typography>
        <Chip
          label={statusText}
          size="small"
          color={admin.status === 'approved' ? 'success' : admin.status === 'rejected' ? 'error' : 'warning'}
        />
      </Box>
    );
  };

  const renderValidationLevel = (level) => {
    const admins = getAdminsForLevel(level);
    const completed = isLevelCompleted(level);
    const active = isLevelActive(level);

    let levelStyle = { ...styles.validationLevel };
    if (completed) {
      levelStyle = { ...levelStyle, ...styles.validationLevelCompleted };
    } else if (active) {
      levelStyle = { ...levelStyle, ...styles.validationLevelActive };
    }

    let levelTitle = '';
    let requiredValidations = 0;

    if (level === 1) {
      levelTitle = 'Niveau 1 : Validation par Admin 1';
      requiredValidations = 1;
    } else if (level === 2) {
      levelTitle = 'Niveau 2 : Validation par 2 admins';
      requiredValidations = 2;
    } else if (level === 3) {
      levelTitle = 'Niveau 3 : Validation complète (3/3)';
      requiredValidations = 3;
    }

    return (
      <Box sx={levelStyle}>
        <Box sx={styles.levelHeader}>
          <Typography sx={styles.levelTitle}>{levelTitle}</Typography>
          {completed && (
            <Chip
              icon={<CheckCircleIcon />}
              label="Niveau atteint"
              color="success"
              size="small"
            />
          )}
          {active && !completed && (
            <Chip
              icon={<PendingIcon />}
              label="En cours"
              color="warning"
              size="small"
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {requiredValidations} validation{requiredValidations > 1 ? 's' : ''} requise{requiredValidations > 1 ? 's' : ''}
        </Typography>
        <Box sx={styles.adminBoxesContainer}>
          {admins.map(admin => renderAdminBox(admin))}
        </Box>
      </Box>
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      default:
        return 'En attente';
    }
  };

  if (isLoading) {
    return (
      <Paper sx={styles.container}>
        <Box sx={styles.loadingContainer}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={styles.container}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Validation visuelle progressive */}
      {showVisualValidation && (
        <Box sx={styles.visualValidationContainer}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
            Validation par la modération
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            Le livre doit être validé progressivement par les 3 administrateurs pour être publié.
          </Alert>

          {/* Niveau 1: Admin 1 */}
          {renderValidationLevel(1)}

          {/* Niveau 2: Admin 1 + 2 */}
          {renderValidationLevel(2)}

          {/* Niveau 3: Admin 1 + 2 + 3 */}
          {renderValidationLevel(3)}

          {/* Message de félicitations si tout est validé */}
          {approvedCount === 3 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                ✓ Validation complète !
              </Typography>
              <Typography variant="body2">
                Le livre a été validé par les 3 administrateurs et peut maintenant être publié.
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {/* Tableau détaillé classique */}
      <Paper sx={styles.container}>
        {showTitle && (
          <Typography variant="h6" sx={styles.title}>
            Détails de la modération
          </Typography>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Modérateur</strong></TableCell>
                <TableCell><strong>Rôle</strong></TableCell>
                <TableCell><strong>Statut</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Commentaire</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id || row.moderatorId}>
                  <TableCell>{row.moderatorName}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <span style={getStatusStyle(row.status)}>
                      {getStatusText(row.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {row.date ? new Date(row.date).toLocaleDateString('fr-FR') : '-'}
                  </TableCell>
                  <TableCell>{row.comment || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ModeratorValidationTable;
