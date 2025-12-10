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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { STORAGE_KEYS } from '../constants';
import { moderationService } from '../services/moderation.service';
import { colors, spacing, radii, shadows } from '../styles/tokens';
import { useTranslation } from 'react-i18next';

const styles = {
  validationContainer: {
    marginBottom: spacing.xl,
  },
  validationLevel: {
    marginBottom: spacing.lg,
    padding: '20px',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    border: '2px solid #e0e0e0',
  },
  validationLevelActive: {
    border: `2px solid ${colors.success}`,
    boxShadow: shadows.successGlow,
  },
  validationLevelCompleted: {
    border: `2px solid ${colors.success}`,
    backgroundColor: '#e8f5e9',
  },
  levelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  adminBoxesContainer: {
    display: 'flex',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  adminBox: {
    flex: '1',
    minWidth: '150px',
    padding: spacing.md,
    borderRadius: radii.md,
    border: '2px solid #ddd',
    backgroundColor: colors.surface,
    textAlign: 'center',
    transition: 'all 0.3s ease',
  },
  adminBoxApproved: {
    border: `2px solid ${colors.success}`,
    backgroundColor: '#e8f5e9',
  },
  adminBoxPending: {
    border: `2px solid ${colors.warning}`,
    backgroundColor: '#fff3e0',
  },
  adminName: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  checkIcon: {
    fontSize: '48px',
    color: colors.success,
  },
  pendingIcon: {
    fontSize: '48px',
    color: colors.warning,
  },
};

function ModeratorValidationTable({ bookId }) {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moderationData, setModerationData] = useState(null);
  const [documentData, setDocumentData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [validating, setValidating] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', tags: '', content: '' });
  const username = (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEYS.USERNAME)) || '';

  // Exposé au scope du composant pour pouvoir être réutilisé dans `refresh()`
  const fetchModerationData = async () => {
    try {
      setLoading(true);
      const document = await moderationService.getQuarantineDocument(bookId);

      // Extraire les données de modération
      const moderation = {
        status: document?.moderation?.approval_process?.status || 'WAITING',
        approvedBy: document?.moderation?.approved_by || [],
        date: document?.moderation?.approval_process?.date || null,
      };

      setDocumentData(document);
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

  useEffect(() => {
    if (bookId) {
      fetchModerationData();
    }
  }, [bookId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
        <CircularProgress />
        <Typography sx={{ marginLeft: 2 }}>{t('loading.validations')}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ marginBottom: 2 }}>
        {t('errors.prefix')}: {error}
      </Alert>
    );
  }

  const approvalCount = moderationData?.approvedBy?.length || 0;
  const needsApprovals = 3 - approvalCount;
  const alreadyValidatedByUser = username && moderationData?.approvedBy?.includes(username);

  // Créer les 3 slots de modérateurs
  const moderatorSlots = [
    moderationData?.approvedBy[0] || null,
    moderationData?.approvedBy[1] || null,
    moderationData?.approvedBy[2] || null,
  ];

  const getStatusColor = () => {
    if (approvalCount === 3) return 'success';
    if (moderationData?.status === 'WAITING' && approvalCount > 0) return 'warning';
    return 'default';
  };

  const getStatusLabel = () => {
    if (approvalCount === 3) {
      return t('moderation.chip.fullyValidated');
    }
    if (approvalCount > 0) {
      return t('moderation.chip.progress', { count: approvalCount, remaining: needsApprovals });
    }
    return t('moderation.chip.waiting');
  };

  const refresh = async () => {
    try {
      await fetchModerationData();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleValidate = async () => {
    try {
      setValidating(true);
      await moderationService.validateQuarantine(bookId);
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setValidating(false);
    }
  };

  const handlePublish = async () => {
    try {
      setPublishing(true);
      await moderationService.publishQuarantine(bookId);
      // Après publication, on peut afficher un message et/ou laisser le parent rediriger
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setPublishing(false);
    }
  };

  const openEdit = () => {
    setForm({
      title: documentData?.metadata?.title || '',
      author: documentData?.metadata?.author || '',
      tags: (documentData?.metadata?.tags || []).join(', '),
      content: documentData?.content || documentData?.preview || '',
    });
    setEditOpen(true);
  };

  const saveEdit = async () => {
    try {
      setSaving(true);
      const payload = {
        metadata: {
          title: form.title,
          author: form.author,
          tags: form.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => !!t),
        },
        // On stocke le contenu édité dans `content` si présent, sinon on utilise `preview`
        ...(form.content ? { content: form.content, preview: form.content.slice(0, 240) } : {}),
      };
      await moderationService.updateQuarantine(bookId, payload);
      setEditOpen(false);
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <Box sx={styles.validationContainer}>
      {/* En-tête avec statut global */}
      <Box sx={{ marginBottom: 3 }}>
        <Chip
          label={getStatusLabel()}
          color={getStatusColor()}
          size="large"
          sx={{ fontSize: '16px', padding: '20px 12px', fontWeight: 'bold' }}
        />
        <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={validating || alreadyValidatedByUser}
            onClick={handleValidate}
          >
            {alreadyValidatedByUser ? t('actions.validated') : (validating ? t('actions.validating') : t('actions.validate'))}
          </Button>
          <Button variant="outlined" onClick={openEdit}>{t('actions.edit')}</Button>
          <Button
            variant="contained"
            color="success"
            disabled={approvalCount < 3 || publishing}
            onClick={handlePublish}
          >
            {publishing ? t('actions.publishing') : t('actions.publish')}
          </Button>
        </Box>
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
            {t('moderation.header', { count: approvalCount })}
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
                {moderator || t('moderation.table.moderatorN', { index: index + 1 })}
              </Typography>
              {moderator ? (
                <>
                  <CheckCircleIcon sx={styles.checkIcon} />
                  <Typography variant="body2" sx={{ marginTop: 1, color: '#4caf50' }}>
                    {`✓ ${t('moderation.table.validated')}`}
                  </Typography>
                </>
              ) : (
                <>
                  <PendingIcon sx={styles.pendingIcon} />
                  <Typography variant="body2" sx={{ marginTop: 1, color: '#ff9800' }}>
                    {t('moderation.table.pending')}
                  </Typography>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Tableau récapitulatif */}
      <TableContainer sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>{t('moderation.table.moderator')}</strong></TableCell>
              <TableCell><strong>{t('moderation.table.status')}</strong></TableCell>
              <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><strong>{t('moderation.table.date')}</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {moderatorSlots.map((moderator, index) => (
              <TableRow key={index}>
                <TableCell>{moderator || t('moderation.table.moderatorN', { index: index + 1 })}</TableCell>
                <TableCell>
                  <Chip
                    label={moderator ? t('moderation.table.validated') : t('moderation.table.pending')}
                    color={moderator ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                  {moderator && moderationData?.date
                    ? new Date(moderationData.date).toLocaleDateString(i18n.language || 'fr')
                    : '–'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Message de statut final */}
      {approvalCount === 3 && (
        <Alert severity="success" sx={{ marginTop: 2 }}>
          {t('moderation.alerts.fullyValidated')}
        </Alert>
      )}
      {approvalCount > 0 && approvalCount < 3 && (
        <Alert severity="info" sx={{ marginTop: 2 }}>
          {t('moderation.alerts.needsMore', { remaining: needsApprovals })}
        </Alert>
      )}
      {approvalCount === 0 && (
        <Alert severity="warning" sx={{ marginTop: 2 }}>
          {t('moderation.alerts.none')}
        </Alert>
      )}
    </Box>
    {editOpen && (
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('moderation.dialog.editTitle')}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label={t('moderation.dialog.title')}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              fullWidth
            />
            <TextField
              label={t('moderation.dialog.author')}
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
              fullWidth
            />
            <TextField
              label={t('moderation.dialog.tags')}
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              fullWidth
            />
            <TextField
              label={t('moderation.dialog.content')}
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              fullWidth
              multiline
              minRows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>{t('actions.cancel')}</Button>
          <Button variant="contained" onClick={saveEdit} disabled={saving}>
            {saving ? t('actions.saving') : t('actions.save')}
          </Button>
        </DialogActions>
      </Dialog>
    )}
    </>
  );
}

export default ModeratorValidationTable;

