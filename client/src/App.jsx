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
  buttonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
  message: {
    marginTop: '20px',
    fontSize: '18px',
  },
  fileInput: {
    display: 'none', // Cache l'input natif
  },
  img: {
    maxWidth: '90%',
    height: 'auto',
    marginTop: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  loader: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    margin: '20px auto',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  loadingText: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#007bff',
  }
};

// Ajouter les keyframes CSS pour l'animation de rotation
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function App() {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fonction pour déclencher l'ouverture du gestionnaire de fichiers
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Extrait et normalise les images base64 (data URI) de la réponse OCR
  const extractImagesFromResult = (result) => {
    const out = [];
    if (!result) return out;

    const pages = result.pages || [];
    pages.forEach((page, pageIdx) => {
      const imgs = page.images || [];
      imgs.forEach((img, imgIdx) => {
        let data = img.image_base64 || img.data || img.base64 || '';
        if (!data) return;
        // Si ce n'est pas déjà une data URI, on préfixe (suppose PNG par défaut)
        if (!data.startsWith('data:image')) {
          data = `data:image/png;base64,${data}`;
        }
        const id = img.id || `p${pageIdx + 1}-img${imgIdx + 1}`;
        out.push({ id, src: data });
      });
    });
    return out;
  };

  // Fonction appelée quand un fichier est sélectionné
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setMessage(`Fichier sélectionné : ${file.name}`);
        setImages([]);
        setIsLoading(true);

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
              const error = await response.json().catch(() => ({}));
              setMessage(`Erreur serveur : ${error.detail || response.statusText}`);
              return;
            }
            const result = await response.json();
            // Affiche un résumé texte et extrait les images
            try {
              const imgs = extractImagesFromResult(result);
              setImages(imgs);
            } catch (_) { /* ignore extraction errors */ }
            setMessage(`Réponse OCR reçue (${new Date().toLocaleTimeString()}).`);
          })
          .catch((err) => setMessage(`Erreur réseau : ${err}`))
          .finally(() => setIsLoading(false));
      } else {
        setMessage("Erreur : Veuillez sélectionner un fichier PDF.");
      }
    }
  };

  return (
    <>
      <style>{spinAnimation}</style>
      <div style={styles.container}>
        <h1>Sélectionner un PDF</h1>
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={styles.fileInput}
          disabled={isLoading}
        />
        <button
          onClick={handleButtonClick}
          style={{
            ...styles.button,
            ...(isLoading ? styles.buttonDisabled : {})
          }}
          disabled={isLoading}
          onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          {isLoading ? 'Traitement en cours...' : 'Sélectionner un PDF'}
        </button>

        {isLoading && (
          <div style={styles.loadingContainer}>
            <div style={styles.loader}></div>
            <div style={styles.loadingText}>
              Traitement du PDF en cours...
            </div>
          </div>
        )}

        {message && !isLoading && <p style={styles.message}>{message}</p>}
        {images && images.length > 0 && !isLoading && (
          <div>
            <h2>Aperçus des pages OCR</h2>
            {images.map((img) => (
              <div key={img.id}>
                <img src={img.src} alt={img.id} style={styles.img} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
