const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure the path is correct
const bcryptjs = require('bcryptjs');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// JWT secret key, stored in the environment variables
const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

// Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Hash the password before saving it
    const hashedPassword = await bcryptjs.hash(password.trim(), 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcryptjs.compare(password.trim(), user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT
    const token = jwt.sign({ userId: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, username: user.username, message: "Login successful." });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});


// Middleware to authenticate a user
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;  // Attach the decoded token to the request object
    next();
  } catch (err) {
    console.error('Error verifying token:', err);
    res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { router, authenticate };
