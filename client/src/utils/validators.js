/**
 * Fonctions de validation réutilisables
 */

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateUsername = (username) => {
  return username && username.length >= 3;
};

export const validateLoginForm = (username, password) => {
  const errors = [];

  if (!username) {
    errors.push('Le pseudonyme est requis');
  }

  if (!password) {
    errors.push('Le mot de passe est requis');
  }

  return errors;
};

export const validateRegisterForm = (username, email, password, passwordConfirm) => {
  const errors = [];

  if (!validateUsername(username)) {
    errors.push('Le pseudonyme doit contenir au moins 3 caractères');
  }

  if (!validateEmail(email)) {
    errors.push('L\'email n\'est pas valide');
  }

  if (!validatePassword(password)) {
    errors.push('Le mot de passe doit contenir au moins 6 caractères');
  }

  if (password !== passwordConfirm) {
    errors.push('Les mots de passe ne correspondent pas');
  }

  return errors;
};

