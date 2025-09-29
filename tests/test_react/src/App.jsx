import { useState, useRef } from 'react';

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
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  message: {
    marginTop: '20px',
    fontSize: '18px',
  },
  fileInput: {
    display: 'none', // Cache l'input natif
  },
};

function App() {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Fonction pour déclencher l'ouverture du gestionnaire de fichiers
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Fonction appelée quand un fichier est sélectionné
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
      fetch("http://localhost:8000/api/send-book", {
          method: "POST",
          body: (() => {
              const formData = new FormData();
              formData.append('file', file);
              return formData;
          })(),
      })
          .then(async (response) => {
              if (!response.ok) {
                  const error = await response.json();
                  setMessage(`Erreur serveur : ${error.detail}`);
              } else {
                  const result = await response.json();
                  setMessage(`Réponse OCR : ${JSON.stringify(result)}`);
              }
          })
          .catch((err) => setMessage(`Erreur réseau : ${err}`));

        setMessage(`Fichier sélectionné : ${file.name}`);
      } else {
        setMessage("Erreur : Veuillez sélectionner un fichier PDF.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1>Sélectionner un PDF</h1>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={styles.fileInput}
      />
      <button
        onClick={handleButtonClick}
        style={styles.button}
        onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
      >
        Sélectionner un PDF
      </button>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

export default App;
