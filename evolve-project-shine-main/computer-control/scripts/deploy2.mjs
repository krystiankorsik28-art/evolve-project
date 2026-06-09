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

// Let's check pages that might have file upload or management
const pagesToTry = [
  { name: 'add_git', url: '/repositories/add/git' },
  { name: 'file_manager', url: '/filemanager' },
  { name: 'manager', url: '/manager' },
  { name: 'files', url: '/files' },
  { name: 'settings_www', url: '/settings/www' },
];

for (const p of pagesToTry) {
  try {
    await page.goto(`https://admin.nazwa.pl${p.url}`, { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1000);
    const text = await page.innerText('body');
    console.log(`${p.name}: ${page.url().substring(0, 100)} -> ${text.substring(0, 200)}`);
    await page.screenshot({ path: `C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\${p.name}.png`, fullPage: false });
  } catch (e) {
    console.log(`${p.name}: ERROR ${e.message}`);
  }
}

await page.waitForTimeout(60000);
await browser.close();
