document.addEventListener("DOMContentLoaded", async () => {
  const preferencesForm = document.getElementById("preferences-form");
  const messageDiv = document.getElementById("message");

  // Load preferences on page load
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '../login/login.html';
      return;
    }

    const response = await fetch('/api/preferences', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const { preferences } = await response.json();
      document.getElementById("contact-name").value = preferences?.emergencyContact?.name || '';
      document.getElementById("contact-phone").value = preferences?.emergencyContact?.phone || '';
      document.getElementById("contact-relationship").value = preferences?.emergencyContact?.relationship || '';
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

    const emergencyContact = {
      name: document.getElementById("contact-name").value,
      phone: document.getElementById("contact-phone").value,
      relationship: document.getElementById("contact-relationship").value,
    };

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '../login/login.html';
        return;
      }

      const response = await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ emergencyContact }),
      });

      if (response.ok) {
        messageDiv.textContent = "Preferences saved successfully.";
        messageDiv.className = 'success';
      } else {
        messageDiv.textContent = "Failed to save preferences.";
        messageDiv.className = 'error';
      }
    } catch (err) {
      console.error('Error saving preferences:', err);
      messageDiv.textContent = "An error occurred. Please try again.";
      messageDiv.className = 'error';
    }
  });
});
