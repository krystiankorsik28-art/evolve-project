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

// Try main nazwa.pl panel
console.log('Trying main nazwa.pl panel...');
await page.goto('https://panel.nazwa.pl/', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(e => console.log('Panel error:', e.message));
await page.waitForTimeout(3000);
console.log('URL:', page.url());
const bodyText = await page.innerText('body');
console.log('Content:', bodyText.substring(0, 1000));
await page.screenshot({ path: 'C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\main-panel.png', fullPage: false });

// Check if there's a login form
const html = await page.content();
const hasPasswordField = html.includes('password') || html.includes('hasło') || html.includes('Password');
console.log('Has password field:', hasPasswordField);

// Try to find DNS links in CloudHosting Panel
await page.goto('https://admin.nazwa.pl/domains/list', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Look for DNS or zone management links
const links = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('a')).map(a => ({ text: a.textContent.trim(), href: a.href })).filter(l => l.text && (l.text.toLowerCase().includes('dns') || l.text.toLowerCase().includes('stref') || l.text.toLowerCase().includes('domen')));
});
console.log('DNS/Domain links:', links);

await page.waitForTimeout(10000);
await browser.close();
