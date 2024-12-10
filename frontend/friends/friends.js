document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('authToken');
  const friendListContainer = document.getElementById('friend-list'); // Ensure this element exists
  const successMessageContainer = document.getElementById('success-message'); // Make sure you have an element for success message

  if (!token) {
    alert('You must be logged in to view your friends.');
    window.location.href = '../signIn/signIn.html'; // Redirect to sign-in page
    return;
  }

  // Fetch the friends list
  const fetchFriends = async () => {
    const response = await fetch('/api/friends/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      alert('Failed to load friends.');
      return;
    }

    const friends = await response.json();

    // Clear the existing friend list
    friendListContainer.innerHTML = '';

    // Render friends list
    friends.forEach(friend => {
      const friendCard = document.createElement('div');
      friendCard.className = 'friend-card';

      // Check if emergencyContact exists
      const emergencyContact = friend.emergencyContact || {};

      friendCard.innerHTML = `
        <h3>${friend.username}</h3>
        <p>Phone: ${friend.phone || 'N/A'}</p>
        <button class="start-location-sharing">Start Location Sharing</button>
        <button class="stop-location-sharing">Stop Location Sharing</button>
      `;
      
      friendListContainer.appendChild(friendCard);
    });
  };

  // Fetch and display friends when the page loads
  await fetchFriends();

  // Add friend logic
  document.getElementById('add-friend-btn').addEventListener('click', async () => {
    const username = document.getElementById('friend-username').value;

    if (!username) {
      displaySuccessMessage('Please enter a username.', 'error');
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

    if (data.success) {
      displaySuccessMessage('Friend added successfully!', 'success');
      // Reload the page
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
    } else {
      displaySuccessMessage(data.message || 'Failed to add friend', 'error');
    }
  });

  function displaySuccessMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('success-message', type);
    messageElement.textContent = message;

    successMessageContainer.innerHTML = '';
    successMessageContainer.appendChild(messageElement);

    // Automatically remove the message after 3 seconds
    setTimeout(() => {
      successMessageContainer.innerHTML = '';
    }, 3000);
  }
});
