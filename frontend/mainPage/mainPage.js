document.addEventListener("DOMContentLoaded", () => {
  const createRouteButton = document.getElementById("create-route-btn");
  const preferencesButton = document.getElementById("preferences-btn");
  const chatButton = document.getElementById("chat-btn");
  const logoutButton = document.getElementById("logout-btn");
  const friendsButton = document.getElementById("friends-btn");

  const iframe = document.getElementById("content-frame");
  const defaultMessage = document.getElementById("default-message");

    iframe.style.display = "block";
    iframe.src = "../routeCreator/routeCreator.html";
  
    // Hide the default message when the page loads
    defaultMessage.style.display = "none";

  // Event listeners for the navbar buttons
  createRouteButton.addEventListener("click", () => {
    defaultMessage.style.display = "none";  // Hide the default message
    iframe.style.display = "block";         // Show the iframe
    iframe.src = "../routeCreator/routeCreator.html"; // Load Create Route page
  });

  preferencesButton.addEventListener("click", () => {
    defaultMessage.style.display = "none";  // Hide the default message
    iframe.style.display = "block";         // Show the iframe
    iframe.src = "../preferences/preferences.html"; // Load Preferences page
  });

  chatButton.addEventListener("click", () => {
    defaultMessage.style.display = "none";
    iframe.style.display = "block";
    iframe.src = "../communityChat/communityChat.html";
  });

  friendsButton.addEventListener("click", () => {
    defaultMessage.style.display = "none";
    iframe.style.display = "block";
    iframe.src = "../friends/friends.html";
  });

  logoutButton.addEventListener("click", () => {
    // Clear authentication token from localStorage
    localStorage.removeItem('authToken');

    // Redirect to the login page
    window.location.href = "../landingPage.html";
  });
});