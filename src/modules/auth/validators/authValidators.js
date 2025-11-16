/**
 * Validation rules and middleware for authentication
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password validation (at least 6 characters)
 */
const validatePassword = (password) => {
  return password && typeof password === 'string' && password.length >= 6;
};

/**
 * Email validation
 */
const validateEmail = (email) => {
  return email && typeof email === 'string' && EMAIL_REGEX.test(email);
};

/**
 * Login validation middleware
 */
const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!validateEmail(email)) {
    errors.push('Valid email address is required');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please correct the following errors:',
      errors,
    });
  }

  next();
};

/**
 * Registration validation middleware
 */
const validateRegistration = (req, res, next) => {
  const { email, password, confirmPassword, firstName, lastName, terms } =
    req.body;
  const errors = [];

  if (!validateEmail(email)) {
    errors.push('Valid email address is required');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  if (
    !firstName ||
    typeof firstName !== 'string' ||
    firstName.trim().length < 2
  ) {
    errors.push('First name must be at least 2 characters long');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 2) {
    errors.push('Last name must be at least 2 characters long');
  }

  if (!terms || terms !== 'on') {
    errors.push('You must agree to the Terms and Conditions');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please correct the following errors:',
      errors,
    });
  }

  next();
};

/**
 * Profile update validation middleware
 */
const validateProfileUpdate = (req, res, next) => {
  const { firstName, lastName, role } = req.body;
  const errors = [];

  if (
    firstName !== undefined &&
    (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2)
  ) {
    errors.push('First name must be at least 2 characters long');
  }

  if (
    lastName !== undefined &&
    (!lastName || typeof lastName !== 'string' || lastName.trim().length < 2)
  ) {
    errors.push('Last name must be at least 2 characters long');
  }

  if (
    role !== undefined &&
    !['startup', 'corporate', 'enterprise'].includes(role)
  ) {
    errors.push('Invalid role specified');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please correct the following errors:',
      errors,
    });
  }

  next();
};

/**
 * Password change validation middleware
 */
const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const errors = [];

  if (!currentPassword || typeof currentPassword !== 'string') {
    errors.push('Current password is required');
  }

  if (!validatePassword(newPassword)) {
    errors.push('New password must be at least 6 characters long');
  }

  if (currentPassword === newPassword) {
    errors.push('New password must be different from current password');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Please correct the following errors:',
      errors,
    });
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateLogin,
  validateRegistration,
  validateProfileUpdate,
  validatePasswordChange,
};
