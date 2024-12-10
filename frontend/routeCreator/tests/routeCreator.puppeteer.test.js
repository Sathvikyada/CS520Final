const puppeteer = require("puppeteer");

jest.setTimeout(30000); // Increase timeout for Puppeteer tests

describe("Route Creator Integration Tests", () => {
    let browser, page;

    beforeAll(async () => {
        browser = await puppeteer.launch();
        page = await browser.newPage();
        await page.goto("http://localhost:4000/routeCreator.html"); // Correctly point to the Route Creator page
    });

    afterAll(async () => {
        await browser.close();
    });

    test("Map loads correctly", async () => {
        await page.waitForSelector("#map"); // Wait for the map to load
        const mapExists = await page.$("#map") !== null;
        expect(mapExists).toBe(true);
    });

    test("Route can be calculated", async () => {
        await page.type("#start", "UMass Amherst");
        await page.type("#destination", "Library");
        await page.click("#findRoute");

        await page.waitForSelector("#routeInfo");
        const routeInfo = await page.$eval("#routeInfo", (el) => el.textContent);
        expect(routeInfo).toContain("Distance");
        expect(routeInfo).toContain("Duration");
    });

    test("Start Navigation button shows up after route calculation", async () => {
        await page.type("#start", "UMass Amherst");
        await page.type("#destination", "Library");
        await page.click("#findRoute");

        const buttonVisible = await page.$("#startNavigation") !== null;
        expect(buttonVisible).toBe(true);
    });

    test("SOS button sends alert", async () => {
        const confirmMock = jest.fn(() => true);
        await page.evaluate(() => {
            window.confirm = () => true; // Mock confirmation
        });

        await page.click("#sosButton");
        expect(confirmMock).toHaveBeenCalled();
    });
});
