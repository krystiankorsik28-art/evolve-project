import { chromium } from 'playwright';

const operaPath = 'C:\\Users\\Wychowanek.St8\\AppData\\Local\\Programs\\Opera GX\\131.0.5877.111\\opera.exe';

const browser = await chromium.launchPersistentContext(
  'C:\\Users\\Wychowanek.St8\\AppData\\Local\\Temp\\opera-profile',
  {
    executablePath: operaPath,
    headless: false,
    args: ['--start-maximized'],
  }
);

const page = await browser.newPage();
await page.goto('https://panel.nazwa.pl');
console.log('Nazwa.pl panel opened. Waiting for manual login...');
await page.waitForTimeout(60000);
await browser.close();
