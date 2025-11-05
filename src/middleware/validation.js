// Validation middleware for common form validations

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!validateEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  if (errors.length > 0) {
    return res.send(
      `<div class="text-red-500 text-center">${errors.join('<br>')}</div>`
    );
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  const errors = [];

  if (!validateEmail(email)) {
    errors.push('Please provide a valid email address');
  }

  if (!validatePassword(password)) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.send(
      `<div class="text-red-500 text-center">${errors.join('<br>')}</div>`
    );
  }

  next();
};

module.exports = {
  validateEmail,
  validatePassword,
  validateSignup,
  validateLogin,
};
