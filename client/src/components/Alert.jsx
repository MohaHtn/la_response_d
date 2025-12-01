/**
 * Composant Alert réutilisable pour afficher des messages
 */

import { alert } from '../styles/commonStyles';

export const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  return (
    <div style={alert[type]}>
      {message}
      {onClose && (
        <button
          onClick={onClose}
          style={{
            marginLeft: '10px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

