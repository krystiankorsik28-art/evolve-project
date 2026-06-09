import { Client } from 'basic-ftp';
import { chromium } from 'playwright';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

const FTP_HOST = 'server724363.nazwa.pl';
const FTP_USER = 'server724363.nazwa.pl';
const FTP_PASS = 'Eryk0501';
const PROXY_DIR = resolve('C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\proxy-server');

async function uploadViaFTP() {
  console.log('[FTP] Connecting...');
  const client = new Client();
  client.ftp.verbose = true;
  try {
    await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
    console.log('[FTP] Connected!');
    await client.ensureDir('/proxy');
    console.log('[FTP] Uploading server.js...');
    await client.uploadFrom(join(PROXY_DIR, 'server.js'), 'server.js');
    console.log('[FTP] Uploading package.json...');
    await client.uploadFrom(join(PROXY_DIR, 'package.json'), 'package.json');
    console.log('[FTP] Upload complete!');
    await client.close();
    return true;
  } catch (e) {
    console.error('[FTP] Failed:', e.message);
    try { client.close(); } catch {}
    return false;
  }
}

async function configurePanel() {
  const operaPath = 'C:\\Users\\Wychowanek.St8\\AppData\\Local\\Programs\\Opera GX\\131.0.5877.111\\opera.exe';
  const browser = await chromium.launch({ executablePath: operaPath, headless: false, args: ['--start-maximized'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  console.log('[Panel] Logging in...');
  await page.goto('https://login.nazwa.pl/realms/chp/protocol/openid-connect/auth?redirect_uri=https%3A%2F%2Fadmin.nazwa.pl%2Flogin%2Ffallback&state=86e36dc9daee6f1d26aa2c25728e8984&scope=openid%20profile%20cloudHosting%20roles&response_type=code&approval_prompt=auto&client_id=chp-app', { waitUntil: 'networkidle' });
  await page.fill('input[name="username"]', FTP_USER);
  await page.fill('input[name="password"]', FTP_PASS);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  console.log('[Panel] Logged in:', page.url());

  // Go to domain add page for subdomain
  console.log('[Panel] Adding subdomain proxy.edunex.pl...');
  await page.goto('https://admin.nazwa.pl/domains/add/edunex.pl', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: resolve('C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\computer-control\\screenshots\\add-domain.png'), fullPage: false });
  const html = await page.content();
  console.log('[Panel] Add domain page loaded:', page.url());

  await page.waitForTimeout(60000);
  await browser.close();
}

async function main() {
  console.log('=== Deploying EduNex Proxy to nazwa.pl ===\n');
  const ftpOk = await uploadViaFTP();
  if (ftpOk) {
    console.log('\n[FTP] Files uploaded. Now configuring panel...\n');
  } else {
    console.log('\n[FTP] Upload failed. Will guide you to upload manually.\n');
  }
  await configurePanel();
}

main().catch(console.error);
