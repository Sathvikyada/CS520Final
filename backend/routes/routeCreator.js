const express = require('express');
const router = express.Router();
const axios = require("axios");

/**
 * Handles the initial SOS alert sent by the user.
 * Accepts a recipient's phone number and a message in the request body, 
 * and uses the Textbelt API to send an SMS alert.
 */
router.post("/sos", async (req, res) => {
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
router.post("/send-sms", async (req, res) => {
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
router.post("/update-location", (req, res) => {
const location = req.body;
console.log("Updated Location:", location);
res.status(200).send("Location updated.");
});


// Test endpoint to check if the server is running
router.get('/test', (req, res) => {
console.log("Test endpoint hit!");
res.send("Server is running and responding!");
});


module.exports = router;