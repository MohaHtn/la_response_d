import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { API_CONFIG, STORAGE_KEYS, MODERATION_ACTIONS, ROUTES } from '../constants';

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    padding: '32px',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    marginTop: '64px',
    marginBottom: '16px',
    color: '#0d47a1',
  },
  help: {
    fontSize: '13px',
    color: '#555',
    marginBottom: '16px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
    padding: '16px',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  cover: {
    width: '90px',
    height: '124px',
    backgroundColor: '#e8eefb',
    borderRadius: '6px',
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
    padding: '8px',
    borderRadius: '6px',
    marginBottom: '12px',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  btnApprove: {
    padding: '8px 12px',
    backgroundColor: '#2e7d32',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  btnReject: {
    padding: '8px 12px',
    backgroundColor: '#c62828',
    color: 'white',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
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

function getToken() {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || '';
  } catch {
    return '';
  }
}

export default function QuarantinePage() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = getToken();
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = payload?.detail || payload?.message || 'Erreur serveur';
        throw new Error(msg);
      }
      // L'API renvoie { success: true, data: [...] }
      const documents = payload.data || payload.documents || [];
      setDocs(Array.isArray(documents) ? documents : []);
    } catch (e) {
      setError(e?.message || 'Erreur inconnue');
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
      const token = getToken();
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MODERATION_QUARANTINE_MODERATE(document_id)}?action=${action}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = payload?.detail || payload?.message || 'Erreur serveur';
        throw new Error(msg);
      }
      // Rafraîchir la liste
      await fetchDocs();
    } catch (e) {
      setError(e?.message || 'Erreur inconnue');
    } finally {
      setBusyId('');
    }
  }

  return (
    <div style={{minHeight: '100vh'}}>
      <Header />
      <div style={styles.container}>
        {/* Bouton retour */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>←</span> Retour à l'administration
          </button>
        </div>

        <div style={styles.toolbar}>
          <h1 style={styles.title}>📚 Livres en quarantaine</h1>
          <button onClick={fetchDocs} style={styles.refreshBtn}>Rafraîchir</button>
        </div>
        <div style={styles.help}>Cette page est réservée aux administrateurs. Vous pouvez approuver (déplacer vers la bibliothèque) ou rejeter (supprimer) les documents placés en quarantaine.</div>

        {error && (
          <div style={{padding: '12px', background: '#ffebee', color: '#c62828', borderRadius: '8px', marginBottom: '12px'}}>
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div style={{padding: '24px', color: '#666'}}>Chargement…</div>
        ) : (
          <div style={styles.list}>
            {docs.length === 0 && (
              <div style={{padding: '12px', color: '#666'}}>Aucun document en quarantaine.</div>
            )}
            {docs.map((doc) => {
              const id = doc?.document_id || doc?.id || '';
              const title = doc?.metadata?.title || 'Sans titre';
              const author = doc?.metadata?.author || 'Auteur inconnu';
              const preview = doc?.preview || '';
              const cover = doc?.cover_image || '';
              const issues = (doc?.compliance_issues && doc.compliance_issues.length)
                ? doc.compliance_issues.join('; ')
                : (doc?.moderation?.approval_process?.details || '');

              return (
                <div key={id} style={styles.card}>
                  {cover ? (
                    <img src={cover} alt={`Couverture de ${title}`} style={styles.cover}/>
                  ) : (
                    <div role="img" aria-label={`Couverture de ${title}`} style={styles.cover} />
                  )}
                  <div style={styles.content}>
                    <div style={styles.bookTitle}>{title}</div>
                    <div style={styles.bookMeta}>par {author} — id: {id}</div>
                    {preview && <div style={styles.preview}>{preview}</div>}
                    {issues && <div style={styles.issues}>Motifs: {issues}</div>}
                    <div style={styles.actions}>
                      <button
                        style={styles.btnApprove}
                        disabled={!id}
                        onClick={() => navigate(ROUTES.MODERATION(encodeURIComponent(id)))}
                      >✅ Approuver</button>
                      <button
                        style={styles.btnReject}
                        disabled={!id || busyId === id+':reject'}
                        onClick={() => moderate(id, MODERATION_ACTIONS.REJECT)}
                      >🗑️ Rejeter</button>
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
