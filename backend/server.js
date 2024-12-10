const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path')
const authRoutes = require('./routes/auth');
const preferencesRoutes = require('./routes/preferences');
const eventRoutes = require('./routes/event')
const friendsRoutes = require('./routes/friend');
const routeCreatorRoutes = require('./routes/routeCreator');


dotenv.config(); // Load environment variables

const app = express();
const port = 4000;

// Middleware
app.use(express.json()); // To parse incoming JSON requests
app.use(express.static('../frontend'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/landingPage.html'));
});

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Use the auth routes for handling login and registration
app.use('/api/auth', authRoutes.router);

app.use('/api/preferences', preferencesRoutes);

app.use('/api/events', eventRoutes);

app.use('/api/friends', friendsRoutes);

app.use('/api/routeCreator', routeCreatorRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
