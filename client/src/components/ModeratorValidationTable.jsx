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
} from '@mui/material';

const styles = {
  container: {
    padding: '24px',
    margin: '24px',
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
  },
  statusApproved: {
    backgroundColor: '#d4edda',
    padding: '6px 12px',
    borderRadius: '4px',
    color: '#155724',
  },
  statusRejected: {
    backgroundColor: '#f8d7da',
    padding: '6px 12px',
    borderRadius: '4px',
    color: '#721c24',
  },
};

// Données de test
const mockData = [
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
    date: "2025-11-10",
    comment: "En cours de vérification"
  },
  {
    id: 3,
    moderatorName: "Pierre Durand",
    role: "Expert Copyright",
    status: "rejected",
    date: "2025-11-09",
    comment: "Droits d'auteur non respectés"
  }
];

const ModeratorValidationTable = () => {
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

  return (
    <Paper sx={styles.container}>
      <Typography variant="h6" sx={styles.title}>
        État de la modération
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Modérateur</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Commentaire</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.moderatorName}</TableCell>
                <TableCell>{row.role}</TableCell>
                <TableCell>
                  <span style={getStatusStyle(row.status)}>
                    {getStatusText(row.status)}
                  </span>
                </TableCell>
                <TableCell>{new Date(row.date).toLocaleDateString('fr-FR')}</TableCell>
                <TableCell>{row.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ModeratorValidationTable;
