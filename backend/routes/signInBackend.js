const express = require('express');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();
const client = new MongoClient(process.env.MONGO_URI);

router.use(express.json());

// Connect to database
async function getUserCollection() {
  const db = client.db('userdata');
  const collection = db.collection('users');
  return collection;
}

// Sign-up route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const collection = await getUserCollection();
    const existingUser = await collection.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = { username, password: hashedPassword };

    // Insert the new user into the database
    await collection.insertOne(newUser);

    res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).json({ message: 'Error signing up user.' });
  }
});

// Sign-in route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const collection = await getUserCollection();
    const user = await collection.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.status(200).json({ message: 'Sign-in successful.' });
    } else {
      res.status(400).json({ message: 'Invalid password.' });
    }
  } catch (err) {
    console.error("Error during sign-in:", err);
    res.status(500).json({ message: 'Error signing in.' });
  }
});

module.exports = router;
