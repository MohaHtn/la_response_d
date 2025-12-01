/**
 * Composant Button réutilisable
 */

import { button } from '../styles/commonStyles';

export const Button = ({
  children,
  variant = 'primary',
  disabled = false,
  onClick,
  type = 'button',
  style = {},
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return button.primary;
      case 'secondary':
        return button.secondary;
      case 'danger':
        return button.danger;
      default:
        return button.primary;
    }
  };

  const buttonStyle = {
    ...button.base,
    ...getVariantStyle(),
    ...(disabled ? button.disabled : {}),
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyle}
      {...props}
    >
      {children}
    </button>
  );
};
