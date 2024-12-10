const express = require('express');
const User = require('../models/User');
const { authenticate } = require('./auth'); // Assuming you already have an authentication middleware
const axios = require('axios'); // For making HTTP requests to Textbelt
const router = express.Router();

// Add a friend by username
router.post('/add', authenticate, async (req, res) => {
  const { username } = req.body;
  const userId = req.user.userId; // Extracted from JWT by `authenticate` middleware

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  try {
    const friend = await User.findOne({ username });
    if (!friend) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the user is trying to add themselves as a friend
    if (friend._id.toString() === userId) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend.' });
    }

    // Check if the friend is already in the friends list
    const user = await User.findById(userId);
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'This user is already your friend.' });
    }

    // Add the friend to the user's friends list
    user.friends.push(friend._id);
    await user.save();

    // Optionally, add the user to the friend's friends list as well
    friend.friends.push(user._id);
    await friend.save();

    res.status(200).json({ message: 'Friend added successfully.' });
  } catch (err) {
    console.error('Error adding friend:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get list of friends (including their emergency contact info)
router.get('/list', authenticate, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).populate('friends', 'username preferences.phone emergencyContact'); 

    const friends = user.friends.map(friend => ({
      username: friend.username,
      phone: friend.preferences.phone,
      emergencyContact: friend.preferences.emergencyContact,
    }));

    res.status(200).json(friends);
  } catch (err) {
    console.error('Error fetching friends:', err);
    res.status(500).json({ message: 'Failed to load friends list.' });
  }
});

// Send location to a friend via SMS
router.post('/send-location', authenticate, async (req, res) => {
  const { phone, location } = req.body;

  if (!phone || !location) {
    return res.status(400).json({ message: 'Phone number and location are required.' });
  }

  try {
    // Get the username of the person sharing their location
    const userId = req.user.userId;
    const user = await User.findById(userId);
    const username = user.username;

    // Use Textbelt API to send the SMS
    const response = await axios.post('https://textbelt.com/text', {
      phone,
      message: `${username} is sharing their location: Latitude: ${location.latitude}, Longitude: ${location.longitude}`,
      key: '1e0ddc3431392f525eb4ec0e91f43b55dcc3eeb2ouhe4iccwOX3UayweBNBx1EHG',
    });

    if (response.data.success) {
      res.status(200).json({ message: 'Location sent successfully!' });
    } else {
      res.status(500).json({ message: `Failed to send location: ${response.data.error}` });
    }
  } catch (error) {
    console.error('Error sending location:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
