const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure the path is correct
const { authenticate } = require('./auth'); // Ensure the path is correct

// Get user preferences
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ preferences: user.preferences });
  } catch (err) {
    console.error('Error fetching preferences:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update user preferences
router.put('/', authenticate, async (req, res) => {
  const { emergencyContact } = req.body;

  if (!emergencyContact) {
    return res.status(400).json({ message: 'Emergency contact details are required.' });
  }

  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.preferences.emergencyContact = emergencyContact; // Update preferences
    await user.save();

    res.status(200).json({ message: 'Preferences updated successfully.' });
  } catch (err) {
    console.error('Error updating preferences:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
