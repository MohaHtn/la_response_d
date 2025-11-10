import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';

const styles = {
  container: {
    // changed: full viewport size, similar to Page3
    width: '100vw',
    minHeight: '100vh',
    padding: '32px',
    boxSizing: 'border-box',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
  },
  tabBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  tabButton: (active) => ({
    padding: '10px 18px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    backgroundColor: active ? '#2196f3' : 'white',
    color: active ? 'white' : '#333',
    cursor: 'pointer',
  }),
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '480px',
  },
  input: {
    padding: '10px 12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  submit: {
    padding: '10px 16px',
    fontSize: '16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  message: (type) => ({
    padding: '10px',
    borderRadius: '6px',
    backgroundColor: type === 'error' ? '#f8d7da' : '#d4edda',
    color: type === 'error' ? '#721c24' : '#155724',
    marginBottom: '5px',
  })
};

// Méthode réutilisable pour envoyer des données utilisateur via fetch
async function sendUserData(path, data) {
  // path: endpoint relatif (par ex. '/api/login' ou '/api/register')
  // data: objet JS qui sera sérialisé en JSON
  try {
    const res = await fetch(`http://localhost:8000${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Essaie de parser la réponse JSON, même en cas d'erreur côté serveur
    const payload = await res.json().catch(() => null);

    if (!res.ok) {
      // Normalise l'erreur
      const message = (payload && (payload.error || payload.detail || payload.message)) || res.statusText || 'Erreur serveur';
      return Promise.reject(new Error(message));
    }

    return payload;
  } catch (err) {
    // Rejeter la promesse avec un message pour le consommateur
    return Promise.reject(new Error(err?.message || 'Erreur réseau'));
  }
}

function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  // login state
  const [loginPassword, setLoginPassword] = useState('');

  // signup state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!username || !loginPassword) {
      setMessageType('error');
      setMessage('Veuillez renseigner l\'email et le mot de passe.');
      return;
    }

    setLoading(true);
    try {
      // Appeler l'API (adapter le chemin si nécessaire)
      const res = await sendUserData('/api/login', {username: username, password: loginPassword});
      setMessageType('success');
      setMessage(res?.message || 'Connexion réussie');
      // Si le backend renvoie un token, on le stocke localement pour les requêtes suivantes
      if (res?.token) {
        try { localStorage.setItem('authToken', res.token); } catch { /* localStorage peut être bloqué dans certains environnements */ }
      }
      // Rediriger vers /home après une connexion réussie
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      setMessageType('error');
      console.log(err);
      setMessage(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitSignup = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!username || !email || !password) {
      setMessageType('error');
      setMessage('Veuillez remplir tous les champs d\'inscription.');
      return;
    }
    if (password !== passwordConfirm) {
      setMessageType('error');
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendUserData('/api/register', { username, email, password });
      setMessageType('success');
      setMessage(res?.message || 'Inscription réussie');
      // Réinitialiser le formulaire ou basculer vers login
      setUsername(''); setEmail(''); setPassword(''); setPasswordConfirm('');
      setTab('login');
    } catch (err) {
      setMessageType('error');
      setMessage(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ paddingTop: '64px' }}>
        <div style={styles.container}>
          <h1 style={styles.title}>Connexion / Inscription</h1>

          <div style={styles.tabBar}>
            <button type="button" onClick={() => setTab('login')} style={styles.tabButton(tab === 'login')}>Connexion</button>
            <button type="button" onClick={() => setTab('signup')} style={styles.tabButton(tab === 'signup')}>Inscription</button>
          </div>

          {message && (
            <div style={styles.message(messageType === 'error' ? 'error' : 'success')}>
              {message}
            </div>
          )}

          {tab === 'login' ? (
            <form style={styles.form} onSubmit={onSubmitLogin}>
              <input
                style={styles.input}
                placeholder="Pseudonyme"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                />
              <input
                style={styles.input}
                type="password"
                placeholder="Mot de passe"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={loading}
              />
              <button type="submit" style={styles.submit} disabled={loading}>
                {loading ? 'En cours...' : 'Se connecter'}
              </button>
            </form>
          ) : (
            <form style={styles.form} onSubmit={onSubmitSignup}>
              <input
                style={styles.input}
                type="text"
                placeholder="Pseudonyme"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              <input
                style={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <input
                style={styles.input}
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <input
                style={styles.input}
                type="password"
                placeholder="Confirmer le mot de passe"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                disabled={loading}
              />
              <button type="submit" style={styles.submit} disabled={loading}>
                {loading ? 'En cours...' : 'S\u2019inscrire'}
              </button>
            </form>
          )}

          <div style={{ marginTop: '28px' }}>
            <Link to="/" style={styles.backButton}>← Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
