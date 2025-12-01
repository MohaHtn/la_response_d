/**
 * Composant Input réutilisable
 */

import { input } from '../styles/commonStyles';

export const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  style = {},
  ...props
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ ...input.base, ...style }}
      {...props}
    />
  );
};

