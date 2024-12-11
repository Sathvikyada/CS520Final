const mongoose = require('mongoose');

// Schema for the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Username is unique
  password: { type: String, required: true }, // User's password
  preferences: {
    emergencyContact: {
      name: { type: String, required: false }, // Name of emergency contact
      phone: { type: String, required: false }, // Emergency contact's phone number
      relationship: { type: String, required: false }, // Relationship to the user
    },
    phone: { type: String, required: false }, // User's personal phone number
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of friends (references to other users)
});

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;