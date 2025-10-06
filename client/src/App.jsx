import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // Import des styles KaTeX

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
  },
  markdownContainer: {
    marginTop: '30px',
    textAlign: 'left',
    maxWidth: '90%',
    margin: '30px auto',
  },
  markdownDocument: {
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  markdownContent: {
    lineHeight: '1.8',
    fontSize: '16px',
    color: '#333',
    maxHeight: 'none',
    overflow: 'visible',
  },
  downloadButton: {
    marginTop: '20px',
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  downloadButtonHover: {
    backgroundColor: '#218838',
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
  const [mergedMarkdown, setMergedMarkdown] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fonction pour déclencher l'ouverture du gestionnaire de fichiers
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Fonction pour télécharger le markdown fusionné
  const downloadMarkdown = () => {
    if (!mergedMarkdown) return;

    const blob = new Blob([mergedMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFile?.name?.replace('.pdf', '') || 'document'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  // Extrait et fusionne le markdown de toutes les pages
  const extractAndMergeMarkdown = (result) => {
    if (!result) return "";

    const pages = result.pages || [];
    let mergedContent = "";

    pages.forEach((page, pageIdx) => {
      if (page.markdown) {
        // Ajouter un séparateur de page (sauf pour la première page)
        if (pageIdx > 0) {
          mergedContent += "\n\n---\n\n";
        }

        // Optionnel: ajouter un en-tête de page
        // mergedContent += `# Page ${pageIdx + 1}\n\n`;

        mergedContent += page.markdown;
      }
    });

    return mergedContent;
  };

  // Fonction appelée quand un fichier est sélectionné
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setMessage(`Fichier sélectionné : ${file.name}`);
        setImages([]);
        setMergedMarkdown("");
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
            // Affiche un résumé texte et extrait les images et le markdown fusionné
            try {
              const imgs = extractImagesFromResult(result);
              setImages(imgs);

              const markdown = extractAndMergeMarkdown(result);
              setMergedMarkdown(markdown);
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

        {mergedMarkdown && !isLoading && (
          <div style={styles.markdownContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2>Document Markdown</h2>
              <button
                onClick={downloadMarkdown}
                style={styles.downloadButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = styles.downloadButtonHover.backgroundColor}
                onMouseLeave={(e) => e.target.style.backgroundColor = styles.downloadButton.backgroundColor}
              >
                📥 Télécharger .md
              </button>
            </div>
            <div style={styles.markdownDocument}>
              <div style={styles.markdownContent}>
                <ReactMarkdown
                  children={mergedMarkdown}
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                />
              </div>
            </div>
          </div>
        )}

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
