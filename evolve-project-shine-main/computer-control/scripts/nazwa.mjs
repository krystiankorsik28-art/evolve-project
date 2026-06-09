import { chromium } from 'playwright';

const operaPath = 'C:\\Users\\Wychowanek.St8\\AppData\\Local\\Programs\\Opera GX\\131.0.5877.111\\opera.exe';

const browser = await chromium.launch({
  executablePath: operaPath,
  headless: false,
  args: ['--start-maximized'],
});

const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
});

const page = await context.newPage();

// Logowanie do panelu nazwa.pl
await page.goto('https://login.nazwa.pl/realms/chp/protocol/openid-connect/auth?redirect_uri=https%3A%2F%2Fadmin.nazwa.pl%2Flogin%2Ffallback&state=86e36dc9daee6f1d26aa2c25728e8984&scope=openid%20profile%20cloudHosting%20roles&response_type=code&approval_prompt=auto&client_id=chp-app', { waitUntil: 'networkidle' });

await page.waitForTimeout(2000);

// Wpisz login
await page.fill('input[name="username"]', 'server724363.nazwa.pl');
await page.waitForTimeout(500);

// Wpisz haslo
await page.fill('input[name="password"]', 'Eryk0501');
await page.waitForTimeout(500);

// Kliknij Zaloguj
await page.click('button[type="submit"]');
await page.waitForTimeout(5000);

console.log('Zalogowano! Strona zaladowana.');
console.log('URL:', page.url());

// Czekaj na interakcje uzytkownika
await page.waitForTimeout(300000);
await browser.close();
