import React, { useState, useEffect } from 'react';
import {
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
import PendingIcon from '@mui/icons-material/Pending';

const styles = {
  validationContainer: {
    marginBottom: '32px',
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
  pendingIcon: {
    fontSize: '48px',
    color: '#ff9800',
  },
};

function ModeratorValidationTable({ bookId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moderationData, setModerationData] = useState(null);

  useEffect(() => {
    const fetchModerationData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/documents/${bookId}`);

        if (!response.ok) {
          throw new Error('Impossible de charger les données de modération');
        }

        const data = await response.json();

        // Extraire les données de modération
        const moderation = {
          status: data.moderation?.approval_process?.status || 'WAITING',
          approvedBy: data.moderation?.approved_by || [],
          date: data.moderation?.approval_process?.date || null,
        };

        setModerationData(moderation);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement de la modération:', err);
        setError(err.message);
        // Données de secours
        setModerationData({
          status: 'WAITING',
          approvedBy: [],
          date: null,
        });
      } finally {
        setLoading(false);
      }
    };

    if (bookId) {
      fetchModerationData();
    }
  }, [bookId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <CircularProgress />
        <Typography sx={{ marginLeft: 2 }}>Chargement des validations...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ marginBottom: 2 }}>
        Erreur: {error}
      </Alert>
    );
  }

  const approvalCount = moderationData?.approvedBy?.length || 0;
  const needsApprovals = 3 - approvalCount;

  // Créer les 3 slots de modérateurs
  const moderatorSlots = [
    moderationData?.approvedBy[0] || null,
    moderationData?.approvedBy[1] || null,
    moderationData?.approvedBy[2] || null,
  ];

  const getStatusColor = () => {
    if (moderationData?.status === 'IN_QUARANTINE' || approvalCount === 3) return 'success';
    if (moderationData?.status === 'WAITING' && approvalCount > 0) return 'warning';
    return 'default';
  };

  const getStatusLabel = () => {
    if (approvalCount === 3 || moderationData?.status === 'IN_QUARANTINE') {
      return '✓ Validé par 3 modérateurs - Prêt pour publication';
    }
    if (approvalCount > 0) {
      return `${approvalCount}/3 validations - ${needsApprovals} restante(s)`;
    }
    return 'En attente de validation';
  };

  return (
    <Box sx={styles.validationContainer}>
      {/* En-tête avec statut global */}
      <Box sx={{ marginBottom: 3 }}>
        <Chip
          label={getStatusLabel()}
          color={getStatusColor()}
          size="large"
          sx={{ fontSize: '16px', padding: '20px 12px', fontWeight: 'bold' }}
        />
      </Box>

      {/* Affichage visuel des 3 modérateurs */}
      <Box
        sx={{
          ...styles.validationLevel,
          ...(approvalCount === 3 ? styles.validationLevelCompleted : {}),
          ...(approvalCount > 0 && approvalCount < 3 ? styles.validationLevelActive : {}),
        }}
      >
        <Box sx={styles.levelHeader}>
          <Typography variant="h6" sx={styles.levelTitle}>
            Validation par les modérateurs ({approvalCount}/3)
          </Typography>
        </Box>

        <Box sx={styles.adminBoxesContainer}>
          {moderatorSlots.map((moderator, index) => (
            <Box
              key={index}
              sx={{
                ...styles.adminBox,
                ...(moderator ? styles.adminBoxApproved : styles.adminBoxPending),
              }}
            >
              <Typography sx={styles.adminName}>
                {moderator || `Modérateur ${index + 1}`}
              </Typography>
              {moderator ? (
                <>
                  <CheckCircleIcon sx={styles.checkIcon} />
                  <Typography variant="body2" sx={{ marginTop: 1, color: '#4caf50' }}>
                    ✓ Validé
                  </Typography>
                </>
              ) : (
                <>
                  <PendingIcon sx={styles.pendingIcon} />
                  <Typography variant="body2" sx={{ marginTop: 1, color: '#ff9800' }}>
                    En attente
                  </Typography>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tableau récapitulatif */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Modérateur</strong></TableCell>
              <TableCell><strong>Statut</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moderatorSlots.map((moderator, index) => (
              <TableRow key={index}>
                <TableCell>{moderator || `Modérateur ${index + 1}`}</TableCell>
                <TableCell>
                  <Chip
                    label={moderator ? 'Validé' : 'En attente'}
                    color={moderator ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {moderator && moderationData?.date
                    ? new Date(moderationData.date).toLocaleDateString('fr-FR')
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Message de statut final */}
      {approvalCount === 3 && (
        <Alert severity="success" sx={{ marginTop: 2 }}>
          🎉 Ce livre a été validé par 3 modérateurs et est disponible pour tous les utilisateurs !
        </Alert>
      )}
      {approvalCount > 0 && approvalCount < 3 && (
        <Alert severity="info" sx={{ marginTop: 2 }}>
          ℹ️ Ce livre a besoin de {needsApprovals} validation(s) supplémentaire(s) pour être publié.
        </Alert>
      )}
      {approvalCount === 0 && (
        <Alert severity="warning" sx={{ marginTop: 2 }}>
          ⏳ Ce livre est en attente de sa première validation.
        </Alert>
      )}
    </Box>
  );
}

export default ModeratorValidationTable;

