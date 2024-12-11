const mongoose = require('mongoose');

// Schema for Event
const eventSchema = new mongoose.Schema({
  // Title of the event, required field of type string
  title: { type: String, required: true },
  // Location object containing latitude and longitude
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  // Indicates whether the event is dangerous, default value of false.
  dangerous: { type: Boolean, default: false },
  // Number of upvotes the event has received, default value of 0.
  upvotes: { type: Number, default: 0 },
  // List of other users who have voted on the event
  voters: { type: [String], default: [] },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
