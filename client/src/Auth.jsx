import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { Alert } from './components/Alert';
import { login, register, getRedirectPath } from './services/auth.service';
import { colors, spacing } from './styles/commonStyles';
import { ROUTES, MESSAGES, ALERT_TYPES } from './constants';

const styles = {
  container: {
    width: '100vw',
    minHeight: '100vh',
    padding: spacing.xl,
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
    color: colors.primary,
  },
  backButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: colors.primary,
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
    backgroundColor: active ? colors.primary : 'white',
    color: active ? 'white' : '#333',
    cursor: 'pointer',
  }),
};

function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  const handleLogin = async (username, password) => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await login(username, password);
      setMessageType(ALERT_TYPES.SUCCESS);
      setMessage(response?.message || MESSAGES.LOGIN_SUCCESS);

      // Rediriger selon le type de compte
      setTimeout(() => {
        navigate(getRedirectPath(response.userType));
      }, 1000);
    } catch (err) {
      setMessageType(ALERT_TYPES.ERROR);
      setMessage(err.message || MESSAGES.LOGIN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, email, password) => {
    setMessage(null);
    setLoading(true);

    try {
      const response = await register(username, email, password);
      setMessageType(ALERT_TYPES.SUCCESS);
      setMessage(response?.message || MESSAGES.REGISTER_SUCCESS);
      // Basculer vers l'onglet de connexion
      setTimeout(() => {
        setTab('login');
      }, 1500);
    } catch (err) {
      setMessageType(ALERT_TYPES.ERROR);
      setMessage(err.message || MESSAGES.REGISTER_ERROR);
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
            <button
              type="button"
              onClick={() => setTab('login')}
              style={styles.tabButton(tab === 'login')}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setTab('signup')}
              style={styles.tabButton(tab === 'signup')}
            >
              Inscription
            </button>
          </div>

          <Alert
            type={messageType === 'error' ? 'error' : 'success'}
            message={message}
          />

          {tab === 'login' ? (
            <LoginForm onSubmit={handleLogin} loading={loading} />
          ) : (
            <RegisterForm onSubmit={handleRegister} loading={loading} />
          )}

          <div style={{ marginTop: '28px' }}>
            <Link to={ROUTES.PRESENTATION} style={styles.backButton}>← Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
