import { useState, useRef, useEffect } from 'react';
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
    height: 'calc(100vh - 64px)',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    width: '100%',
    maxWidth: '1400px',
    padding: '10px 20px',
    boxSizing: 'border-box',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
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
    textAlign: 'left',
    whiteSpace: 'pre-line',
  },
  fileInput: {
    display: 'none', // Cache l'input natif
  },
  dropZone: {
    border: '2px dashed #2196f3',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '10px',
    marginBottom: '10px',
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
    gridTemplateColumns: 'minmax(320px, 380px) 1fr',
    gap: '15px',
    alignItems: 'start',
    width: '100%',
    boxSizing: 'border-box',
    flex: 1,
    overflow: 'hidden',
  },
  leftColumn: {
    height: '100%',
    maxHeight: '100%',
    paddingRight: '15px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  rightColumn: {
    height: '100%',
    maxHeight: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  markdownContainer: {
    width: '100%',
    textAlign: 'left',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  markdownDocument: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flex: 1,
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
  successMessageContainer: {
    marginTop: '8px',
    marginBottom: '8px',
    padding: '10px',
    border: '1px solid #28a745',
    borderRadius: '6px',
    backgroundColor: '#d4edda',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  successMessageTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '0',
    color: '#155724',
  },
  successMessageItem: {
    fontSize: '12px',
    color: '#155724',
  },
  metadataContainer: {
    marginRight: '0',
    marginTop: '0',
    marginBottom: '10px',
    padding: '15px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  metadataTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  metadataItem: {
    marginBottom: '6px',
    fontSize: '13px',
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
    marginRight: '0',
    marginTop: '0',
    marginBottom: '10px',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '13px',
  },
  // Styles analytiques seront calculés dynamiquement pour réduire la redondance
  analysisTitle: {
    fontWeight: 'bold',
    marginBottom: '6px',
    fontSize: '14px',
  },
  analysisDetail: {
    marginBottom: '4px',
    fontSize: '12px',
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
  const [documentInfo, setDocumentInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [showPreviews, setShowPreviews] = useState(false);
  const fileInputRef = useRef(null);

  // Fonction pour déclencher l'ouverture du gestionnaire de fichiers
  const handleButtonClick = () => {
    if (!isLoading) {
      fileInputRef.current.click();
    }
  };

  // Écouteur de redimensionnement pour la réactivité
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Style d'encadré d'analyse (fusion de classes redondantes)
  const getAnalysisBoxStyle = (type, level) => {
    // type: 'security' | 'content'
    // level: security -> 'low' | 'medium' | 'high'; content -> severity idem
    let backgroundColor = '#e3f2fd';
    let borderColor = '#2196f3';

    if (type === 'security') {
      if (level === 'high') {
        backgroundColor = '#f8d7da';
        borderColor = '#dc3545';
      } else if (level === 'medium') {
        backgroundColor = '#fff3cd';
        borderColor = '#ffc107';
      } else {
        backgroundColor = '#e8f5e8';
        borderColor = '#4caf50';
      }
    } else {
      // content
      if (level === 'high') {
        backgroundColor = '#fff3cd';
        borderColor = '#ffc107';
      } else if (level === 'medium') {
        backgroundColor = '#e3f2fd';
        borderColor = '#2196f3';
      } else {
        backgroundColor = '#e8f5e8';
        borderColor = '#4caf50';
      }
    }

    return { backgroundColor, border: `1px solid ${borderColor}` };
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


        const formData = new FormData();
        formData.append('file', file);

        // Ajouter les métadonnées si disponibles
        if (metadata?.title) {
          formData.append('title', metadata.title);
        }
        if (metadata?.author) {
          formData.append('author', metadata.author);
        }

        fetch("http://localhost:8000/api/send-book", {
          method: "POST",
          headers: {'Username': localStorage.getItem('username')},
          body: formData,
        })
          .then(async (response) => {
            if (!response.ok) {
              const error = await response.json().catch(() => ({}));
              setMessage(`Erreur serveur : ${error.detail || response.statusText}`);
              return;
            }
            const result = await response.json();

            try {
              if (result.success) {
                const docInfo = result.document;
                console.log('Document créé:', docInfo);

                // Extraire le markdown (la clé correcte est "markdown", pas "ocr_result.text")
                if (result.markdown) {
                  setMergedMarkdown(result.markdown);
                }

                // Extraire les images de la structure OCR
                const imgs = extractImagesFromResult(result);
                if (imgs.length > 0) setImages(imgs);

                // Extraire les métadonnées (déjà normalisées par le backend)
                if (result.metadata) {
                  setMetadata(result.metadata);
                }

                // Extraire l'analyse de sécurité
                if (result.security_analysis) {
                  setSecurityAnalysis(result.security_analysis);
                }

                // Extraire l'analyse de contenu
                if (result.content_analysis) {
                  setContentAnalysis(result.content_analysis);
                }

                // Stocker les informations du document
                const textLength = result.markdown ? result.markdown.length : 0;
                setDocumentInfo({
                  title: docInfo.title,
                  author: docInfo.author,
                  uploader: docInfo.uploader,
                  status: docInfo.status,
                  textLength: textLength,
                  documentId: result.document_id
                });

                setMessage("✅ Document traité avec succès!");
              } else {
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
              }
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
            <h1 style={{ textAlign: 'left', fontSize: '24px', marginTop: '5px', marginBottom: '8px' }}>Envoyer un document</h1>

          {!mergedMarkdown && (
            <p style={{ fontSize: '14px', marginTop: '5px', marginBottom: '8px' }}>Vous pouvez déposer un document en glissant-déposant le fichier dans l'espace ci-dessous, ou cliquer dessus
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
          {message && !isLoading && !documentInfo && <p style={styles.message}>{message}</p>}


          {(securityAnalysis || contentAnalysis || metadata || mergedMarkdown || documentInfo) && !isLoading && (
            <div
              style={{
                ...styles.gridContainer,
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(320px, 380px) 1fr'
              }}
            >
              <div style={styles.leftColumn}>
                <div style={styles.stickyAnalysisSection}>
                  {documentInfo && (
                      <div style={{
                        ...styles.successMessageContainer,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: 40,
                              height: 40,
                              borderRadius: 8,
                              backgroundColor: '#e6ffed',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 24
                            }}>✅</div>
                            <div>
                              <h1 style={styles.successMessageTitle}>Document traité</h1>
                              <div style={{ fontSize: 11, color: '#155724', marginTop: '2px' }}>Traitement terminé avec succès.</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            {mergedMarkdown && (
                                <button
                                    onClick={downloadMarkdown}
                                    style={{ ...styles.downloadButton, padding: '6px 12px', fontSize: 13 }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.downloadButtonHover.backgroundColor}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.downloadButton.backgroundColor}
                                    aria-label="Télécharger le markdown"
                                >
                                  📥 Télécharger .md
                                </button>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', alignItems: 'start' }}>
                          <div style={styles.successMessageItem}>
                            <div style={{ fontWeight: 600 }}>📄 Titre</div>
                            <div style={{ marginTop: 3 }}>{documentInfo.title || 'Non spécifié'}</div>
                          </div>

                          <div style={styles.successMessageItem}>
                            <div style={{ fontWeight: 600 }}>✍️ Auteur</div>
                            <div style={{ marginTop: 3 }}>{documentInfo.author || 'Non spécifié'}</div>
                          </div>

                          <div style={styles.successMessageItem}>
                            <div style={{ fontWeight: 600 }}>👤 Uploadé par</div>
                            <div style={{ marginTop: 3 }}>{documentInfo.uploader || 'Inconnu'}</div>
                          </div>

                          <div style={styles.successMessageItem}>
                            <div style={{ fontWeight: 600 }}>📝 Taille du texte</div>
                            <div style={{ marginTop: 3 }}>{documentInfo.textLength ?? 0} caractères</div>
                          </div>

                          <div style={{ gridColumn: '1 / -1', ...styles.successMessageItem }}>
                            <div style={{ fontWeight: 600 }}>🆔 ID du document</div>
                            <div style={{ marginTop: 3, wordBreak: 'break-all' }}>{documentInfo.documentId || '—'}</div>
                          </div>
                        </div>
                      </div>
                  )}

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
                      ...getAnalysisBoxStyle('security', securityAnalysis.risk_level)
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
                      ...getAnalysisBoxStyle('content', contentAnalysis.severity)
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h2 style={{ fontSize: '18px', margin: 0 }}>Aperçu du document en Markdown</h2>
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
            <div style={{ ...styles.metadataContainer, marginTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ margin: 0 }}>Aperçus des images trouvés</h2>
                <button
                  onClick={() => setShowPreviews((v) => !v)}
                  style={{ ...styles.downloadButton, padding: '6px 12px', fontSize: 13 }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.downloadButtonHover.backgroundColor}
                  onMouseLeave={(e) => e.target.style.backgroundColor = styles.downloadButton.backgroundColor}
                  aria-expanded={showPreviews}
                >
                  {showPreviews ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              {showPreviews && (
                <div style={{
                  marginTop: 12,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  padding: 12,
                  background: '#fff',
                  maxHeight: 'calc(100vh - 240px)',
                  overflow: 'auto'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {images.map((img) => (
                      <div key={img.id} style={{ marginBottom: 0 }}>
                        <img src={img.src} alt={img.id} style={styles.img} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
