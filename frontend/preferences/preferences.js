document.addEventListener("DOMContentLoaded", async () => {
  const preferencesForm = document.getElementById("preferences-form");
  const messageDiv = document.getElementById("message");

  // Load preferences on page load
  try {
    const token = localStorage.getItem('authToken'); // Retrieve the auth token from localStorage
    if (!token) {
      // Redirect to login page if the token is missing
      window.location.href = '../login/login.html';
      return;
    }

    // Fetch user preferences from the API
    const response = await fetch('/api/preferences', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Parse and populate the preferences form with the retrieved data
    if (response.ok) {
      const { preferences } = await response.json();
      document.getElementById("contact-name").value = preferences?.emergencyContact?.name || '';
      document.getElementById("contact-phone").value = preferences?.emergencyContact?.phone || '';
      document.getElementById("contact-relationship").value = preferences?.emergencyContact?.relationship || '';
      document.getElementById("user-phone").value = preferences?.phone || '';
      localStorage.setItem('emergencyphone', preferences?.emergencyContact?.phone);
    } else {
      messageDiv.textContent = "Failed to load preferences.";
    }
  } catch (err) {
    console.error('Error fetching preferences:', err);
    messageDiv.textContent = "An error occurred. Please try again.";
  }

  // Save preferences
  preferencesForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data for emergency contact and user phone
    const emergencyContact = {
      name: document.getElementById("contact-name").value,
      phone: document.getElementById("contact-phone").value,
      relationship: document.getElementById("contact-relationship").value,
    };

    const userPhone = document.getElementById("user-phone").value;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '../login/login.html';
        return;
      }

      // Save the preferences
      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emergencyContact, phone: userPhone }),
      });

      if (response.ok) {
        messageDiv.textContent = "Preferences saved successfully.";
      } else {
        messageDiv.textContent = "Failed to save preferences.";
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      messageDiv.textContent = "An error occurred. Please try again.";
    }
  });
});
