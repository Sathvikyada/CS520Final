const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Event = require('../backend/models/Event');
const eventRouter = require('../backend/routes/event');
const { authenticate } = require('../backend/routes/auth');

// Mock authenticate middleware for testing
jest.mock('../backend/routes/auth', () => ({
  authenticate: jest.fn((req, res, next) => {
    req.user = { userId: 'mockUserId' };
    next();
  }),
}));

// Set up Express app for testing
const app = express();
app.use(express.json());
app.use('/api/events', eventRouter);

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

describe('Event Routes', () => {
  beforeEach(async () => {
    // Clear the Event collection before each test
    await Event.deleteMany({});
  });

  // Test GET /
  describe('GET /api/events', () => {
    it('should fetch all events sorted by dangerous status and upvotes', async () => {
      await Event.create([
        { title: 'Safe Event', location: { latitude: 1, longitude: 1 }, upvotes: 5, dangerous: false },
        { title: 'Dangerous Event', location: { latitude: 2, longitude: 2 }, upvotes: 10, dangerous: true },
        { title: 'Moderate Event', location: { latitude: 3, longitude: 3 }, upvotes: 7, dangerous: false },
      ]);

      const response = await request(app).get('/api/events');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(3);
      expect(response.body[0].title).toBe('Dangerous Event'); // Dangerous first
      expect(response.body[1].title).toBe('Moderate Event'); // Higher upvotes next
    });
  });

  // Test POST /create
  describe('POST /api/events/create', () => {
    it('should create a new event with valid data', async () => {
      const response = await request(app)
        .post('/api/events/create')
        .set('Authorization', 'Bearer mockToken') // Mock token for authentication
        .send({
          title: 'Test Event',
          location: { latitude: 40.7128, longitude: -74.0060 },
          dangerous: true,
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Event created successfully.');
      expect(response.body.event.title).toBe('Test Event');
    });

    it('should return an error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/events/create')
        .set('Authorization', 'Bearer mockToken')
        .send({
          title: 'Test Event',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Missing required fields.');
    });
  });

  // Test POST /:eventId/upvote
  describe('POST /api/events/:eventId/upvote', () => {
    it('should upvote an event and add the user to voters list', async () => {
      const event = await Event.create({
        title: 'Upvotable Event',
        location: { latitude: 40.7128, longitude: -74.0060 },
        upvotes: 0,
        voters: [],
      });

      const response = await request(app)
        .post(`/api/events/${event._id}/upvote`)
        .set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Upvoted successfully.');
      expect(response.body.upvotes).toBe(1);

      const updatedEvent = await Event.findById(event._id);
      expect(updatedEvent.upvotes).toBe(1);
      expect(updatedEvent.voters).toContain('mockUserId');
    });

    it('should not allow duplicate upvotes from the same user', async () => {
      const event = await Event.create({
        title: 'Already Upvoted Event',
        location: { latitude: 40.7128, longitude: -74.0060 },
        upvotes: 1,
        voters: ['mockUserId'],
      });

      const response = await request(app)
        .post(`/api/events/${event._id}/upvote`)
        .set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('You have already upvoted this event.');
    });

    it('should return an error if the event does not exist', async () => {
      const response = await request(app)
        .post('/api/events/invalidEventId/upvote')
        .set('Authorization', 'Bearer mockToken');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Event not found.');
    });
  });
});
