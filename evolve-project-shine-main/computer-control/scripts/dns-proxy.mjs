import { chromium } from 'playwright';

const USER = 'server724363.nazwa.pl';
const PASS = 'Eryk0501';
const IP = '85.128.237.169';

const operaPath = 'C:\\Users\\Wychowanek.St8\\AppData\\Local\\Programs\\Opera GX\\131.0.5877.111\\opera.exe';

const browser = await chromium.launch({
  executablePath: operaPath,
  headless: false,
  args: ['--start-maximized'],
});

const context = await browser.newContext();
const page = await context.newPage();

console.log('Logging in...');
await page.goto('https://login.nazwa.pl/realms/chp/protocol/openid-connect/auth?redirect_uri=https%3A%2F%2Fadmin.nazwa.pl%2Flogin%2Ffallback&state=86e36dc9daee6f1d26aa2c25728e8984&scope=openid%20profile%20cloudHosting%20roles&response_type=code&approval_prompt=auto&client_id=chp-app', { waitUntil: 'networkidle' });
await page.fill('input[name="username"]', USER);
await page.fill('input[name="password"]', PASS);
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);
console.log('Logged in:', page.url());

// Go to DNS management for edunex.pl - try common URLs
const dnsUrls = [
  '/domains/dns/edunex.pl',
  '/domains/zone/edunex.pl',
  '/dns/edunex.pl',
  '/domains/list',
];

for (const url of dnsUrls) {
  try {
    await page.goto(`https://admin.nazwa.pl${url}`, { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);
    const text = await page.innerText('body');
    const title = await page.title();
    console.log(`\n--- ${url} ---`);
    console.log(`Title: ${title}`);
    console.log(`Content: ${text.substring(0, 800)}`);
    await page.screenshot({ path: `C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\dns-${url.replace(/\//g, '_')}.png`, fullPage: false });
  } catch (e) {
    console.log(`\n--- ${url} --- ERROR: ${e.message.substring(0, 100)}`);
  }
}

await page.waitForTimeout(30000);
await browser.close();
