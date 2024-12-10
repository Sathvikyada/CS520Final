const mongoose = require('mongoose');

// Define schema for Event
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  dangerous: { type: Boolean, default: false },
  upvotes: { type: Number, default: 0 },
  voters: { type: [String], default: [] },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
