const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../backend/models/User');
const friendsRouter = require('../backend/routes/friend');
const { authenticate } = require('../backend/routes/auth');

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
app.use('/api/friends', friendsRouter);

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

describe('Friends Routes', () => {
  let user1, user2;

  beforeEach(async () => {
    // Clear the User collection before each test
    await User.deleteMany({});

    // Create mock users
    user1 = await User.create({ username: 'user1', password: 'password1', friends: [] });
    user2 = await User.create({ username: 'user2', password: 'password2', friends: [] });
  });

  // Test POST /add
  describe('POST /api/friends/add', () => {
    it('should add a friend successfully', async () => {
      const response = await request(app)
        .post('/api/friends/add')
        .set('Authorization', 'Bearer mockToken') // Mock token for authentication
        .send({ username: 'user2' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Friend added successfully.');

      // Verify the friendship in the database
      const updatedUser1 = await User.findById(user1._id);
      const updatedUser2 = await User.findById(user2._id);

      expect(updatedUser1.friends).toContainEqual(user2._id);
      expect(updatedUser2.friends).toContainEqual(user1._id);
    });

    it('should return an error when trying to add a non-existent user', async () => {
      const response = await request(app)
        .post('/api/friends/add')
        .set('Authorization', 'Bearer mockToken')
        .send({ username: 'nonexistentUser' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should return an error when trying to add oneself', async () => {
      const response = await request(app)
        .post('/api/friends/add')
        .set('Authorization', 'Bearer mockToken')
        .send({ username: 'user1' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('You cannot add yourself as a friend.');
    });

    it('should return an error when the user is already a friend', async () => {
      // Add user2 as a friend to user1
      user1.friends.push(user2._id);
      await user1.save();

      const response = await request(app)
        .post('/api/friends/add')
        .set('Authorization', 'Bearer mockToken')
        .send({ username: 'user2' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('This user is already your friend.');
    });

    it('should return an error when username is not provided', async () => {
      const response = await request(app)
        .post('/api/friends/add')
        .set('Authorization', 'Bearer mockToken')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username is required.');
    });
  });

  // Test GET /list
  describe('GET /api/friends/list', () => {
    it('should fetch a list of friends with emergency contact info', async () => {
      // Set up friendships and additional info
      user1.friends.push(user2._id);
      await user1.save();
      user2.preferences = { phone: '1234567890', emergencyContact: '911' };
      await user2.save();

      const response = await request(app)
        .get('/api/friends/list')
        .set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          username: 'user2',
          phone: '1234567890',
          emergencyContact: '911',
        },
      ]);
    });

    it('should return an empty list if no friends are found', async () => {
      const response = await request(app)
        .get('/api/friends/list')
        .set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return an error if something goes wrong', async () => {
      // Simulate an error by disconnecting the database
      await mongoose.connection.close();

      const response = await request(app)
        .get('/api/friends/list')
        .set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to load friends list.');
    });
  });
});
