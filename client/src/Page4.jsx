import { Link } from 'react-router-dom';

const styles = {
  container: {
    padding: '40px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#2196f3',
  },
  content: {
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '30px',
  },
  backButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'background-color 0.3s',
  }
};

function Page4() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Page 4</h1>
      <div style={styles.content}>
        <p>Contenu de la page 4 - À remplir plus tard</p>
      </div>
      <Link to="/" style={styles.backButton}>
        ← Retour à l'accueil
      </Link>
    </div>
  );
}

export default Page4;

