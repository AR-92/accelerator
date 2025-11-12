const request = require('supertest');
const express = require('express');

// Create a minimal app for testing
const app = express();
app.use(express.json());

// Import routes
const authRoutes = require('../../../routes/pages/auth');
app.use('/auth', authRoutes);

describe('Auth Routes Integration', () => {
  beforeAll(async () => {
    // Initialize container if needed
    const container = require('../../../container');
  });

  describe('POST /auth/signup', () => {
    it('should create a new user successfully', async () => {
      const timestamp = Date.now();
      const email = 'test' + timestamp + '@example.com';
      const userData = {
        email: email,
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Test',
        lastName: 'User',
        terms: 'on',
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.firstName).toBe(userData.firstName);
      expect(response.body.user.lastName).toBe(userData.lastName);
    });

    it('should return validation error for missing fields', async () => {
      const userData = {
        email: 'test2@example.com',
        // missing password and other fields
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('Validation Error');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return error for duplicate email', async () => {
      const timestamp = Date.now();
      const email = 'duplicate' + timestamp + '@example.com';

      // First create a user
      const firstUserData = {
        email: email,
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'First',
        lastName: 'User',
        terms: 'on',
      };

      await request(app).post('/auth/signup').send(firstUserData).expect(201);

      // Try to create another with same email
      const secondUserData = {
        email: email,
        password: 'password456',
        confirmPassword: 'password456',
        firstName: 'Second',
        lastName: 'User',
        terms: 'on',
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(secondUserData)
        .expect(400);

      expect(response.body.error).toBe('ValidationError');
      expect(response.body.details).toContain('Email already registered');
    });
  });
});
