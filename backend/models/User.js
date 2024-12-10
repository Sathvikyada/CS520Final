const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Ensure username is unique
  password: { type: String, required: true },
  preferences: {
    emergencyContact: {
      name: { type: String, required: false },
      phone: { type: String, required: false },
      relationship: { type: String, required: false },
    },
    phone: { type: String, required: false }, // User's personal phone number
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of friends (references to other users)
});

const User = mongoose.model('User', userSchema);

module.exports = User;
