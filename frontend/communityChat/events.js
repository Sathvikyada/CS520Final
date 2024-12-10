document.addEventListener('DOMContentLoaded', async () => {
  const eventList = document.getElementById('event-list');
  const token = localStorage.getItem('authToken');

  if (!token) {
    alert('You must be logged in to view events.');
    window.location.href = '../signIn/signIn.html'; // Redirect to sign-in page
    return;
  }

  try {
    // Fetch all events sorted by danger status and upvotes
    const response = await fetch('/api/events', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    const events = await response.json();

    // Populate events
    events.forEach(event => {
      const eventCard = document.createElement('div');
      eventCard.className = 'event-card';

      // Add a badge if the event is dangerous
      const dangerBadge = event.dangerous 
        ? `<span class="danger-badge">Dangerous</span>` 
        : '';

      eventCard.innerHTML = `
        <h3>${event.title}</h3>
        ${dangerBadge}
        <p>Location: (${event.location.latitude}, ${event.location.longitude})</p>
        <p>Upvotes: <span id="upvote-count-${event._id}">${event.upvotes}</span></p>
        <button class="upvote-btn" data-id="${event._id}">Upvote</button>
      `;
      eventList.appendChild(eventCard);
    });

    // Add event listeners to upvote buttons
    document.querySelectorAll('.upvote-btn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const eventId = e.target.getAttribute('data-id');
        try {
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

          const { upvotes } = await upvoteResponse.json();
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
