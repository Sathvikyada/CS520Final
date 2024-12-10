document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken');
  const friendListContainer = document.getElementById('friend-list');
  const notificationContainer = document.createElement('div');
  notificationContainer.id = 'notification-container';
  document.body.appendChild(notificationContainer);

  let locationWatchId = null; // Variable to track location sharing

  if (!token) {
    showNotification('You must be logged in to view your friends.', 'error');
    setTimeout(() => {
      window.location.href = '../signIn/signIn.html'; // Redirect to sign-in page
    }, 3000);
    return;
  }

  const fetchFriends = async () => {
    const response = await fetch('/api/friends/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      showNotification('Failed to load friends.', 'error');
      return;
    }

    const friends = await response.json();

    // Clear the existing friend list
    friendListContainer.innerHTML = '';

    // Render the friends list
    friends.forEach(friend => {
      const friendCard = document.createElement('div');
      friendCard.className = 'friend-card';

      friendCard.innerHTML = `
        <h3>${friend.username}</h3>
        <p>Phone: ${friend.phone || 'N/A'}</p>
        <button class="start-location-sharing" data-phone="${friend.phone}">Start Location Sharing</button>
        <button class="stop-location-sharing" style="display: none;">Stop Location Sharing</button>
      `;

      friendListContainer.appendChild(friendCard);
    });

    // Add event listeners for location sharing
    addLocationSharingListeners();
  };

  const addLocationSharingListeners = () => {
    const shareLocationButtons = document.querySelectorAll('.start-location-sharing');
    const stopLocationButtons = document.querySelectorAll('.stop-location-sharing');

    shareLocationButtons.forEach((button, index) => {
      button.addEventListener('click', async () => {
        const phone = button.getAttribute('data-phone');

        if (!phone) {
          showNotification('No phone number available for this friend.', 'error');
          return;
        }

        if (navigator.geolocation) {
          locationWatchId = navigator.geolocation.watchPosition(
            async position => {
              const userLat = position.coords.latitude;
              const userLng = position.coords.longitude;

              // Send location to the server
              const response = await fetch('/api/friends/send-location', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  phone,
                  location: {
                    latitude: userLat,
                    longitude: userLng,
                  },
                }),
              });

              if (!response.ok) {
                throw new Error('Failed to send location.');
              }

              showNotification('Location shared successfully!', 'success');
            },
            error => {
              console.error('Error getting location:', error);
              showNotification('Unable to access your location. Please enable location services.', 'error');
            },
            {
              enableHighAccuracy: true,
            }
          );

          button.style.display = 'none';
          stopLocationButtons[index].style.display = 'inline-block';
        } else {
          showNotification('Geolocation is not supported by your browser.', 'error');
        }
      });
    });

    stopLocationButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (locationWatchId !== null) {
          navigator.geolocation.clearWatch(locationWatchId);
          locationWatchId = null;

          showNotification('Location sharing stopped.', 'success');
          button.style.display = 'none';
          shareLocationButtons[index].style.display = 'inline-block';
        }
      });
    });
  };

  // Fetch and display friends when the page loads
  await fetchFriends();

  // Add friend logic
  document.getElementById('add-friend-btn').addEventListener('click', async () => {
    username = document.getElementById('friend-username').value;

    if (!username) {
      showNotification('Please enter a username.', 'error');
      return;
    }

    const response = await fetch('/api/friends/add', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (response.ok) {
      showNotification('Friend added successfully!', 'success');
      setTimeout(() => {
        window.location.reload(); // Reload the page to refresh the friend list
      }, 1000);
    } else {
      showNotification(data.message || 'Failed to add friend.', 'error');
    }
  });

  /**
   * Displays a notification message in the UI.
   * @param {string} message - The notification message to display.
   * @param {string} type - The type of notification: "success" or "error".
   */
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerText = message;

    notificationContainer.appendChild(notification);

    // Remove the notification after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
});
