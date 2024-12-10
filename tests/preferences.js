const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../backend/models/User');
const preferencesRouter = require('../backend/routes/preferences');

// Mock authenticate middleware for testing
jest.mock('../backend/routes/auth', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = { userId: 'mockUserId' }; // Simulate authenticated user
    next();
  }),
}));

// Set up Express app for testing
const app = express();
app.use(express.json());
app.use('/api/preferences', preferencesRouter);

beforeAll(async () => {
  // Connect to a test database
  await mongoose.connect('mongodb://localhost:27017/test_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Clean up and close database connection
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Preferences Routes', () => {
  let user;

  beforeEach(async () => {
    // Clear the User collection before each test
    await User.deleteMany({});

    // Create a mock user
    user = await User.create({
      username: 'testuser',
      password: 'password123',
      preferences: { emergencyContact: '911', phone: '1234567890' },
    });
  });

  // Test GET /api/preferences
  describe('GET /api/preferences', () => {
    it('should fetch user preferences successfully', async () => {
      const response = await request(app)
        .get('/api/preferences')
        .set('Authorization', 'Bearer mockToken'); // Mock token for authentication

      expect(response.status).toBe(200);
      expect(response.body.preferences).toEqual({
        emergencyContact: '911',
        phone: '1234567890',
      });
    });

    it('should return 404 if the user is not found', async () => {
      // Simulate missing user by removing the user document
      await User.findByIdAndDelete(user._id);

      const response = await request(app)
        .get('/api/preferences')
        .set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should return 500 for a server error', async () => {
      // Simulate server error by disconnecting database
      await mongoose.connection.close();

      const response = await request(app)
        .get('/api/preferences')
        .set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');

      // Reconnect for other tests
      await mongoose.connect('mongodb://localhost:27017/test_db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    });
  });

  // Test PUT /api/preferences
  describe('PUT /api/preferences', () => {
    it('should update user preferences successfully', async () => {
      const updatedPreferences = {
        emergencyContact: '112',
        phone: '0987654321',
      };

      const response = await request(app)
        .put('/api/preferences')
        .set('Authorization', 'Bearer mockToken')
        .send(updatedPreferences);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Preferences updated successfully.');

      // Verify the preferences in the database
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.preferences).toEqual(updatedPreferences);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .put('/api/preferences')
        .set('Authorization', 'Bearer mockToken')
        .send({ emergencyContact: '112' }); // Missing phone field

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'Emergency contact details and phone number are required.'
      );
    });

    it('should return 404 if the user is not found', async () => {
      // Simulate missing user by removing the user document
      await User.findByIdAndDelete(user._id);

      const updatedPreferences = {
        emergencyContact: '112',
        phone: '0987654321',
      };

      const response = await request(app)
        .put('/api/preferences')
        .set('Authorization', 'Bearer mockToken')
        .send(updatedPreferences);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should return 500 for a server error', async () => {
      // Simulate server error by disconnecting database
      await mongoose.connection.close();

      const updatedPreferences = {
        emergencyContact: '112',
        phone: '0987654321',
      };

      const response = await request(app)
        .put('/api/preferences')
        .set('Authorization', 'Bearer mockToken')
        .send(updatedPreferences);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error.');

      // Reconnect for other tests
      await mongoose.connect('mongodb://localhost:27017/test_db', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    });
  });
});
