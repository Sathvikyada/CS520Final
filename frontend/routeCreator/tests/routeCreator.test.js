/**
 * @jest-environment jsdom
 */

const { JSDOM } = require("jsdom");
const { initMap, addEmergencyMarkers, calculateRoute, stopNavigation } = require("../routeCreator");

// Add TextEncoder and TextDecoder for jsdom compatibility
global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

describe("Route Creator Tests", () => {
    let dom;
    let document;

    beforeEach(() => {
        dom = new JSDOM(
            `<body>
                <div id="map"></div>
                <input type="text" id="start" />
                <input type="text" id="destination" />
                <div id="routeInfo"></div>
                <button id="startNavigation"></button>
            </body>`,
            { runScripts: "dangerously" }
        );
        document = dom.window.document;

        global.google = {
            maps: {
                Map: jest.fn(),
                DirectionsService: jest.fn(),
                DirectionsRenderer: jest.fn(),
                Marker: jest.fn(),
                LatLng: jest.fn(),
                places: {
                    Autocomplete: jest.fn(),
                },
                geometry: {
                    spherical: {
                        computeDistanceBetween: jest.fn(),
                    },
                },
            },
        };
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test("Map initializes correctly", () => {
        expect(() => initMap()).not.toThrow();
        expect(global.google.maps.Map).toHaveBeenCalled();
    });

    test("Emergency markers are added correctly", () => {
        addEmergencyMarkers();
        expect(global.google.maps.Marker).toHaveBeenCalled();
    });

    test("Route is calculated correctly", () => {
        const directionsServiceMock = {
            route: jest.fn((request, callback) => {
                callback(
                    {
                        routes: [
                            {
                                legs: [
                                    {
                                        distance: { text: "1 km" },
                                        duration: { text: "10 mins" },
                                    },
                                ],
                            },
                        ],
                    },
                    "OK"
                );
            }),
        };
        global.google.maps.DirectionsService.mockImplementation(() => directionsServiceMock);
        calculateRoute();

        expect(directionsServiceMock.route).toHaveBeenCalled();
        expect(document.getElementById("routeInfo").innerHTML).toContain("Distance: 1 km");
        expect(document.getElementById("routeInfo").innerHTML).toContain("Duration: 10 mins");
    });

    test("Navigation stops correctly", () => {
        const mockSetCenter = jest.fn();
        const mockSetZoom = jest.fn();
        global.google.maps.Map.mockImplementation(() => ({
            setCenter: mockSetCenter,
            setZoom: mockSetZoom,
        }));

        stopNavigation();

        expect(mockSetZoom).toHaveBeenCalledWith(15);
        expect(document.getElementById("routeInfo").innerHTML).toBe("");
        expect(document.getElementById("start").value).toBe("");
        expect(document.getElementById("destination").value).toBe("");
    });
});
