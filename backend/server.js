const express = require('express');
const path = require('path');
const { connectMongoDB, closeMongoDBConnection } = require('./mongodb');
const signinRoutes = require('./routes/signInBackend.js');

const app = express();
const port = 4000;

app.use(express.static('../frontend'));
app.use(express.json());

// Default to Landing page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/landingPage.html'));
});

app.use('/api/users', signinRoutes);

// Function to start the server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error starting the server:", err);
  }
}

startServer();

// Close MongoDB connection
process.on('SIGINT', async () => {
  await closeMongoDBConnection();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
