import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const operaPath = 'C:\\Users\\Wychowanek.St8\\AppData\\Local\\Programs\\Opera GX\\131.0.5877.111\\opera.exe';

const browser = await chromium.launch({
  executablePath: operaPath,
  headless: false,
  args: ['--start-maximized'],
});

const context = await browser.newContext();
const page = await context.newPage();

// Login
await page.goto('https://login.nazwa.pl/realms/chp/protocol/openid-connect/auth?redirect_uri=https%3A%2F%2Fadmin.nazwa.pl%2Flogin%2Ffallback&state=86e36dc9daee6f1d26aa2c25728e8984&scope=openid%20profile%20cloudHosting%20roles&response_type=code&approval_prompt=auto&client_id=chp-app', { waitUntil: 'networkidle' });
await page.fill('input[name="username"]', 'server724363.nazwa.pl');
await page.fill('input[name="password"]', 'Eryk0501');
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);

// Check FTP accounts page for details - maybe there's server info
await page.goto('https://admin.nazwa.pl/settings/www', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const wwwHtml = await page.content();
writeFileSync('C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\www_settings.html', wwwHtml);
console.log('WWW page loaded');

// Also check settings page for server info
await page.goto('https://admin.nazwa.pl/settings/rdns', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const rdnsHtml = await page.content();
writeFileSync('C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\rdns.html', rdnsHtml);
console.log('RDNS page:', page.url());
const rdnsText = await page.innerText('body');
console.log(rdnsText.substring(0, 1500));

// Let's also try to add the subdomain directly
// First check the add domain page
await page.goto('https://admin.nazwa.pl/domains/add/edunex.pl', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const addDomainHtml = await page.content();
writeFileSync('C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\add_domain.html', addDomainHtml);
console.log('Add domain page URL:', page.url());
console.log('Add domain title:', await page.title());

await page.waitForTimeout(30000);
await browser.close();
