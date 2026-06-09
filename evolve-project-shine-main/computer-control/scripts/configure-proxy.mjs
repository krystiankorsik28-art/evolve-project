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

// 1. Login
console.log('Logging in...');
await page.goto('https://login.nazwa.pl/realms/chp/protocol/openid-connect/auth?redirect_uri=https%3A%2F%2Fadmin.nazwa.pl%2Flogin%2Ffallback&state=86e36dc9daee6f1d26aa2c25728e8984&scope=openid%20profile%20cloudHosting%20roles&response_type=code&approval_prompt=auto&client_id=chp-app', { waitUntil: 'networkidle' });
await page.fill('input[name="username"]', USER);
await page.fill('input[name="password"]', PASS);
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);
console.log('Logged in:', page.url());

// 2. Go to add domain page
console.log('Navigating to add domain...');
await page.goto('https://admin.nazwa.pl/domains/add/edunex.pl', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
console.log('Add domain page:', page.url());

// 3. Fill form via evaluate (bypass visibility issues)
await page.evaluate(() => {
  // Set domain name
  const nameInput = document.querySelector('input[name="domain_add[name]"]');
  if (nameInput) {
    nameInput.value = 'proxy.edunex.pl';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    nameInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
  
  // Ensure WWW is enabled
  const wwwRadio = document.querySelector('input[name="domain_add[wwwEnabled]"][value="1"]');
  if (wwwRadio) {
    wwwRadio.checked = true;
    wwwRadio.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Select Node.js
  const nodejsRadio = document.querySelector('input[name="domain_add[interpreter]"][value="nodejs"]');
  if (nodejsRadio) {
    nodejsRadio.checked = true;
    nodejsRadio.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Show interpreter settings
  document.querySelectorAll('.interpreter-settings').forEach(el => {
    el.style.display = '';
  });

  // Set directory to /proxy
  const dirInput = document.querySelector('input[name="domain_add[dir]"]');
  if (dirInput) {
    dirInput.value = '/proxy';
    dirInput.dispatchEvent(new Event('input', { bubbles: true }));
    dirInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Enable dev mode
  const devMode = document.querySelector('input[name="domain_add[interpreterDevMode]"]');
  if (devMode) {
    devMode.checked = true;
    devMode.dispatchEvent(new Event('change', { bubbles: true }));
  }
});
console.log('Form filled via JS');

await page.waitForTimeout(1000);

// Take screenshot
await page.screenshot({ path: 'C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\before-submit.png', fullPage: false });
console.log('Screenshot taken');

// Submit
console.log('Submitting...');
await page.evaluate(() => {
  const btn = document.querySelector('button[name="domain_add[Save]"]');
  if (btn) btn.click();
});

await page.waitForTimeout(5000);
console.log('After submit URL:', page.url());
await page.screenshot({ path: 'C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\after-submit.png', fullPage: false });

// Check result
const bodyText = await page.innerText('body');
console.log('Response:', bodyText.substring(0, 1500));

await page.waitForTimeout(10000);
await browser.close();
