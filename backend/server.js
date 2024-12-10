const express = require("express");
const path = require("path");
const { connectMongoDB, closeMongoDBConnection } = require("./mongodb");
const signinRoutes = require("./routes/signInBackend.js");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use(express.json());

// Default to Landing page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/landingPage.html"));
});

app.use("/api/users", signinRoutes);

const axios = require("axios"); // Install axios for HTTP requests


/**
 * Handles the initial SOS alert sent by the user.
 * Accepts a recipient's phone number and a message in the request body, 
 * and uses the Textbelt API to send an SMS alert.
 */
app.post("/sos", async (req, res) => {
    const { recipient, message } = req.body;

    if (!recipient || !message) {
        return res.status(400).json({ message: "Recipient and message are required." });
    }

    try {
        // API request to send SMS
        const response = await axios.post("https://textbelt.com/text", {
            phone: recipient,
            message: message,
            key: '1e0ddc3431392f525eb4ec0e91f43b55dcc3eeb2ouhe4iccwOX3UayweBNBx1EHG', // Textbelt api
        });

        if (response.data.success) {
            res.status(200).json({ message: "SOS alert sent successfully!" });
        } else {
            res.status(500).json({ message: `Failed to send SOS alert: ${response.data.error}` });
        }
    } catch (error) {
        console.error("Error sending SOS alert:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

/**
 * Handles SMS notifications for milestones like halfway and destination reached.
 * Accepts a recipient's phone number and a message in the request body,
 * and uses the Textbelt API to send the SMS.
 */
app.post("/send-sms", async (req, res) => {
  const { recipient, message } = req.body;

  if (!recipient || !message) {
      return res.status(400).json({ message: "Recipient and message are required." });
  }

  try {
      // Send SMS using Textbelt API
      const response = await axios.post("https://textbelt.com/text", {
          phone: recipient,
          message: message,
          key: '1e0ddc3431392f525eb4ec0e91f43b55dcc3eeb2ouhe4iccwOX3UayweBNBx1EHG',
      });

      if (response.data.success) {
          res.status(200).json({ message: "SMS sent successfully!" });
      } else {
          res.status(500).json({ message: `Failed to send SMS: ${response.data.error}` });
      }
  } catch (error) {
      console.error("Error sending SMS:", error);
      res.status(500).json({ message: "Internal server error." });
  }
});


/**
 * Handles updates to the user's current location during tracking or SOS.
 * Accepts a location object (latitude and longitude) in the request body
 * and logs it to the console for debugging purposes.
 */
app.post("/update-location", (req, res) => {
  const location = req.body;
  console.log("Updated Location:", location);
  res.status(200).send("Location updated.");
});


// Test endpoint to check if the server is running
app.get('/test', (req, res) => {
  console.log("Test endpoint hit!");
  res.send("Server is running and responding!");
});

// Function to start the server
async function startServer() {
  try {
    console.log("Starting server...");
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB!");

    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    }).on("error", (err) => {
      console.error("Error starting the server:", err);
    });
  } catch (err) {
    console.error("Error starting the server:", err);
  }
}

// Call the startServer function
startServer();

// Close MongoDB connection on exit
process.on("SIGINT", async () => {
  await closeMongoDBConnection();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
