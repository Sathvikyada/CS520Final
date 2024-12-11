const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { router } = require('../backend/routes/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Setup express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', router); // Assuming your routes are prefixed with '/api/auth'

beforeAll(async () => {
  // Connect to a test database (use an in-memory database for isolation)
  await mongoose.connect('mongodb://localhost:27017/test_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Clean up and disconnect after tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('User Authentication Routes', () => {
  // Test Registration
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully.');
  });

  it('should not register a user with missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username and password are required.');
  });

  it('should not register a user with an existing username', async () => {
    await User.create({
      username: 'existinguser',
      password: 'password123',
    });

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'existinguser',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username already exists.');
  });

  // Test Login
  it('should log in a user with correct credentials', async () => {
    const newUser = await User.create({
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
    });

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.message).toBe('Login successful.');
  });

  it('should not log in with incorrect credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'wronguser',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid credentials.');
  });

  it('should not log in with missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Username and password are required.');
  });

  // Test Authentication Middleware
  it('should allow access to protected route with a valid token', async () => {
    const newUser = await User.create({
      username: 'testuser',
      password: await bcrypt.hash('testpassword', 10),
    });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    const token = loginResponse.body.token;

    const protectedResponse = await request(app)
      .get('/api/protected') // A route protected by the `authenticate` middleware
      .set('Authorization', `Bearer ${token}`);

    expect(protectedResponse.status).toBe(200); // Assuming the protected route is set up to return status 200
    expect(protectedResponse.body.message).toBe('Access granted.');
  });

  it('should reject access to protected route without a token', async () => {
    const protectedResponse = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer invalidtoken');

    expect(protectedResponse.status).toBe(403); // Forbidden due to invalid token
    expect(protectedResponse.body.message).toBe('Invalid or expired token.');
  });

  it('should reject access to protected route without authorization header', async () => {
    const protectedResponse = await request(app).get('/api/protected');

    expect(protectedResponse.status).toBe(401); // Unauthorized
    expect(protectedResponse.body.message).toBe('Authentication required.');
  });
});
