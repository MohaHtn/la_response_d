import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { MODERATION_ACTIONS, ROUTES } from '../constants';
import { moderationService } from '../services/moderation.service';
import { colors, spacing, radii } from '../styles/tokens';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    padding: spacing.xl,
    // espace supérieur pour le Header fixé (évite que les boutons soient masqués)
    paddingTop: '92px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    // réduit l'espace vertical ici car le container gère déjà le padding top
    marginTop: '16px',
    marginBottom: '16px',
    color: '#0d47a1',
  },
  help: {
    fontSize: '13px',
    color: colors.muted,
    marginBottom: '16px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
    padding: spacing.md,
    display: 'flex',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  cover: {
    width: '90px',
    height: '124px',
    backgroundColor: '#e8eefb',
    borderRadius: radii.sm,
    objectFit: 'cover',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  bookTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#0d47a1',
    marginBottom: '4px',
  },
  bookMeta: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '8px',
  },
  preview: {
    fontSize: '12px',
    color: '#555',
    lineHeight: 1.5,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    marginBottom: '8px',
  },
  issues: {
    fontSize: '12px',
    color: '#a13b00',
    backgroundColor: '#fff3e0',
    padding: spacing.xs,
    borderRadius: radii.sm,
    marginBottom: spacing.sm,
  },
  actions: {
    display: 'flex',
    gap: spacing.xs,
  },
  btnApprove: {
    padding: '8px 12px',
    backgroundColor: '#2e7d32',
    color: 'white',
    borderRadius: radii.sm,
    border: 'none',
    cursor: 'pointer',
  },
  btnReject: {
    padding: '8px 12px',
    backgroundColor: '#c62828',
    color: 'white',
    borderRadius: radii.sm,
    border: 'none',
    cursor: 'pointer',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  refreshBtn: {
    padding: '6px 10px',
    backgroundColor: '#1976d2',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
  }
};

export default function QuarantinePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const documents = await moderationService.getQuarantineList();
      setDocs(Array.isArray(documents) ? documents : []);
    } catch (e) {
      setError(e?.message || '');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  async function moderate(document_id, action) {
    try {
      setBusyId(document_id + ':' + action);
      await moderationService.moderateQuarantine(document_id, action);
      await fetchDocs();
    } catch (e) {
      setError(e?.message || '');
    } finally {
      setBusyId('');
    }
  }

  return (
    <div style={{minHeight: '100vh'}}>
      <Header />
      <div style={styles.container}>
        {/* Bouton retour */}
        <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: radii.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>←</span> {t('quarantine.backToLibrary')}
          </button>

          <button
            onClick={() => navigate(ROUTES.ADMIN)}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: radii.sm,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>←</span> {t("quarantine.backToAdmin")}
          </button>
        </div>

        <div style={styles.toolbar}>
          <h1 style={styles.title}>{t('quarantine.title')}</h1>
          <button onClick={fetchDocs} style={styles.refreshBtn}>{t('quarantine.refresh')}</button>
        </div>
        <div style={styles.help}>{t('quarantine.help')}</div>

        {error && (
          <div style={{padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '12px'}}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{padding: '24px', color: '#666'}}>{t('loading.generic')}</div>
        ) : (
          <div style={styles.list}>
            {docs.length === 0 && (
              <div style={{padding: '12px', color: '#666'}}>{t('quarantine.none')}</div>
            )}
            {docs.map((doc) => {
              const id = doc?.document_id || doc?.id || '';
              const title = doc?.metadata?.title || t('quarantine.untitled');
              const author = doc?.metadata?.author || t('quarantine.unknownAuthor');
              const preview = doc?.preview || '';
              const cover = doc?.cover_image || '';
              const issues = (doc?.compliance_issues && doc.compliance_issues.length)
                ? doc.compliance_issues.join('; ')
                : (doc?.moderation?.approval_process?.details || '');

              return (
                <div key={id} style={styles.card}>
                  {cover ? (
                    <img src={cover} alt={t('quarantine.coverOf', { title })} style={styles.cover}/>
                  ) : (
                    <div role="img" aria-label={t('quarantine.coverOf', { title })} style={styles.cover} />
                  )}
                  <div style={styles.content}>
                    <Link to={ROUTES.MODERATION(encodeURIComponent(id))} style={styles.bookTitle}>{title}</Link>
                    <div style={styles.bookMeta}>{t('quarantine.by')} {author} — id: {id}</div>
                    {preview && <div style={styles.preview}>{preview}</div>}
                    {issues && <div style={styles.issues}>{t('quarantine.issues')} {issues}</div>}
                    <div style={styles.actions}>
                      <button
                        style={styles.btnApprove}
                        disabled={!id}
                        onClick={() => navigate(ROUTES.MODERATION(encodeURIComponent(id)))}
                      >✅ {t('quarantine.approve')}</button>
                      <button
                        style={styles.btnReject}
                        disabled={!id || busyId === id+':reject'}
                        onClick={() => moderate(id, MODERATION_ACTIONS.REJECT)}
                      >🗑️ {t('quarantine.reject')}</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
