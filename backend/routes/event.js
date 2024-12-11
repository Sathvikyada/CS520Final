const express = require('express');
const Event = require('../models/Event');
const { authenticate } = require('./auth');
const router = express.Router();

// Get all events sorted by danger status and upvotes
router.get('/', async (req, res) => {
  try {
    // First sort by dangerous (true first), then by upvotes descending
    const events = await Event.find().sort({ dangerous: -1, upvotes: -1 });
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create a new event
router.post('/create', authenticate, async (req, res) => {
  const { title, location, dangerous } = req.body;

  // Validate request body
  if (!title || !location || !location.latitude || !location.longitude) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Create a new event document
    const newEvent = new Event({
      title,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      dangerous: dangerous || false, // Default to false
    });

    // Save the event to the database
    await newEvent.save();

    res.status(201).json({ message: 'Event created successfully.', event: newEvent });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// Upvote an event
router.post('/:eventId/upvote', authenticate, async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId; // Extracted from JWT by authenticate middleware

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if the user has already voted
    if (event.voters.includes(userId)) {
      return res.status(400).json({ message: 'You have already upvoted this event.' });
    }

    // Update the event with an upvote and add the user to voters list
    event.upvotes += 1;
    event.voters.push(userId);
    await event.save();

    res.status(200).json({ message: 'Upvoted successfully.', upvotes: event.upvotes });
  } catch (err) {
    console.error('Error upvoting event:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;

