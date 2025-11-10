import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Header from './components/Header';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  appBar: {
    backgroundColor: '#2196f3',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
  },
  toolbar: {
    width: '100%',
    display: 'flex',
    padding: '0',
  },
  toolbarContent: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginLeft: '20px',
  },
  iconButton: {
    marginRight: '0',
  },
  mainContent: {
    width: '100%',
    marginTop: '64px',
    padding: '0 20px',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    maxWidth: '1400px',
    padding: '20px',
    boxSizing: 'border-box',
  },
  button: {
    display: 'block',
    margin: 'auto',
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
  dropZone: {
    border: '2px dashed #2196f3',
    borderRadius: '8px',
    padding: '40px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '20px',
    marginBottom: '20px',
  },
  dropZoneActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976d2',
    transform: 'scale(1.02)',
  },
  dropZoneDisabled: {
    backgroundColor: '#e0e0e0',
    borderColor: '#9e9e9e',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  dropZoneText: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '10px',
  },
  dropZoneSubtext: {
    fontSize: '14px',
    color: '#888',
  },
  uploadIcon: {
    fontSize: '48px',
    color: '#2196f3',
    marginBottom: '15px',
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
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'minmax(350px, 400px) 1fr',
    gap: '20px',
    alignItems: 'start',
    width: '100%',
    boxSizing: 'border-box',
  },
  leftColumn: {
    position: 'sticky',
    top: '84px',
    maxHeight: 'calc(100vh - 104px)',
    overflow: 'auto',
  },
  rightColumn: {
    minHeight: '400px',
  },
  markdownContainer: {
    width: '100%',
    textAlign: 'left',
  },
  markdownDocument: {
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxHeight: '800px',
    overflow: 'auto',
  },
  markdownContent: {
    lineHeight: '1.8',
    fontSize: '16px',
    color: '#333',
  },
  stickyAnalysisSection: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
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
  },
  metadataContainer: {
    marginTop: '30px',
    padding: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  metadataTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#333',
  },
  metadataItem: {
    marginBottom: '8px',
    fontSize: '14px',
  },
  metadataLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  metadataValue: {
    color: '#777',
    marginLeft: '10px',
  },
  analysisContainer: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '6px',
    fontSize: '14px',
  },
  securityAnalysis: {
    backgroundColor: '#e8f5e8',
    border: '1px solid #4caf50',
  },
  securityAnalysisWarning: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
  },
  securityAnalysisError: {
    backgroundColor: '#f8d7da',
    border: '1px solid #dc3545',
  },
  contentAnalysis: {
    backgroundColor: '#e3f2fd',
    border: '1px solid #2196f3',
  },
  contentAnalysisWarning: {
    backgroundColor: '#fff3cd',
    border: '1px solid #ffc107',
  },
  analysisTitle: {
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  analysisDetail: {
    marginBottom: '5px',
  },
  riskBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '8px',
  },
  riskLow: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  riskMedium: {
    backgroundColor: '#ff9800',
    color: 'white',
  },
  riskHigh: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  navigationButtons: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginTop: '30px',
    marginBottom: '30px',
  },
  navButton: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
    fontWeight: '500',
  },
  navButtonHover: {
    backgroundColor: '#45a049',
  }
};

// Ajouter les keyframes CSS pour l'animation de rotation
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

