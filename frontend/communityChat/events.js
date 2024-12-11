document.addEventListener('DOMContentLoaded', async () => {
  const eventList = document.getElementById('event-list'); // Container for events
  const token = localStorage.getItem('authToken'); // Retrieve authentication token
  const geocodeApiKey = 'AIzaSyCSAlFpyVFwlwMp74TSZAww9isva9ubp1E';  // Google Maps API Key

  // Check if the token is valid and exists
  if (!token) {
    alert('You must be logged in to view events.');
    window.location.href = '../signIn/signIn.html'; // Redirect to sign-in page
    return;
  }

  try {
    // Fetch all events sorted by danger status and upvotes
    const response = await fetch('/api/events', {
      headers: { Authorization: `Bearer ${token}` }, // Pass token for authentication
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const events = await response.json();

    // Populate events by manipulating DOM
    for (const event of events) {
      const eventCard = document.createElement('div');
      eventCard.className = 'event-card';

      // Add a marker if the event is dangerous
      const dangerBadge = event.dangerous 
        ? `<span class="danger-badge">Dangerous</span>` 
        : '';

      // Reverse geocode the location to get the address
      const address = await getAddressFromCoordinates(event.location.latitude, event.location.longitude, geocodeApiKey);

      // Populate event card with event details
      eventCard.innerHTML = `
        <h3>${event.title}</h3>
        ${dangerBadge}
        <p>Location: ${address}</p>
        <p>Upvotes: <span id="upvote-count-${event._id}">${event.upvotes}</span></p>
        <button class="upvote-btn" data-id="${event._id}">Upvote</button>
      `;
      eventList.appendChild(eventCard);
    }

    // Add event listeners to upvote buttons
    document.querySelectorAll('.upvote-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const eventId = e.target.getAttribute('data-id'); // Get event ID from button attribute
        try {
          // Send a POST request to upvote the event
          const upvoteResponse = await fetch(`/api/events/${eventId}/upvote`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!upvoteResponse.ok) {
            const error = await upvoteResponse.json();
            alert(error.message || 'Failed to upvote');
            return;
          }

          const { upvotes } = await upvoteResponse.json(); // Update upvote count in the UI
          document.getElementById(`upvote-count-${eventId}`).textContent = upvotes;
        } catch (err) {
          alert('Error upvoting event.');
        }
      });
    });
  } catch (err) {
    console.error('Error loading events:', err);
    alert('Failed to load events.');
  }
});

// Function to get address from latitude and longitude
async function getAddressFromCoordinates(lat, lng, apiKey) {
  try {
    // Send a request to Google Maps API for reverse geocoding
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`);
    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }

    const data = await response.json();
    if (data.results && data.results[0]) {
      return data.results[0].formatted_address; // Return the formatted address
    } else {
      return 'Address not available';
    }
  } catch (err) {
    console.error('Error fetching address:', err);
    return 'Address not available';
  }
}
