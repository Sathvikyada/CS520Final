document.addEventListener("DOMContentLoaded", () => {
  // Sign In form submission
  const signInForm = document.getElementById("sign-in-form");
  const errorMessage = document.getElementById("error-message");

  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
    
      console.log("Response:", response); // Log the response object
    
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('authToken', token); // Save token for later use
        window.location.href = "../mainPage/mainPage.html"; // Redirect on success
      } else {
        const { message } = await response.json();
        console.log("Error Message:", message); // Log the error message
        errorMessage.textContent = message || "Invalid login credentials."; // Display error message
      }
    } catch (err) {
      console.error("Error during login:", err); // Log any other errors
      errorMessage.textContent = "An error occurred. Please try again."; // Generic error message
    }    
  });

  // Show Sign Up modal
  const signupBtn = document.getElementById("signup-btn");
  const signupModal = document.getElementById("signup-modal");
  const closeBtn = document.getElementById("close-btn");

  signupBtn.addEventListener("click", () => {
    signupModal.classList.remove("hidden"); // Remove hidden class to show modal
    signupModal.classList.add("show"); // Add show class to display modal
  });

  closeBtn.addEventListener("click", () => {
    signupModal.classList.remove("show"); // Remove show class to hide modal
    signupModal.classList.add("hidden"); // Add hidden class to hide modal
  });

  // Sign Up form submission
  const signupForm = document.getElementById("signup-form");
  const signupMessage = document.getElementById("signup-message");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        signupMessage.textContent = "Registration successful! Please log in.";
        signupMessage.classList.add("success");
        signupForm.reset();
        signupModal.classList.remove("show"); // Hide modal after registration
        signupModal.classList.add("hidden");
      } else {
        const { message } = await response.json();
        signupMessage.textContent = message || "Registration failed.";
        signupMessage.classList.remove("success");
      }
    } catch (err) {
      signupMessage.textContent = "An error occurred. Please try again.";
      signupMessage.classList.remove("success");
    }
  });
});
