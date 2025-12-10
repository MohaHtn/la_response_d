import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import { API_CONFIG, STORAGE_KEYS, ROUTES, MESSAGES, USER_TYPES } from "./constants/index.js";

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    padding: '32px',
    boxSizing: 'border-box',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    maxWidth: '100%',
    overflowX: 'hidden',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginTop: '48px',
    marginBottom: '18px',
    color: '#0d47a1',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#333',
  },
  startedContainer: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f4f6fb',
    marginBottom: '28px',
  },
  startedCard: {
    minWidth: '220px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '12px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  coverPlaceholder: {
    width: '56px',
    height: '80px',
    backgroundColor: '#e0e7ff',
    borderRadius: '4px',
    flexShrink: 0,
  },
  bookInfo: {
    flex: 1,
    minWidth: 0,
  },
  bookTitle: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '6px',
    color: '#0d47a1',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bookAuthor: {
    fontSize: '12px',
    color: '#666',
    marginBottom: '8px',
  },
  progressBarOuter: {
    width: '100%',
    height: '8px',
    backgroundColor: '#eee',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressBarInner: (p) => ({
    width: `${Math.max(0, Math.min(100, p))}%`,
    height: '100%',
    backgroundColor: '#4caf50',
  }),
  continueButton: {
    marginTop: '8px',
    display: 'inline-block',
    padding: '6px 10px',
    backgroundColor: '#1976d2',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
  },
  libraryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px',
  },
  libraryCard: {
    backgroundColor: '#fff',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minHeight: '220px',
  },
  libraryCover: {
    width: '100%',
    height: '140px',
    backgroundColor: '#e8eefb',
    borderRadius: '6px',
    objectFit: 'cover',
  },
  libraryTitle: {
    fontSize: '14px',
    fontWeight: '650',
    color: '#0d47a1',
  },
  libraryAuthor: {
    fontSize: '12px',
    color: '#666',
  },
  readButton: {
    marginTop: 'auto',
        padding: '8px 10px',
    backgroundColor: '#388e3c',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    textAlign: 'center',
    fontSize: '13px',
    flex: '1',
  },
  moderateButton: {
    marginTop: 'auto',
    padding: '8px 10px',
    backgroundColor: '#f57c00',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    textAlign: 'center',
    fontSize: '13px',
    flex: '1',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
  },
  backButton: {
    marginTop: '18px',
    padding: '8px 12px',
    fontSize: '14px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
  },
  preview: {
    fontSize: '11px',
    color: '#666',
    lineHeight: '1.4',
    marginTop: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
  },
  myDocumentsSection: {
    marginTop: '32px',
    marginBottom: '32px',
  },
  viewToggleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  viewToggleButtons: {
    display: 'flex',
    gap: '8px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '4px',
    backgroundColor: '#f9f9f9',
  },
  viewToggleButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    backgroundColor: 'transparent',
    color: '#666',
  },
  viewToggleButtonActive: {
    backgroundColor: '#2196f3',
    color: 'white',
    boxShadow: '0 2px 4px rgba(33,150,243,0.3)',
  },
  libraryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  libraryListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    transition: 'box-shadow 0.2s',
    cursor: 'pointer',
  },
  libraryListItemHover: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  listCover: {
    width: '80px',
    height: '112px',
    backgroundColor: '#e8eefb',
    borderRadius: '6px',
    flexShrink: 0,
    objectFit: 'cover',
  },
  listContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    minWidth: 0, // Important pour le text-overflow
  },
  listTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0d47a1',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  listAuthor: {
    fontSize: '14px',
    color: '#666',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  listPreview: {
    fontSize: '13px',
    color: '#888',
    lineHeight: '1.5',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  listActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },
  listButton: {
    padding: '8px 16px',
    backgroundColor: '#388e3c',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
  },
  listButtonModerate: {
    backgroundColor: '#f57c00',
  },
  listStatusBadge: {
    fontSize: '11px',
    padding: '4px 8px',
    borderRadius: '4px',
    fontWeight: '500',
  },
  // Pagination
  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginTop: '12px',
  },
  paginationInfo: {
    fontSize: '13px',
    color: '#666',
  },
  paginationButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  paginationButton: {
    padding: '6px 10px',
    fontSize: '13px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  paginationButtonDisabled: {
    backgroundColor: '#b0bec5',
    cursor: 'not-allowed',
  }
};

