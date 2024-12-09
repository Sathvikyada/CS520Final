const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // Ensure username is unique
  password: { type: String, required: true },  // Store the hashed password
  preferences: {
    emergencyContact: {
      name: { type: String, required: false },
      phone: { type: String, required: false },
      relationship: { type: String, required: false },
    },
  },
});

// Create the model for the User
const User = mongoose.model('User', userSchema);

module.exports = User;
