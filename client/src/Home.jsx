import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import { API_CONFIG, STORAGE_KEYS, ROUTES, MESSAGES, USER_TYPES } from "./constants/index.js";
import { getCommonHeaders } from './utils/http';
import { useTranslation } from 'react-i18next';
import { homeStyles as styles } from './styles/HomeStyles.js';

function Home() {
  const { t } = useTranslation();
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
          title: doc.metadata?.title || t('quarantine.untitled'),
          author: doc.metadata?.author || t('quarantine.unknownAuthor'),
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
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENTS_LIST}`, {
          headers: getCommonHeaders({ skipAuth: true })
        });

        if (!response.ok) {
          throw new Error(t('errors.prefix'));
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
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENTS_LIST}?uploader=${storedUsername}`, {
          headers: getCommonHeaders({ skipAuth: true })
        });

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
            <h1 style={styles.title}>{t('home.title')}</h1>
            <div style={styles.viewToggleButtons}>
              <button
                style={{
                  ...styles.viewToggleButton,
                  ...(viewMode === 'grid' ? styles.viewToggleButtonActive : {})
                }}
                onClick={() => setViewMode('grid')}
                title={t('home.view.gridTitle')}
              >
                ⊞ {t('home.view.grid')}
              </button>
              <button
                style={{
                  ...styles.viewToggleButton,
                  ...(viewMode === 'list' ? styles.viewToggleButtonActive : {})
                }}
                onClick={() => setViewMode('list')}
                title={t('home.view.listTitle')}
              >
                ☰ {t('home.view.list')}
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
              {t('home.loadingDocuments')}
            </div>
          )}

          {/* Section Mes Documents Uploadés */}
          {username && myDocuments.length > 0 && (
            <div style={styles.myDocumentsSection}>
              <div style={styles.sectionTitle}>{t('home.myUploads.title', { count: myDocuments.length })}</div>

              {viewMode === 'grid' ? (
                <div style={styles.libraryGrid}>
                  {pagedMyDocuments.map((book) => (
                    <div key={book.id} style={styles.libraryCard}>
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={t('home.coverOf', { title: book.title })}
                          style={styles.libraryCover}
                        />
                      ) : (
                        <div style={styles.libraryCover} role="img" aria-label={t('home.coverOf', { title: book.title })} />
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
                            {t('home.uploadedOn', { date: new Date(book.uploadedAt).toLocaleDateString(undefined) })}
                          </div>
                        )}
                      </div>
                      <div style={styles.buttonContainer}>
                        <Link to={ROUTES.BOOK(book.id)} style={styles.readButton}>
                          {t('home.read')}
                        </Link>
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
                          alt={t('home.coverOf', { title: book.title })}
                          style={styles.listCover}
                        />
                      ) : (
                        <div style={styles.listCover} role="img" aria-label={t('home.coverOf', { title: book.title })} />
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
                            📅 {t('home.uploadedOn', { date: new Date(book.uploadedAt).toLocaleDateString(undefined) })}
                          </div>
                        )}
                      </div>
                      <div style={styles.listActions}>
                        <Link to={ROUTES.BOOK(book.id)} style={styles.listButton}>
                          {t('home.read')}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Pagination – Mes documents */}
              {myDocuments.length > 0 && (
                <div style={styles.paginationContainer}>
                  <div style={styles.paginationInfo}>
                    {t('home.pagination', { page: safePageMy, total: Math.max(1, totalPagesMy), count: myDocuments.length })}
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
                      {t('home.prev')}
                    </button>
                    <button
                      style={{
                        ...styles.paginationButton,
                        ...(safePageMy >= totalPagesMy ? styles.paginationButtonDisabled : {}),
                      }}
                      onClick={() => safePageMy < totalPagesMy && setPageMy(safePageMy + 1)}
                      disabled={safePageMy >= totalPagesMy}
                    >
                      {t('home.next')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginTop: '8px' }}>
            <div style={styles.sectionTitle}>{t('home.allBooks')}</div>

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
                            <span>👤 {t('home.byUploader', { name: book.uploaderName })}</span>
                          )}
                          {book.uploaderName && book.uploadedAt && ' · '}
                          {book.uploadedAt && (
                            <span>{t('home.uploadedOn', { date: new Date(book.uploadedAt).toLocaleDateString(undefined) })}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={styles.buttonContainer}>
                      <Link to={ROUTES.BOOK(book.id)} style={styles.readButton}>
                        {t('home.read')}
                      </Link>
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
                        alt={t('home.coverOf', { title: book.title })}
                        style={styles.listCover}
                      />
                    ) : (
                      <div style={styles.listCover} role="img" aria-label={t('home.coverOf', { title: book.title })} />
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
                            <span>📅 {t('home.uploadedOn', { date: new Date(book.uploadedAt).toLocaleDateString(undefined) })}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div style={styles.listActions}>
                      <Link to={ROUTES.BOOK(book.id)} style={styles.listButton}>
                        {t('home.read')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Pagination – Tous les livres */}
            {library.length > 0 && (
              <div style={styles.paginationContainer}>
                <div style={styles.paginationInfo}>
                  {t('home.pagination', { page: safePageAll, total: Math.max(1, totalPagesAll), count: library.length })}
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
                    {t('home.prev')}
                  </button>
                  <button
                    style={{
                      ...styles.paginationButton,
                      ...(safePageAll >= totalPagesAll ? styles.paginationButtonDisabled : {}),
                    }}
                    onClick={() => safePageAll < totalPagesAll && setPageAll(safePageAll + 1)}
                    disabled={safePageAll >= totalPagesAll}
                  >
                    {t('home.next')}
                  </button>
                </div>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Home;
