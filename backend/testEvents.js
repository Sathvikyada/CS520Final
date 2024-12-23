require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const Event = require('./models/Event'); // Adjust the path based on your folder structure

// Connect to MongoDB using the same URI from your .env file
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  createDummyEvents(); // Call the function after connecting
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Dummy event data
const events = [
  {
    title: 'Road Blockage',
    location: { latitude: 37.7749, longitude: -122.4194 },
    dangerous: true,
  },
  {
    title: 'Concert at Central Park',
    location: { latitude: 40.785091, longitude: -73.968285 },
    dangerous: false,
  },
  {
    title: 'Power Outage',
    location: { latitude: 34.0522, longitude: -118.2437 },
    dangerous: true,
  },
  {
    title: 'Community Clean-up Drive',
    location: { latitude: 36.7783, longitude: -119.4179 },
    dangerous: false,
  },
  {
    title: 'Car Accident',
    location: { latitude: 51.5074, longitude: -0.1278 },
    dangerous: true,
  },
];

// Function to create dummy events
const createDummyEvents = async () => {
  try {
    // Optional: Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events.');

    // Insert dummy events
    await Event.insertMany(events);
    console.log('Dummy events created successfully.');
  } catch (err) {
    console.error('Error creating dummy events:', err);
  } finally {
    mongoose.connection.close(); // Close the connection after the operation
  }
};
