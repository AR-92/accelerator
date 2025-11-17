/**
 * Auth Module
 *
 * Handles user authentication, registration, login, logout, and profile management.
 * This module provides both API endpoints and page routes for authentication features.
 */

const AuthController = require('./controllers/AuthController');
const AuthService = require('./services/AuthService');
const UserRepository = require('./repositories/UserRepository');
const User = require('./models/User');

module.exports = (container) => {
  // Register repository
  container.register(
    'userRepository',
    () =>
      new UserRepository(
        container.get('db'),
        container.get('createLogger')('UserRepository')
      )
  );

  // Register service
  container.register(
    'authService',
    () =>
      new AuthService(
        container.get('userRepository'),
        container.get('createLogger')('AuthService')
      )
  );

  // Register controller
  container.register(
    'authController',
    () =>
      new AuthController(
        container.get('authService'),
        container.get('createLogger')('AuthController')
      )
  );

  return {
    AuthController: container.get('authController'),
    AuthService: container.get('authService'),
    UserRepository: container.get('userRepository'),
    User,
  };
};
