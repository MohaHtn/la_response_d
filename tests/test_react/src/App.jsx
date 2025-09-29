import { useState } from 'react';

// Styles centralisés
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s', // Animation au survol
  },
  buttonHover: {
    backgroundColor: '#0056b3', // Couleur au survol
  },
  message: {
    marginTop: '20px',
    fontSize: '18px',
  },
};

// Composant Bouton réutilisable
const Button = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      style={isHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

// Composant principal
function App() {
  const [message, setMessage] = useState("");

  // Fonction appelée quand on clique sur le bouton
  const handleClick = () => {
    setMessage("Bouton cliqué ! 🎉");
  };

  return (
    <div style={styles.container}>
      <h1>Mon App React + Python</h1>
      <Button onClick={handleClick}>Clique-moi !</Button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

export default App;
