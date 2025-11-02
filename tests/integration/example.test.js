// Example integration test file
const request = require('supertest');
const app = require('../../server.js'); // Adjust path as needed

describe('Example Integration Tests', () => {
  it('should respond to GET requests', (done) => {
    request(app)
      .get('/')
      .expect(302) // Assuming redirect to login
      .end((err) => {
        if (err) return done(err);
        done();
      });
  });
});
