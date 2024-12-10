let map;
let directionsService;
let directionsRenderer;
let currentPositionMarker;
let sosInterval;

/**
 * Initializes the Google Map centered at the UMass campus. 
 * Sets up direction services, route rendering, autocomplete functionality,
 * emergency box markers, current location tracking, and event marker placement.
 */
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 42.386, lng: -72.529 },
        zoom: 15,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        polylineOptions: {
            strokeColor: "red", 
            strokeWeight: 5,   
        },
    });
    directionsRenderer.setMap(map);

    // Autocomplete for start and destination
    const startInput = document.getElementById("start");
    const destinationInput = document.getElementById("destination");

    const autocompleteStart = new google.maps.places.Autocomplete(startInput);
    const autocompleteDestination = new google.maps.places.Autocomplete(destinationInput);

    autocompleteStart.setFields(["geometry", "name"]);
    autocompleteDestination.setFields(["geometry", "name"]);

    // Add blue markers for emergency boxes
    addEmergencyMarkers();

    // Track user's current location
    trackCurrentLocation();

    //Enables user added event markers
    enableMarkerPlacement();
}

/**
 * Adds predefined emergency markers to the map with blue icons.
 * Clicking a marker shows an InfoWindow with the location name.
 */
function addEmergencyMarkers() {
    const blueMarkerIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

    const emergencyBoxes = [
        {"location": "358 N Pleasant St.", "lat": 42.3828003, "lng": -72.5233708}, 
        {"location": "Baker House", "lat": 42.3895591, "lng": -72.5199808}, 
        {"location": "Bartlett \u2013 West Side", "lat": 42.3879676, "lng": -72.531249}, 
        {"location": "Berkshire DC \u2013 South Side- Malcom X", "lat": 42.3819085, "lng": -72.5325428}, 
        {"location": "Berkshire House \u2013 South Side", "lat": 42.3855426, "lng": -72.5315166}, 
        {"location": "Birch", "lat": 42.3880345, "lng": -72.5338728}, 
        {"location": "Boyden Field \u2013 Tunnel Entrance", "lat": 42.386225, "lng": -72.5353479}, 
        {"location": "Brett House", "lat": 42.3894571, "lng": -72.5241368}, 
        {"location": "Brooks House", "lat": 42.3898921, "lng": -72.5235905}, 
        {"location": "Brown House", "lat": 42.3975058, "lng": -72.5255143}, 
        {"location": "Burma Trail \u2013 Orchard Hill", "lat": 42.3940649, "lng": -72.5241485}, 
        {"location": "Bus Shelter B \u2013 Stadium Rd.", "lat": 42.3790682, "lng": -72.5366818},
        {"location": "Bus Shelter C \u2013 Olympia Dr.", "lat": 42.395447, "lng": -72.5140719}, 
        {"location": "Bus Shelter D \u2013 Lot 12 behind Parking Services", "lat": 42.392177, "lng": -72.5376411}, 
        {"location": "Bus Shelter E \u2013 Mass Ave / Sunset", "lat": 42.3798203, "lng": -72.5299287}, 
        {"location": "Butterfield House", "lat": 42.388535, "lng": -72.520758}, 
        {"location": "Campus Center Parking Garage \u2013 Loading Dock", "lat": 42.3912006, "lng": -72.5316747}, 
        {"location": "Campus Pond \u2013 West Side", "lat": 42.3900109, "lng": -72.5253501}, 
        {"location": "Cance House \u2013 Front (North Side)", "lat": 42.3810958, "lng": -72.5324821}, 
        {"location": "Cashin House", "lat": 42.3974806, "lng": -72.5243902}, 
        {"location": "Chadbourne House", "lat": 42.3893424, "lng": -72.5216664}, 
        {"location": "Champions Center S. West \u2013 Back Door", "lat": 42.3883976, "lng": -72.535292}, 
        {"location": "Chenoweth", "lat": 42.3920879, "lng": -72.5328105}, 
        {"location": "Computer Science \u2013 North Entrance", "lat": 42.395155, "lng": -72.5320253},
        {"location": "Computer Science \u2013 Southwest Corner", "lat": 42.395155, "lng": -72.5320253}, 
        {"location": "Conte Loading Dock", "lat": 42.3258149, "lng": -72.5333646},
        {"location": "Coolidge Tower", "lat": 42.3836719, "lng": -72.5324764}, 
        {"location": "Crabtree House", "lat": 42.3940168, "lng": -72.5276155},
        {"location": "Crampton House", "lat": 42.383376, "lng": -72.5314189}, 
        {"location": "Curry Hicks", "lat": 42.3869766, "lng": -72.5308179}, 
        {"location": "Dickinson House", "lat": 42.3921189, "lng": -72.5222402},
        {"location": "Draper Annex \u2013 East Side", "lat": 42.3923751, "lng": -72.529093}, 
        {"location": "Durfee \u2013 North Side", "lat": 42.3906299, "lng": -72.5251164},
        {"location": "Dwight House", "lat": 42.3953759, "lng": -72.527793}, 
        {"location": "ELAB II \u2013 North End", "lat": 42.3942554, "lng": -72.5318593},
        {"location": "ELAB II \u2013 South End", "lat": 42.3942651, "lng": -72.531796}, 
        {"location": "Elm East", "lat": 42.3781768, "lng": -72.5284888},
        {"location": "Elm West", "lat": 42.378375, "lng": -72.524991}, 
        {"location": "Emerson House", "lat": 42.3834682, "lng": -72.5339336},
        {"location": "Field House", "lat": 42.3916293, "lng": -72.5211382},
        {"location": "Franklin DC ATM", "lat": 42.3894871, "lng": -72.5228677},
        {"location": "Furcolo", "lat": 42.3982195, "lng": -72.5290648}, 
        {"location": "Gordon Hall", "lat": 42.3848695, "lng": -72.5245028}, 
        {"location": "Goodell \u2013 Upper Entrance", "lat": 42.3886711, "lng": -72.5318386},
        {"location": "Gorman House", "lat": 42.3874802, "lng": -72.5235953}, 
        {"location": "Grayson House", "lat": 42.3922361, "lng": -72.5213507},
        {"location": "Greenough House", "lat": 42.3899945, "lng": -72.5218677},
        {"location": "Hampshire DC ATM", "lat": 42.3838499, "lng": -72.5330939}, 
        {"location": "Hamlin House", "lat": 42.3950718, "lng": -72.5290643},
        {"location": "Health Services \u2013 Main Entrance", "lat": 42.3903742, "lng": -72.5242077},
        {"location": "Herter \u2013 Haigis Mall @ Bus Stop", "lat": 42.387095, "lng": -72.526445},
        {"location": "ILC East \u2013 Second Floor", "lat": 42.390946, "lng": -72.545321},
        {"location": "ILC North \u2013 First Floor", "lat": 42.391435, "lng": -72.526266},
        {"location": "ILC West \u2013 Second Floor", "lat": 42.390866, "lng": -72.526293},
        {"location": "ISB East", "lat": 42.392359, "lng": -72.52521},
        {"location": "ISB East \u2013 Second Floor", "lat": 42.392806, "lng": -72.524902},
        {"location": "ISB West", "lat": 42.392449, "lng": -72.524736},
        {"location": "James House", "lat": 42.3841787, "lng": -72.5337553},
        {"location": "John Adams Tower", "lat": 42.3818423, "lng": -72.5312886},
        {"location": "John Q Adams Tower \u2013 East Side", "lat": 42.382014, "lng": -72.528897},
        {"location": "John Q Adams Tower \u2013 West Side", "lat": 42.381636, "lng": -72.528923},
        {"location": "Johnson House", "lat": 42.3955609, "lng": -72.5270909},
        {"location": "Kennedy Tower", "lat": 42.3840782, "lng": -72.5322115},
        {"location": "Knowlton House", "lat": 42.3937843, "lng": -72.5282655}, 
        {"location": "Leach House", "lat": 42.3951734, "lng": -72.5283311},
        {"location": "Lewis House", "lat": 42.3951096, "lng": -72.5265239},
        {"location": "Life Science Lab \u2013 East Side", "lat": 42.392755, "lng": -72.524125},
        {"location": "Life Science Lab \u2013 West Side", "lat": 42.391393, "lng": -72.523295},
        {"location": "Linden", "lat": 42.3870226, "lng": -72.5334561}, 
        {"location": "Lot 22 East Side \u2013 University Dr.", "lat": 42.3804494, "lng": -72.5353179}, 
        {"location": "Lot 44 \u2013 South of Cashin", "lat": 42.3989473, "lng": -72.5270459}, 
        {"location": "Lot 44 to Lot 49 Pathway", "lat": 42.394939, "lng": -72.520508}, 
        {"location": "Lot 66 \u2013 North Side of Furcolo", "lat": 42.3991727, "lng": -72.5296641}, 
        {"location": "Lot 71 \u2013 Entrance to Whitmore", "lat": 42.3855449, "lng": -72.5292336}, 
        {"location": "Mackimmie House \u2013 Front (East Side)", "lat": 42.382548, "lng": -72.5312017}, 
        {"location": "Mackimmie House \u2013 Rear (West Side)", "lat": 42.38257, "lng": -72.529075}, 
        {"location": "Mahar Auditorium", "lat": 42.3865975, "lng": -72.5268119}, 
        {"location": "Maple", "lat": 42.3875513, "lng": -72.5335576}, 
        {"location": "Mary Lyon House", "lat": 42.3941624, "lng": -72.5270719}, 
        {"location": "Mather Admissions Building", "lat": 42.3947356, "lng": -72.5140972}, 
        {"location": "McGuirk Stadium \u2013 Lot 11", "lat": 42.3793124, "lng": -72.5383609}, 
        {"location": "McNamara \u2013 On Path to Lot 44", "lat": 42.398347, "lng": -72.52313}, 
        {"location": "McNamara House", "lat": 42.3979153, "lng": -72.5236711}, 
        {"location": "Memorial Hall/Herter \u2013 On Pathway Between", "lat": 42.387815, "lng": -72.526936}, 
        {"location": "Melville House", "lat": 42.384711, "lng": -72.5333494}, 
        {"location": "Moore House", "lat": 42.3820512, "lng": -72.5333725}, 
        {"location": "Morrill \u2013 Between IV &II", "lat": 42.3898044, "lng": -72.5273291}, 
        {"location": "Mullins Center \u2013 Northwest Team Entrance", "lat": 42.390008, "lng": -72.533758}, 
        {"location": "Mullins Center \u2013 Southwest Media Entrance", "lat": 42.388718, "lng": -72.533102}, 
        {"location": "Mullins Practice Rink \u2013 Southeast Side", "lat": 42.390463, "lng": -72.5364027}, 
        {"location": "North A", "lat": 42.397496, "lng": -72.5266631}, 
        {"location": "North B", "lat": 42.3967237, "lng": -72.526758}, 
        {"location": "North C", "lat": 42.3976485, "lng": -72.5276753}, 
        {"location": "North D", "lat": 42.3968141, "lng": -72.5277259}, 
        {"location": "North Pleasant St. Bus Stop", "lat": 42.39346, "lng": -72.5302499}, 
        {"location": "Oak", "lat": 42.3873358, "lng": -72.5327575}, 
        {"location": "Observatory", "lat": 42.3940649, "lng": -72.5241485}, 
        {"location": "Olympia Drive \u2013 Lot 13", "lat": 42.3950775, "lng": -72.5163369}, 
        {"location": "Orchard Hill Dr", "lat": 42.3903667, "lng": -72.5218096}, 
        {"location": "Orchard Hill \u2013 Lot 49", "lat": 42.3929109, "lng": -72.5228112}, 
        {"location": "Patterson House \u2013 Front (East Side)", "lat": 42.3817924, "lng": -72.5293965}, 
        {"location": "Patterson House \u2013 Rear (West Side)", "lat": 42.381342, "lng": -72.528328}, 
        {"location": "Pierpont House", "lat": 42.3814007, "lng": -72.5333825}, 
        {"location": "Prince House", "lat": 42.3840663, "lng": -72.5315037}, 
        {"location": "Rec Center East", "lat": 42.389183, "lng": -72.532211}, 
        {"location": "Rec Center West", "lat": 42.388406, "lng": -72.531876}, 
        {"location": "Robsham Visitors\u2019 Center", "lat": 42.3850288, "lng": -72.5264573}, 
        {"location": "South College", "lat": 42.3893646, "lng": -72.5324199}, 
        {"location": "Skinner Hall East", "lat": 42.391832, "lng": -72.524798}, 
        {"location": "Skinner Hall West", "lat": 42.391311, "lng": -72.524647}, 
        {"location": "Student Union \u2013 Southwest Corner", "lat": 42.3553205, "lng": -72.6591414}, 
        {"location": "Thoreau House", "lat": 42.3843426, "lng": -72.5328205}, 
        {"location": "Totman \u2013 Lot 27", "lat": 42.3967484, "lng": -72.5297223}, 
        {"location": "University Drive \u2013 Bike Path near Dallas Mall", "lat": 42.3774694, "lng": -72.5343655}, 
        {"location": "University Drive \u2013 Bike Path near James", "lat": 42.384017, "lng": -72.531865}, 
        {"location": "Van Meter House \u2013 East Side", "lat": 42.38933, "lng": -72.518124}, 
        {"location": "Van Meter House \u2013 West Side", "lat": 42.390379, "lng": -72.518504}, 
        {"location": "Washington Tower", "lat": 42.3815742, "lng": -72.5319432}, 
        {"location": "Webster House", "lat": 42.3915267, "lng": -72.5220457}, 
        {"location": "Wheeler House \u2013 East", "lat": 42.3886948, "lng": -72.5220121}, 
        {"location": "Wheeler House \u2013 West", "lat": 42.389207, "lng": -72.521356}, 
        {"location": "Whitmore \u2013 East Side Main Entrance", "lat": 42.3861466, "lng": -72.5274466}, 
        {"location": "Wilder \u2013 East Side", "lat": 42.3902954, "lng": -72.5263111}, 
        {"location": "Windmill Lane - North Side", "lat": 42.3906977, "lng": -72.5202421}, 
        {"location": "Worcester DC ATM", "lat": 42.3935899, "lng": -72.526872}
    ];

    emergencyBoxes.forEach((box) => {
        const marker = new google.maps.Marker({
            position: { lat: box.lat, lng: box.lng },
            map: map,
            title: box.location,
            icon: blueMarkerIcon,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div><strong>${box.location}</strong></div>`,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });
}

/**
 * Tracks the user's current location and places a green marker on the map.
 * Updates the marker's position as the user moves.
 */
function trackCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const userLatLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                if (currentPositionMarker) {
                    currentPositionMarker.setPosition(userLatLng);
                } else {
                    currentPositionMarker = new google.maps.Marker({
                        position: userLatLng,
                        map: map,
                        title: "Your Current Location",
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        },
                    });
                }

                map.setCenter(userLatLng);
            },
            (error) => {
                console.error("Error getting user location:", error);
                alert("Unable to access your location. Please enable location services.");
            },
            {
                enableHighAccuracy: true,
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

let navigationInterval;

/**
 * Starts navigation by tracking the user's real-time location.
 * Immediately centers the map on the user's location and sets the zoom level.
 */
function startNavigation() {
    if (navigator.geolocation) {
        navigationInterval = navigator.geolocation.watchPosition(
            (position) => {
                const userLatLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                if (currentPositionMarker) {
                    currentPositionMarker.setPosition(userLatLng);
                } else {
                    currentPositionMarker = new google.maps.Marker({
                        position: userLatLng,
                        map: map,
                        title: "Your Current Location",
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        },
                    });
                }
                
                map.setCenter(userLatLng);
                map.setZoom(18); 
            },
            (error) => {
                console.error("Error tracking location:", error);
                alert("Unable to access your location. Please enable location services.");
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,            
                timeout: 100000,      
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}


/**
 * Stops the navigation process, clears location tracking, resets the map, and input fields.
 * Hides the navigation button, removes the route from the map, resets the map's center and zoom,
 * and clears the route information (distance and duration).
 */
function stopNavigation() {
    if (navigationInterval) {
        navigator.geolocation.clearWatch(navigationInterval);
        navigationInterval = null;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLatLng = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    map.setCenter(userLatLng);
                    map.setZoom(15); 
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to access your location.");
                },
                {
                    enableHighAccuracy: true,
                }
            );
        }

        const startNavButton = document.getElementById("startNavigation");
        startNavButton.style.display = "none";

        directionsRenderer.setDirections({ routes: [] });
        document.getElementById("start").value = "";
        document.getElementById("destination").value = "";
        document.getElementById("routeInfo").innerHTML = "";

        alert("Trip ended");
    }
}


// Show the "Start Navigation" button after creating a route
function showStartNavigationButton() {
    const startNavButton = document.getElementById("startNavigation");
    startNavButton.style.display = "block";

    startNavButton.addEventListener("click", () => {
        if (startNavButton.innerText === "Start Navigation") {
            startNavigation();
            startNavButton.innerText = "Stop Navigation";
            startNavButton.style.backgroundColor = "red";
        } else {
            stopNavigation();
            startNavButton.innerText = "Start Navigation";
            startNavButton.style.backgroundColor = "green";
        }
    });
}

/**
 * Calculates a walking route between the start and destination inputs.
 * Displays the route on the map and shows distance and duration details.
 */
function calculateRoute() {
    const start = document.getElementById("start").value;
    const destination = document.getElementById("destination").value;

    if (!start || !destination) {
        alert("Please enter both start and destination locations.");
        return;
    }

    const request = {
        origin: start,
        destination: destination,
        travelMode: google.maps.TravelMode.WALKING, // Walking route
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            const route = result.routes[0].legs[0];
            const distance = route.distance.text;
            const duration = route.duration.text;

            const routeInfo = document.getElementById("routeInfo");
            routeInfo.innerHTML = `<p><strong>Distance:</strong> ${distance}</p>
                                   <p><strong>Duration:</strong> ${duration}</p>`;

            showStartNavigationButton();
        } else {
            alert("Could not find a route: " + status);
        }
    });
}


// Initialize the map and add event listeners
window.onload = () => {
    initMap();

    document.getElementById("findRoute").addEventListener("click", calculateRoute);
};

//Event listener for sos button along with a check to make sure it was an intended action
document.getElementById("sosButton").addEventListener("click", () => {
    if (confirm("Are you sure you want to send an SOS alert?")) {
        sendSOSAlert();
        trackLocationForSOS();
    }
});

/**
 * Sends an SOS alert to a predefined recipient with a custom message.
 * The SOS is sent to the server, which relays it as an SMS using Textbelt.
 */
async function sendSOSAlert() {
    const sosRecipient = "+14019544773"; //placeholder number 
    const message = "mferreira0330@gmail.com: Nightingale: SOS! I need help. Please track my location.";

    try {
        const response = await fetch("/api/routeCreator/sos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipient: sosRecipient,
                message: message,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            alert(data.message); // "SOS alert sent successfully!"
        } else {
            const errorData = await response.json();
            alert(`Failed to send SOS alert: ${errorData.message}`);
        }
    } catch (error) {
        console.error("Error sending SOS alert:", error);
        alert("An error occurred while sending the SOS alert.");
    }
}

/**
 * Tracks the user's location specifically for SOS mode.
 * Updates the server periodically with the user's current coordinates.
 */
function trackLocationForSOS() {
    if (navigator.geolocation) {
        sosInterval = navigator.geolocation.watchPosition(
            (position) => {
                const userLatLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                sendLocationToServer(userLatLng);
            },
            (error) => {
                console.error("Error tracking location for SOS:", error);
                alert("Unable to track location.");
            },
            { enableHighAccuracy: true }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

/**
 * Sends the user's current location to the server during SOS mode.
 * This helps maintain real-time tracking for emergencies.
 * @param {Object} location - Object containing latitude and longitude.
 */
async function sendLocationToServer(location) {
    try {
        const response = await fetch("/api/routeCreator/update-location", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(location),
        });

        if (response.ok) {
            console.log("Location updated successfully.");
        } else {
            console.error("Failed to update location:", await response.text());
        }
    } catch (error) {
        console.error("Error updating location on server:", error);
    }
}

/**
 * Tracks the user's progress along a specified route.
 * Sends SMS alerts when the user is halfway to the destination and upon arrival.
 * @param {Object} route - The route details returned by Google Maps DirectionsService.
 */
function trackUserProgress(route) {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const userLatLng = new google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude
                );

                // Check if user is halfway
                const halfwayPoint = halfwayMarker.getPosition();
                if (google.maps.geometry.spherical.computeDistanceBetween(userLatLng, halfwayPoint) < 50) {
                    sendSMS("You are halfway to your destination.");
                    halfwayMarker.setMap(null); 
                }

                // Check if user is at the destination
                const destination = route.end_location;
                if (google.maps.geometry.spherical.computeDistanceBetween(userLatLng, destination) < 50) {
                    sendSMS("You have arrived at your destination.");
                    stopTracking(); 
                }
            },
            (error) => {
                console.error("Error tracking user progress:", error);
            },
            { enableHighAccuracy: true }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

/**
 * Sends an SMS notification via the server.
 * Used for milestones like reaching halfway or the destination.
 * @param {string} message - The message to be sent via SMS.
 */
async function sendSMS(message) {
    const recipient = "+14019544773"; //placeholder
    try {
        const response = await fetch("/api/routeCreator/send-sms", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipient: recipient,
                message: message,
            }),
        });

        if (response.ok) {
            console.log("SMS sent successfully.");
        } else {
            console.error("Failed to send SMS:", await response.text());
        }
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
}


/**
 * Stops tracking the user's location during SOS or route monitoring.
 * Clears the geolocation watch and alerts the user that tracking has stopped.
 */
function stopTracking() {
    if (sosInterval) {
        navigator.geolocation.clearWatch(sosInterval);
        alert("You have reached your destination. SOS tracking stopped.");
    }
}

// Array to store user-added markers
let userMarkers = [];

/**
 * Enables users to place custom markers on the map by clicking.
 * Prompts the user to label the marker and mark it as dangerous or non-dangerous.
 */
function enableMarkerPlacement() {
    // Add a click listener to the map
    map.addListener("click", (event) => {
        const clickedLocation = event.latLng;
        const description = prompt("Enter a description for this marker:");

        // If the user cancels or provides no description, do nothing
        if (!description) return;

        const isDangerous = confirm("Is this event dangerous? Click 'OK' for Yes, 'Cancel' for No.");

        const markerIcon = isDangerous
            ? "http://maps.google.com/mapfiles/ms/icons/orange-dot.png" // Orange for dangerous
            : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"; // Yellow for non-dangerous

        const marker = new google.maps.Marker({
            position: clickedLocation,
            map: map,
            title: description,
            icon: markerIcon,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<div>
                        <strong>Description:</strong> ${description}<br>
                        <strong>Type:</strong> ${isDangerous ? "Dangerous" : "Non-dangerous"}
                      </div>`,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        userMarkers.push({ marker, description, isDangerous });

        //Log the markers to the console for debugging
        console.log("Markers:", userMarkers);
    });
}