function Home() {
  const [library, setLibrary] = useState([]);
  const [started, setStarted] = useState([]);
  const [myDocuments, setMyDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    // Initialiser depuis localStorage ou défaut 'grid'
    return localStorage.getItem('libraryViewMode') || 'grid';
  });
  const [pageAll, setPageAll] = useState(1);
  const [pageMy, setPageMy] = useState(1);

  // Helper pour factoriser la transformation des documents API en livres UI
  const mapDocumentsToBooks = (documentsArray) => (
    Array.isArray(documentsArray)
      ? documentsArray.map(doc => ({
          id: doc.document_id,
          title: doc.metadata?.title || 'Sans titre',
          author: doc.metadata?.author || 'Auteur inconnu',
          status: doc.moderation?.approval_process?.status || 'unknown',
          preview: doc.preview || '',
          uploadedAt: doc.uploader?.upload_date || null,
          uploaderName: doc.uploader?.username || null,
          coverImage: doc.cover_image || null
        }))
      : []
  );

  // Sauvegarder le mode de vue dans localStorage quand il change
  useEffect(() => {
    localStorage.setItem('libraryViewMode', viewMode);
  }, [viewMode]);

  // Réinitialiser la page lors d'un changement de vue
  useEffect(() => {
    setPageAll(1);
    setPageMy(1);
  }, [viewMode]);

  // Réinitialiser/clamp la pagination lorsque les données changent
  useEffect(() => {
    setPageAll(1);
  }, [library.length]);

  useEffect(() => {
    setPageMy(1);
  }, [myDocuments.length]);

  useEffect(() => {
    // Récupérer le nom d'utilisateur et le rôle depuis localStorage
    const storedUsername = localStorage.getItem(STORAGE_KEYS.USERNAME);
    const storedRole = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
    setUsername(storedUsername || '');
    setUserRole(storedRole || '');

    // Récupérer tous les documents depuis l'API
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENTS_LIST}`);

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des documents');
        }

        const data = await response.json();

        const documentsArray = data.data || [];
        const books = mapDocumentsToBooks(documentsArray);
        // Trier côté client par date d'upload décroissante (sécurité au cas où l'API ne le ferait pas)
        books.sort((a, b) => {
          const da = a.uploadedAt ? Date.parse(a.uploadedAt) : 0;
          const db = b.uploadedAt ? Date.parse(b.uploadedAt) : 0;
          return db - da;
        });

        setLibrary(books);

        // TODO: Récupérer la progression depuis localStorage ou une API dédiée
        const savedProgress = JSON.parse(localStorage.getItem('readingProgress') || '[]');
        setStarted(savedProgress);

        setError(null);
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Récupérer les documents uploadés par l'utilisateur
    const fetchMyDocuments = async () => {
      if (!storedUsername) return;

      try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENTS_LIST}?uploader=${storedUsername}`);

        if (!response.ok) {
          console.error('Erreur lors de la récupération des documents uploadés');
          return;
        }

        const data = await response.json();
        const documentsArray = data.data || [];
        const myBooks = mapDocumentsToBooks(documentsArray);
        myBooks.sort((a, b) => {
          const da = a.uploadedAt ? Date.parse(a.uploadedAt) : 0;
          const db = b.uploadedAt ? Date.parse(b.uploadedAt) : 0;
          return db - da;
        });

        setMyDocuments(myBooks);
      } catch (err) {
        console.error('Erreur lors de la récupération des documents uploadés:', err);
      }
    };

    fetchDocuments();
    fetchMyDocuments();
  }, []);

  const startedBooks = started
    .map((s) => ({ ...s, ...library.find((b) => b.id === s.bookId) }))
    .filter(Boolean);

  // Pagination — calculs dérivés
  const pageSizeAll = viewMode === 'grid' ? 12 : 8;
  const totalPagesAll = Math.max(1, Math.ceil(library.length / pageSizeAll));
  const safePageAll = Math.min(pageAll, totalPagesAll);
  const pagedLibrary = library.slice((safePageAll - 1) * pageSizeAll, safePageAll * pageSizeAll);

  const pageSizeMy = viewMode === 'grid' ? 12 : 8;
  const totalPagesMy = Math.max(1, Math.ceil(myDocuments.length / pageSizeMy));
  const safePageMy = Math.min(pageMy, totalPagesMy);
  const pagedMyDocuments = myDocuments.slice((safePageMy - 1) * pageSizeMy, safePageMy * pageSizeMy);

  return (
    <div style={{minHeight: '100vh', overflowX: 'hidden'}}>
      <Header />
      <div style={{paddingTop: '64px', overflowX: 'hidden'}}>
        <div style={styles.container}>
          <div style={styles.viewToggleContainer}>
            <h1 style={styles.title}>Bibliothèque — Accueil</h1>
            <div style={styles.viewToggleButtons}>
              <button
                style={{
                  ...styles.viewToggleButton,
                  ...(viewMode === 'grid' ? styles.viewToggleButtonActive : {})
                }}
                onClick={() => setViewMode('grid')}
                title="Vue en grille"
              >
                ⊞ Grille
              </button>
              <button
                style={{
                  ...styles.viewToggleButton,
                  ...(viewMode === 'list' ? styles.viewToggleButtonActive : {})
                }}
                onClick={() => setViewMode('list')}
                title="Vue en liste"
              >
                ☰ Liste
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '16px',
              backgroundColor: '#ffebee',
              color: '#c62828',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              ⚠️ {error}
            </div>
          )}

          {loading && (
            <div style={{
              padding: '32px',
              textAlign: 'center',
              color: '#666'
            }}>
              Chargement des documents...
            </div>
          )}

          {/* Section Mes Documents Uploadés */}
          {username && myDocuments.length > 0 && (
            <div style={styles.myDocumentsSection}>
              <div style={styles.sectionTitle}>📤 Mes documents uploadés ({myDocuments.length})</div>

              {viewMode === 'grid' ? (
                <div style={styles.libraryGrid}>
                  {pagedMyDocuments.map((book) => (
                    <div key={book.id} style={styles.libraryCard}>
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={`Couverture de ${book.title}`}
                          style={styles.libraryCover}
                        />
                      ) : (
                        <div style={styles.libraryCover} role="img" aria-label={`Couverture de ${book.title}`} />
                      )}
                      <div>
                        <div style={styles.libraryTitle}>{book.title}</div>
                        <div style={styles.libraryAuthor}>{book.author}</div>
                        {book.preview && (
                          <div style={styles.preview}>
                            {book.preview}
                          </div>
                        )}
                        {book.uploadedAt && (
                          <div style={{ fontSize: '10px', color: '#999', marginTop: '6px' }}>
                            Uploadé le {new Date(book.uploadedAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                      <div style={styles.buttonContainer}>
                        <Link to={ROUTES.BOOK(book.id)} style={styles.readButton}>
                          Lire
                        </Link>
                        {userRole === USER_TYPES.ADMIN && (
                          <Link to={ROUTES.MODERATION(book.id)} style={styles.moderateButton}>
                            Modérer
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={styles.libraryList}>
                  {pagedMyDocuments.map((book) => (
                    <div
                      key={book.id}
                      style={styles.libraryListItem}
                      onMouseEnter={(e) => {
                        Object.assign(e.currentTarget.style, styles.libraryListItemHover);
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = styles.libraryListItem.boxShadow;
                      }}
                    >
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={`Couverture de ${book.title}`}
                          style={styles.listCover}
                        />
                      ) : (
                        <div style={styles.listCover} role="img" aria-label={`Couverture de ${book.title}`} />
                      )}
                      <div style={styles.listContent}>
                        <div style={styles.listTitle}>{book.title}</div>
                        <div style={styles.listAuthor}>{book.author}</div>
                        {book.preview && (
                          <div style={styles.listPreview}>
                            {book.preview}
                          </div>
                        )}
                        {book.uploadedAt && (
                          <div style={{ fontSize: '11px', color: '#999', marginTop: 'auto' }}>
                            📅 Uploadé le {new Date(book.uploadedAt).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                      <div style={styles.listActions}>
                        <Link to={ROUTES.BOOK(book.id)} style={styles.listButton}>
                          Lire
                        </Link>
                        {userRole === USER_TYPES.ADMIN && (
                          <Link
                            to={ROUTES.MODERATION(book.id)}
                            style={{...styles.listButton, ...styles.listButtonModerate}}
                          >
                            Modérer
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Pagination – Mes documents */}
              {myDocuments.length > 0 && (
                <div style={styles.paginationContainer}>
                  <div style={styles.paginationInfo}>
                    Page {safePageMy} / {Math.max(1, totalPagesMy)} — {myDocuments.length} éléments
                  </div>
                  <div style={styles.paginationButtons}>
                    <button
                      style={{
                        ...styles.paginationButton,
                        ...(safePageMy <= 1 ? styles.paginationButtonDisabled : {}),
                      }}
                      onClick={() => safePageMy > 1 && setPageMy(safePageMy - 1)}
                      disabled={safePageMy <= 1}
                    >
                      ← Précédent
                    </button>
                    <button
                      style={{
                        ...styles.paginationButton,
                        ...(safePageMy >= totalPagesMy ? styles.paginationButtonDisabled : {}),
                      }}
                      onClick={() => safePageMy < totalPagesMy && setPageMy(safePageMy + 1)}
                      disabled={safePageMy >= totalPagesMy}
                    >
                      Suivant →
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '8px' }}>
            <div style={styles.sectionTitle}>Tous les livres</div>

            {viewMode === 'grid' ? (
              <div style={styles.libraryGrid}>
                {pagedLibrary.map((book) => (
                  <div key={book.id} style={styles.libraryCard}>
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={`Couverture de ${book.title}`}
                        style={styles.libraryCover}
                      />
                    ) : (
                      <div style={styles.libraryCover} role="img" aria-label={`Couverture de ${book.title}`} />
                    )}
                    <div>
                      <div style={styles.libraryTitle}>{book.title}</div>
                      <div style={styles.libraryAuthor}>{book.author}</div>
                      {book.preview && (
                        <div style={styles.preview}>
                          {book.preview}
                        </div>
                      )}
                      {(book.uploaderName || book.uploadedAt) && (
                        <div style={{ fontSize: '12px', color: '#777', marginTop: '100px' }}>
                          {book.uploaderName && (
                            <span>👤 Ajouté par {book.uploaderName}</span>
                          )}
                          {book.uploaderName && book.uploadedAt && ' · '}
                          {book.uploadedAt && (
                            <span>le {new Date(book.uploadedAt).toLocaleDateString('fr-FR')}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={styles.buttonContainer}>
                      <Link to={ROUTES.BOOK(book.id)} style={styles.readButton}>
                        Lire
                      </Link>
                      {userRole === USER_TYPES.ADMIN && (
                        <Link to={ROUTES.MODERATION(book.id)} style={styles.moderateButton}>
                          Modérer
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.libraryList}>
                {pagedLibrary.map((book) => (
                  <div
                    key={book.id}
                    style={styles.libraryListItem}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, styles.libraryListItemHover);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = styles.libraryListItem.boxShadow;
                    }}
                  >
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={`Couverture de ${book.title}`}
                        style={styles.listCover}
                      />
                    ) : (
                      <div style={styles.listCover} role="img" aria-label={`Couverture de ${book.title}`} />
                    )}
                    <div style={styles.listContent}>
                      <div style={styles.listTitle}>{book.title}</div>
                      <div style={styles.listAuthor}>{book.author}</div>
                      {book.preview && (
                        <div style={styles.listPreview}>
                          {book.preview}
                        </div>
                      )}
                      {(book.uploaderName || book.uploadedAt) && (
                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                          {book.uploaderName && (
                            <span>👤 {book.uploaderName}</span>
                          )}
                          {book.uploaderName && book.uploadedAt && ' · '}
                          {book.uploadedAt && (
                            <span>📅 {new Date(book.uploadedAt).toLocaleDateString('fr-FR')}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={styles.listActions}>
                      <Link to={ROUTES.BOOK(book.id)} style={styles.listButton}>
                        Lire
                      </Link>
                      {userRole === USER_TYPES.ADMIN && (
                        <Link
                          to={ROUTES.MODERATION(book.id)}
                          style={{...styles.listButton, ...styles.listButtonModerate}}
                        >
                          Modérer
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination – Tous les livres */}
            {library.length > 0 && (
              <div style={styles.paginationContainer}>
                <div style={styles.paginationInfo}>
                  Page {safePageAll} / {Math.max(1, totalPagesAll)} — {library.length} éléments
                </div>
                <div style={styles.paginationButtons}>
                  <button
                    style={{
                      ...styles.paginationButton,
                      ...(safePageAll <= 1 ? styles.paginationButtonDisabled : {}),
                    }}
                    onClick={() => safePageAll > 1 && setPageAll(safePageAll - 1)}
                    disabled={safePageAll <= 1}
                  >
                    ← Précédent
                  </button>
                  <button
                    style={{
                      ...styles.paginationButton,
                      ...(safePageAll >= totalPagesAll ? styles.paginationButtonDisabled : {}),
                    }}
                    onClick={() => safePageAll < totalPagesAll && setPageAll(safePageAll + 1)}
                    disabled={safePageAll >= totalPagesAll}
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <Link to={ROUTES.PRESENTATION} style={styles.backButton}>← Retour</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
