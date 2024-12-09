let map;
let directionsService;
let directionsRenderer;

function initMap() {
    // initialize map at the view of the umass campus
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 42.386, lng: -72.529 },
        zoom: 15,
    });

    // Initialize directions service and renderer
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    //feature that helps the user autocomplete its query search for destination/origin
    const startInput = document.getElementById("start");
    const destinationInput = document.getElementById("destination");

    const autocompleteStart = new google.maps.places.Autocomplete(startInput);
    const autocompleteDestination = new google.maps.places.Autocomplete(destinationInput);

    autocompleteStart.setFields(["geometry", "name"]);
    autocompleteDestination.setFields(["geometry", "name"]);

    //adds blue markers for emergency boxes
    addEmergencyMarkers();
}

//add blue markers on the map for each emergency box (blue light)
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

//Finds the best route for the user walking
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
        travelMode: google.maps.TravelMode.WALKING, //makes sure the route is for those walking
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            // gets the distance and duration so we can display
            const route = result.routes[0].legs[0]; 
            const distance = route.distance.text; 
            const duration = route.duration.text; 

            // Displays the distance and duration
            const routeInfo = document.getElementById("routeInfo");
            routeInfo.innerHTML = `<p><strong>Distance:</strong> ${distance}</p>
                                   <p><strong>Duration:</strong> ${duration}</p>`;
        } else {
            alert("Could not find a route: " + status);
        }
    });
}


// Initializes the map and add event listeners
window.onload = () => {
    initMap();

    document.getElementById("findRoute").addEventListener("click", calculateRoute);
};
