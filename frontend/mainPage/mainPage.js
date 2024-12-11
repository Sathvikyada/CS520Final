document.addEventListener("DOMContentLoaded", () => {
  // Get navbar buttons and other DOM elements
  const createRouteButton = document.getElementById("create-route-btn");
  const preferencesButton = document.getElementById("preferences-btn");
  const chatButton = document.getElementById("chat-btn");
  const logoutButton = document.getElementById("logout-btn");
  const friendsButton = document.getElementById("friends-btn");

  // Get the username from localStorage and update the logout button's text
  const username = localStorage.getItem('username');
  if (username) {
    logoutButton.textContent = `Logout ${username}`;
  }

  // Get the iframe and the default message element
  const iframe = document.getElementById("content-frame");
  const defaultMessage = document.getElementById("default-message");

  // Defualt View on page load
    iframe.style.display = "block";
    iframe.src = "../routeCreator/routeCreator.html";

    defaultMessage.style.display = "none";

  // Event listeners for the navbar buttons and switch views when clicked
  createRouteButton.addEventListener("click", () => {
    defaultMessage.style.display = "none";
    iframe.style.display = "block";
    iframe.src = "../routeCreator/routeCreator.html";
  });

  preferencesButton.addEventListener("click", () => {
    defaultMessage.style.display = "none";
    iframe.style.display = "block";
    iframe.src = "../preferences/preferences.html";
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

  // Logout button functionality
  logoutButton.addEventListener("click", () => {
    // Clear authentication token from localStorage
    localStorage.removeItem('authToken');

    // Redirect to the login page
    window.location.href = "../landingPage.html";
  });
});