const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path')
const authRoutes = require('./routes/auth'); // Authentication routes
const preferencesRoutes = require('./routes/preferences'); // Preferences routes
const eventRoutes = require('./routes/event'); // Event routes
const friendsRoutes = require('./routes/friend'); // Friend routes
const routeCreatorRoutes = require('./routes/routeCreator'); // Route creation routes


dotenv.config(); // Load environment variables from the .env file

const app = express();
const port = 4000; // Define the port for the server

// Middleware to parse incoming JSON requests
app.use(express.json());
// Serve static files from the frontend
app.use(express.static('../frontend'));

// Serve the landing page for the root URL
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

// Attach the routes to the express app
app.use('/api/auth', authRoutes.router);

app.use('/api/preferences', preferencesRoutes);

app.use('/api/events', eventRoutes);

app.use('/api/friends', friendsRoutes);

app.use('/api/routeCreator', routeCreatorRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
