const puppeteer = require("puppeteer");

const { credentials, pages } = require('./secrets');
const { runDebugChrome } = require('./open-debugging-chrome');

const selectors = {
  ID: '#N1',
  CONTRACT_NUMBER: '#N2',
  CONTRACT_DATE: '#N3',
  AUTH_CODE: '#N4',
  SUBMIT: '#B1',
  MOODLE_BUTTON: '#ImageButton1',
  ISMA_LOADED: '[href="https://beta.moodle.isma.lv"]',
};

(async () => {
  console.info('Starting...');
  // const wsChromeEndpointUrl = await runDebugChrome();
  //
  // const browser = await puppeteer.connect({
  //   browserWSEndpoint: wsChromeEndpointUrl,
  // });
  const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized', '--start-fullscreen'] });
  console.info('Started!');

  const page = (await browser.pages())[0];
  await page.setViewport({ width: 2560 / 2, height: 1600 / 2 });

  await page.waitForTimeout(1000);

  await page.goto(
    "http://my.isma.lv/",
    { waitUntil: "networkidle0" }
  );

  await page.waitForTimeout(1000);

  await page.type(selectors.ID, credentials.id);
  await page.type(selectors.CONTRACT_NUMBER, credentials.contractNumber);
  await page.type(selectors.CONTRACT_DATE, credentials.contractDate);
  await page.type(selectors.AUTH_CODE, credentials.authCode);

  await page.click(selectors.SUBMIT);

  await page.waitForTimeout(1000);
  await page.waitForSelector(selectors.MOODLE_BUTTON);

  await page.click(selectors.MOODLE_BUTTON);

  await page.waitForSelector(selectors.ISMA_LOADED);

  const moodleTasks = pages.map(async (pageName) => {
    const newPage = await browser.newPage();
    await newPage.setViewport({ width: 2560 / 2, height: 1600 / 2 });
    await newPage.goto(pageName);
  });

  await page.goto('https://beta.moodle.isma.lv/grade/report/overview/index.php');

  console.info('Open all pages...');

  await Promise.all(moodleTasks);

  console.info('Done');
})();

