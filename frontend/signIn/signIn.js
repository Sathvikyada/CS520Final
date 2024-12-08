document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("sign-in-form");
  const errorMessage = document.getElementById("error-message");

  // Sign-in form submit logic
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch('http://localhost:4000/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        window.location.href = '../mainPage/mainPage.html';
      } else {
        const result = await response.json();
        errorMessage.textContent = result.message || "Sign-in failed.";
      }
    } catch (error) {
      errorMessage.textContent = "An error occurred. Please try again.";
    }
  });

  const signupModal = document.getElementById('signup-modal');
  const signupBtn = document.getElementById('signup-btn');
  const closeBtn = document.getElementById('close-btn');
  
  // Open the sign-up modal when Sign Up button is clicked
  signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'block';
  });

  // Close the modal when the close button (X) is clicked
  closeBtn.addEventListener('click', () => {
    signupModal.style.display = 'none';
  });

  // Close the modal if the user clicks anywhere outside of the modal
  window.addEventListener('click', (event) => {
    if (event.target === signupModal) {
      signupModal.style.display = 'none';
    }
  });

  // Sign-up form submission
  const signupForm = document.getElementById("signup-form");
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newUsername = document.getElementById("new-username").value;
    const newPassword = document.getElementById("new-password").value;

    try {
      const response = await fetch('http://localhost:4000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });

      if (response.ok) {
        alert("Sign-up successful!");
        signupModal.style.display = 'none';
      } else {
        const result = await response.json();
        alert(result.message || "Sign-up failed.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  });
});
