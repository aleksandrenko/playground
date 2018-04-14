const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await page.screenshot({path: 'e2e/screenshots/example-' + new Date().toString() + '.png'});

  await browser.close();
})();
