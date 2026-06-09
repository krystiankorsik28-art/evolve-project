import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const operaPath = 'C:\\Users\\Wychowanek.St8\\AppData\\Local\\Programs\\Opera GX\\131.0.5877.111\\opera.exe';

const browser = await chromium.launch({
  executablePath: operaPath,
  headless: false,
  args: ['--start-maximized', '--disable-blink-features=AutomationControlled'],
});

const context = await browser.newContext();
const page = await context.newPage();

await page.goto('https://login.nazwa.pl/realms/chp/protocol/openid-connect/auth?redirect_uri=https%3A%2F%2Fadmin.nazwa.pl%2Flogin%2Ffallback&state=86e36dc9daee6f1d26aa2c25728e8984&scope=openid%20profile%20cloudHosting%20roles&response_type=code&approval_prompt=auto&client_id=chp-app', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);
await page.fill('input[name="username"]', 'server724363.nazwa.pl');
await page.fill('input[name="password"]', 'Eryk0501');
await page.click('button[type="submit"]');
await page.waitForTimeout(5000);

const pagesToVisit = [
  { name: 'WWW_i_FTP', url: '/settings/www' },
  { name: 'PHP_i_Node_js', url: '/settings/php' },
  { name: 'Aplikacje', url: '/aps/list' },
  { name: 'Konta_FTP', url: '/ftpaccounts/list' },
];

for (const p of pagesToVisit) {
  await page.goto(`https://admin.nazwa.pl${p.url}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\${p.name}.png`, fullPage: true });
  const html = await page.content();
  writeFileSync(`C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\${p.name}.html`, html);
  console.log(`OK: ${p.name} -> ${page.url()}`);
}

await browser.close();
