const puppeteer = require( 'puppeteer');
const ScreenTest = require('puppeteer-screenshot-tester');

describe('google test', () => {
    let originalTimeout;

    // extend default interval to 10s because some image processing might take some time
    // we can do it beforeEach or once per test suite it's up to you
    // if you're running that on fast computer/server probably won't need to do that
    beforeEach(function() {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
    });

    // set default interval timeout for jasmine
    afterEach(function() {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout
    });

    it(`check if google exists`, async () => {
        // create ScreenshotTester with optional config
        const tester = await ScreenTest();

        // setting up puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setViewport({width: 1200, height: 800});
        await page.goto('https://www.google.com', { waitUntil: 'networkidle0' });
        await page.type('#lst-ib', 'Aleksandrenko', { delay: 100 });

        // call our tester with browser page returned by puppeteer browser
        // second parameter is optional it's just a test name if provide that's filename
        const result = await tester(page, './screenshots/google');
        await browser.close();

        // make assertion result is always boolean
        expect(result).toBe(true);

    })
});