import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { createAdmins, getSetupStatus } from '../services/setup.service';
import { ROUTES } from '../constants';

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  marginBottom: '12px',
};

const cardStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '16px',
  background: '#fff',
};

const containerStyle = {
  maxWidth: '820px',
  margin: '0 auto',
  padding: '24px',
};

function AdminFormCard({ index, value, onChange }) {
  const handle = (key) => (e) => onChange(index, { ...value, [key]: e.target.value });
  return (
    <div style={cardStyle}>
      <h3>Administrateur {index + 1}</h3>
      <div style={fieldStyle}>
        <label>Nom d'utilisateur</label>
        <input required value={value.username} onChange={handle('username')} placeholder={`admin${index + 1}`} />
      </div>
      <div style={fieldStyle}>
        <label>Email</label>
        <input required type="email" value={value.email} onChange={handle('email')} placeholder={`admin${index + 1}@example.com`} />
      </div>
      <div style={fieldStyle}>
        <label>Mot de passe</label>
        <input required type="password" value={value.password} onChange={handle('password')} placeholder="••••••••" />
      </div>
    </div>
  );
}

export default function SetupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState(null);
  const [admins, setAdmins] = useState([
    { username: '', email: '', password: '' },
    { username: '', email: '', password: '' },
    { username: '', email: '', password: '' },
  ]);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const s = await getSetupStatus();
        setStatus(s);
        if (!s.needs_setup) {
          navigate(ROUTES.AUTH, { replace: true });
        }
      } catch (e) {
        setError(e.message || 'Erreur lors de la vérification du statut');
      }
    };
    checkStatus();
  }, [navigate]);

  const updateAdmin = (idx, val) => {
    const next = admins.map((a, i) => (i === idx ? val : a));
    setAdmins(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Filtrer les admins vides
      const adminsToCreate = admins.filter(a => a.username && a.email && a.password);
      
      if (adminsToCreate.length === 0) {
        throw new Error('Veuillez remplir au moins un formulaire d\'administrateur.');
      }
      
      if (status && adminsToCreate.length > status.remaining) {
         throw new Error(`Vous ne pouvez créer que ${status.remaining} administrateurs supplémentaires.`);
      }

      await createAdmins(adminsToCreate);
      // Vérifier le statut après création
      const s = await getSetupStatus();
      if (!s.needs_setup) {
        navigate(ROUTES.AUTH, { replace: true });
      } else {
        setStatus(s);
        // Réinitialiser le formulaire ou afficher un message de succès partiel
        setAdmins([
          { username: '', email: '', password: '' },
          { username: '', email: '', password: '' },
          { username: '', email: '', password: '' },
        ]);
      }
    } catch (e) {
      setError(e.message || 'Erreur lors de la création des administrateurs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div style={{ paddingTop: '64px' }}>
        <div style={containerStyle}>
          <h1>Configuration initiale</h1>
          <p>Créez 3 comptes administrateurs pour démarrer.</p>
          {status && (
            <p>
              Administrateurs existants: {status.admins_count} / 3
            </p>
          )}
          {error && (
            <div style={{ color: 'red', marginBottom: '12px' }}>{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            {status && admins.slice(0, status.remaining).map((admin, idx) => (
              <AdminFormCard key={idx} index={idx} value={admin} onChange={updateAdmin} />
            ))}
            <button type="submit" disabled={loading}>
              {loading ? 'Création en cours…' : (status && status.admins_count > 0 ? 'Ajouter les administrateurs' : 'Créer les administrateurs')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
