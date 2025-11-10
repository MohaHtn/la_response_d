import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './components/Header';

const styles = {
  container: {
    // changed: full viewport size
    width: '100vw',
    minHeight: '100vh',
    padding: '32px',
    boxSizing: 'border-box',
    margin: 0,
    // center content horizontally with an inner wrapper if needed
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
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
    alignSelf: 'stretch',
    padding: '8px 10px',
    backgroundColor: '#388e3c',
    color: 'white',
    borderRadius: '6px',
    textDecoration: 'none',
    textAlign: 'center',
    fontSize: '13px',
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
  }
};

// Mock data - remplacer par un fetch réel plus tard
const MOCK_LIBRARY = [
  { id: 'b1', title: "Les Misérables", author: 'Victor Hugo' },
  { id: 'b2', title: "Le Petit Prince", author: 'Antoine de Saint-Exupéry' },
  { id: 'b3', title: 'La Recherche', author: 'Marcel Proust' },
  { id: 'b4', title: "L'Étranger", author: 'Albert Camus' },
  { id: 'b5', title: 'Candide', author: 'Voltaire' },
  { id: 'b6', title: 'Germinal', author: 'Émile Zola' },
];

const MOCK_STARTED = [
  { bookId: 'b2', progress: 34 },
  { bookId: 'b4', progress: 58 },
];

function Page3() {
  const [library, setLibrary] = useState([]);
  const [started, setStarted] = useState([]);

  useEffect(() => {
    // Simuler un fetch léger — remplacer par un appel API réel si nécessaire
    setLibrary(MOCK_LIBRARY);
    setStarted(MOCK_STARTED);
  }, []);

  const startedBooks = started
    .map((s) => ({ ...s, ...library.find((b) => b.id === s.bookId) }))
    .filter(Boolean);

  return (
    <div style={{minHeight: '100vh'}}>
      <Header />
      <div style={{paddingTop: '64px'}}>
        <div style={styles.container}>
          <h1 style={styles.title}>Bibliothèque — Accueil</h1>

          <div>
            <div style={styles.sectionTitle}>En cours de lecture</div>
            <div style={styles.startedContainer}>
              {startedBooks.length === 0 ? (
                <div style={{ color: '#666' }}>Vous n'avez pas encore commencé de livre.</div>
              ) : (
                startedBooks.map((b) => (
                  <div key={b.bookId} style={styles.startedCard}>
                    <div style={styles.coverPlaceholder} aria-hidden />
                    <div style={styles.bookInfo}>
                      <div style={styles.bookTitle}>{b.title}</div>
                      <div style={styles.bookAuthor}>{b.author}</div>
                      <div style={styles.progressBarOuter}>
                        <div style={styles.progressBarInner(b.progress)} />
                      </div>
                      <Link to="/page2" style={styles.continueButton}>Continuer</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{ marginTop: '8px' }}>
            <div style={styles.sectionTitle}>Tous les livres</div>
            <div style={styles.libraryGrid}>
              {library.map((book) => (
                <div key={book.id} style={styles.libraryCard}>
                  <div style={styles.libraryCover} role="img" aria-label={`Couverture de ${book.title}`} />
                  <div>
                    <div style={styles.libraryTitle}>{book.title}</div>
                    <div style={styles.libraryAuthor}>{book.author}</div>
                  </div>
                  <Link to="/page2" style={styles.readButton}>Lire</Link>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Link to="/" style={styles.backButton}>← Retour</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page3;
