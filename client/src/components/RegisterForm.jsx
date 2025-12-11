/**
 * Composant formulaire d'inscription simplifié
 */

import { useState } from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Alert } from './Alert';
import { validateRegisterForm } from '../utils/validators';
import { useTranslation } from 'react-i18next';

export const RegisterForm = ({ onSubmit, loading }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const errors = validateRegisterForm(username, email, password, passwordConfirm);
    if (errors.length > 0) {
      setError(errors.join('. '));
      return;
    }

    try {
      await onSubmit(username, email, password);
      // Réinitialiser le formulaire en cas de succès
      setUsername('');
      setEmail('');
      setPassword('');
      setPasswordConfirm('');
    } catch (err) {
      setError(err.message);
    }
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '480px',
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <Alert type="error" message={error} />

      <Input
        placeholder={t('auth.form.username')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
      />

      <Input
        type="email"
        placeholder={t('auth.form.email')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />

      <Input
        type="password"
        placeholder={t('auth.form.password')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />

      <Input
        type="password"
        placeholder={t('auth.form.confirmPassword')}
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
        disabled={loading}
      />

      <Button type="submit" disabled={loading}>
        {loading ? t('auth.form.loading') : t('auth.form.signup')}
      </Button>
    </form>
  );
};

