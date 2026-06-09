import { chromium } from 'playwright';

const USER = 'server724363.nazwa.pl';
const PASS = 'Eryk0501';

const operaPath = 'C:\\Users\\Wychowanek.St8\\AppData\\Local\\Programs\\Opera GX\\131.0.5877.111\\opera.exe';

const browser = await chromium.launch({
  executablePath: operaPath,
  headless: false,
  args: ['--start-maximized'],
});

const context = await browser.newContext();
const page = await context.newPage();

// Try main nazwa.pl login page
console.log('Opening main nazwa.pl panel...');
await page.goto('https://login.nazwa.pl/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
console.log('Login page URL:', page.url());

// Check if there's a login form
const hasLoginForm = await page.$('input[type="password"]');
console.log('Has login form:', !!hasLoginForm);

if (hasLoginForm) {
  // Try logging in
  await page.fill('input[name="username"]', USER);
  await page.fill('input[name="password"]', PASS);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  console.log('After login URL:', page.url());
}

const bodyText = await page.innerText('body');
console.log('Page content:', bodyText.substring(0, 1500));
await page.screenshot({ path: 'C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\main-login.png', fullPage: false });

await page.waitForTimeout(60000);
await browser.close();
