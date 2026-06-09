import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const operaPath = 'C:\\Users\\Wychowanek.St8\\AppData\\Local\\Programs\\Opera GX\\131.0.5877.111\\opera.exe';

const browser = await chromium.launch({
  executablePath: operaPath,
  headless: true,
  args: ['--window-size=1920,1080'],
});

const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();

await page.goto('https://login.nazwa.pl/realms/chp/protocol/openid-connect/auth?redirect_uri=https%3A%2F%2Fadmin.nazwa.pl%2Flogin%2Ffallback&state=86e36dc9daee6f1d26aa2c25728e8984&scope=openid%20profile%20cloudHosting%20roles&response_type=code&approval_prompt=auto&client_id=chp-app', { waitUntil: 'networkidle' });
await page.fill('input[name="username"]', 'server724363.nazwa.pl');
await page.fill('input[name="password"]', 'Eryk0501');
await page.click('button[type="submit"]');
await page.waitForTimeout(3000);

// Check Git repos page
await page.goto('https://admin.nazwa.pl/repositories/add/git', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const gitHtml = await page.content();
writeFileSync('C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\add_git.html', gitHtml);
console.log('Git page title:', await page.title());
console.log('Git page URL:', page.url());

// Check Git repo list
await page.goto('https://admin.nazwa.pl/repositories/list', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const listHtml = await page.content();
writeFileSync('C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\repos_list.html', listHtml);
console.log('Repos page URL:', page.url());
console.log('Repos content:', (await page.innerText('body')).substring(0, 1000));

// Check CRON (maybe we can use a cron job to start the proxy)
await page.goto('https://admin.nazwa.pl/cron/list', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
const cronHtml = await page.content();
writeFileSync('C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\cron.html', cronHtml);
console.log('Cron page URL:', page.url());

await browser.close();