function Upload() {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState([]);
  const [mergedMarkdown, setMergedMarkdown] = useState("");
  const [metadata, setMetadata] = useState(null);
  const [securityAnalysis, setSecurityAnalysis] = useState(null);
  const [contentAnalysis, setContentAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Fonction pour déclencher l'ouverture du gestionnaire de fichiers
  const handleButtonClick = () => {
    if (!isLoading) {
      fileInputRef.current.click();
    }
  };

  // Gestionnaires pour le drag & drop
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isLoading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Créer un événement synthétique pour réutiliser handleFileChange
      const syntheticEvent = {
        target: {
          files: [file]
        }
      };
      handleFileChange(syntheticEvent);
    }
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
    if (!result || !result.ocr || !result.ocr.pages) return out;

    const pages = result.ocr.pages;
    pages.forEach((page, pageIdx) => {
      const imgs = page.images || [];
      imgs.forEach((img, imgIdx) => {
        let data = img.image_base64;
        if (!data) return;
        // Si ce n'est pas déjà une data URI, on préfixe
        if (!data.startsWith('data:image')) {
          data = `data:image/png;base64,${data}`;
        }
        const id = img.id || `p${pageIdx + 1}-img${imgIdx + 1}`;
        out.push({ id, src: data });
      });
    });
    return out;
  };

  // Extrait le markdown fusionné directement depuis la réponse
  const extractAndMergeMarkdown = (result) => {
    if (!result) return "";
    return result.markdown || "";
  };

  // Extrait les métadonnées du document
  const extractMetadata = (result) => {
    if (!result || !result.metadata) return null;
    return result.metadata;
  };

  // Extrait l'analyse de sécurité
  const extractSecurityAnalysis = (result) => {
    if (!result || !result.security_analysis) return null;
    return result.security_analysis;
  };

  // Extrait l'analyse de contenu
  const extractContentAnalysis = (result) => {
    if (!result || !result.content_analysis) return null;
    return result.content_analysis;
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
        setMetadata(null);
        setSecurityAnalysis(null);
        setContentAnalysis(null);
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

            try {
              // Extraction des différents éléments de la réponse
              const imgs = extractImagesFromResult(result);
              setImages(imgs);

              const markdown = extractAndMergeMarkdown(result);
              setMergedMarkdown(markdown);

              const meta = extractMetadata(result);
              setMetadata(meta);

              const security = extractSecurityAnalysis(result);
              setSecurityAnalysis(security);

              const content = extractContentAnalysis(result);
              setContentAnalysis(content);

              setMessage(`Traitement terminé (${new Date().toLocaleTimeString()})`);
            } catch (err) {
              console.error('Erreur lors de l\'extraction des données:', err);
              setMessage('Erreur lors du traitement de la réponse');
            }
          })
          .catch((err) => setMessage(`Erreur réseau : ${err}`))
          .finally(() => setIsLoading(false));
      } else {
        setMessage("Erreur : Veuillez sélectionner un fichier PDF.");
      }
    }
  };

  return (
    <div style={styles.root}>
        <Header />
      <style>{spinAnimation}</style>
      <div style={styles.mainContent}>
        <div style={{...styles.container, margin: '0 auto'}}>
            <h1 style={{ textAlign: 'left' }}>Envoyer un document</h1>

          {!mergedMarkdown && (
            <p>Vous pouvez déposer un document en glissant-déposant le fichier dans l'espace ci-dessous, ou cliquer dessus
            pour sélectionner votre document.</p>
          )}

          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={styles.fileInput}
            disabled={isLoading}
          />

          {!mergedMarkdown && (
            <div
              onClick={handleButtonClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                ...styles.dropZone,
                ...(isDragging ? styles.dropZoneActive : {}),
                ...(isLoading ? styles.dropZoneDisabled : {})
              }}
            >
              <div style={styles.uploadIcon}>📄</div>
              <div style={styles.dropZoneText}>
                {isLoading
                  ? 'Traitement en cours...'
                  : isDragging
                    ? 'Déposez le fichier ici'
                    : 'Glissez-déposez un PDF ici'}
              </div>
              <div style={styles.dropZoneSubtext}>
                {!isLoading && 'ou cliquez pour sélectionner un fichier'}
              </div>
            </div>
          )}

          {isLoading && (
            <div style={styles.loadingContainer}>
              <div style={styles.loader}></div>
              <div style={styles.loadingText}>
                Traitement du PDF en cours...
              </div>
            </div>
          )}

          {message && !isLoading && <p style={styles.message}>{message}</p>}

          {(securityAnalysis || contentAnalysis || metadata || mergedMarkdown) && !isLoading && (
            <div style={styles.gridContainer}>
              {/* Colonne de gauche : Analyses */}
              <div style={styles.leftColumn}>
                <div style={styles.stickyAnalysisSection}>
                  {metadata && (
                    <div style={styles.metadataContainer}>
                      <div style={styles.metadataTitle}>📋 Métadonnées du document</div>
                      <div style={styles.metadataItem}>
                        <span style={styles.metadataLabel}>Titre:</span>
                        <span style={styles.metadataValue}>{metadata.title || 'Non spécifié'}</span>
                      </div>
                      <div style={styles.metadataItem}>
                        <span style={styles.metadataLabel}>Auteur:</span>
                        <span style={styles.metadataValue}>{metadata.author || 'Non spécifié'}</span>
                      </div>
                      <div style={styles.metadataItem}>
                        <span style={styles.metadataLabel}>Date:</span>
                        <span style={styles.metadataValue}>{metadata.date || 'Non spécifiée'}</span>
                      </div>
                      <div style={styles.metadataItem}>
                        <span style={styles.metadataLabel}>Éditeur:</span>
                        <span style={styles.metadataValue}>{metadata.publisher || 'Non spécifié'}</span>
                      </div>
                      {metadata.description && (
                        <div style={styles.metadataItem}>
                          <span style={styles.metadataLabel}>Description:</span>
                          <span style={styles.metadataValue}>{metadata.description}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {securityAnalysis && (
                    <div style={{
                      ...styles.analysisContainer,
                      ...(securityAnalysis.risk_level === 'high' ? styles.securityAnalysisError :
                          securityAnalysis.risk_level === 'medium' ? styles.securityAnalysisWarning :
                          styles.securityAnalysis)
                    }}>
                      <div style={styles.analysisTitle}>
                        🔒 Analyse de sécurité
                        <span style={{
                          ...styles.riskBadge,
                          ...(securityAnalysis.risk_level === 'high' ? styles.riskHigh :
                              securityAnalysis.risk_level === 'medium' ? styles.riskMedium :
                              styles.riskLow)
                        }}>
                          {securityAnalysis.risk_level?.toUpperCase() || 'INCONNU'}
                        </span>
                      </div>
                      <div style={styles.analysisDetail}>
                        <span style={styles.metadataLabel}>Prompts de sécurité détectés:</span>
                        <span style={styles.metadataValue}>
                          {securityAnalysis.has_security_prompts ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      {securityAnalysis.detected_prompts && securityAnalysis.detected_prompts.length > 0 && (
                        <div style={styles.analysisDetail}>
                          <span style={styles.metadataLabel}>Prompts détectés:</span>
                          <span style={styles.metadataValue}>
                            {securityAnalysis.detected_prompts.join(', ')}
                          </span>
                        </div>
                      )}
                      <div style={styles.analysisDetail}>
                        <span style={styles.metadataLabel}>Détails:</span>
                        <span style={styles.metadataValue}>{securityAnalysis.details}</span>
                      </div>
                    </div>
                  )}

                  {contentAnalysis && (
                    <div style={{
                      ...styles.analysisContainer,
                      ...(contentAnalysis.severity === 'high' ? styles.contentAnalysisWarning :
                          styles.contentAnalysis)
                    }}>
                      <div style={styles.analysisTitle}>
                        📖 Analyse de contenu inapproprié
                        <span style={{
                          ...styles.riskBadge,
                          ...(contentAnalysis.severity === 'high' ? styles.riskHigh :
                              contentAnalysis.severity === 'medium' ? styles.riskMedium :
                              styles.riskLow)
                        }}>
                          {contentAnalysis.severity?.toUpperCase() || 'NONE'}
                        </span>
                      </div>
                      <div style={styles.analysisDetail}>
                        <span style={styles.metadataLabel}>Contenu approprié:</span>
                        <span style={styles.metadataValue}>
                          {contentAnalysis.is_appropriate ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      {contentAnalysis.content_warnings && contentAnalysis.content_warnings.length > 0 && (
                        <div style={styles.analysisDetail}>
                          <span style={styles.metadataLabel}>Avertissements:</span>
                          <span style={styles.metadataValue}>
                            {contentAnalysis.content_warnings.join(', ')}
                          </span>
                        </div>
                      )}
                      <div style={styles.analysisDetail}>
                        <span style={styles.metadataLabel}>Détails:</span>
                        <span style={styles.metadataValue}>{contentAnalysis.details}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Colonne de droite : Document Markdown */}
              {mergedMarkdown && (
                <div style={styles.rightColumn}>
                  <div style={styles.markdownContainer}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h2>Aperçu du document en Markdown</h2>
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
                </div>
              )}
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
      </div>
    </div>
  );
}

export default Upload;
