document.addEventListener("DOMContentLoaded", () => {
  const createRouteButton = document.getElementById("create-route-btn");
  const preferencesButton = document.getElementById("preferences-btn");
  const chatButton = document.getElementById("chat-btn");

  const iframe = document.getElementById("content-frame");
  const defaultMessage = document.getElementById("default-message");

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
    defaultMessage.style.display = "none";  // Hide the default message
    iframe.style.display = "block";         // Show the iframe
    iframe.src = "../communityChat/communityChat.html"; // Load Community Chat page
  });
});
