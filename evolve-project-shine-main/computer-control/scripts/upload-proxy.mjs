import { Client } from 'basic-ftp';
import { join } from 'path';

const FTP_HOST = 'server724363.nazwa.pl';
const FTP_USER = 'server724363';
const FTP_PASS = 'Eryk0501';
const PROXY_DIR = 'C:\\Users\\Wychowanek.St8\\Downloads\\evolve-project-shine-main\\evolve-project-shine-main\\proxy-server';

const client = new Client();
try {
  console.log('[FTP] Connecting...');
  await client.access({ host: FTP_HOST, user: FTP_USER, password: FTP_PASS, secure: false });
  console.log('[FTP] Connected!');
  
  // Create proxy directory
  await client.ensureDir('/proxy');
  await client.clearWorkingDir();
  console.log('[FTP] Created /proxy directory');
  
  // Upload files
  console.log('[FTP] Uploading server.js...');
  await client.uploadFrom(join(PROXY_DIR, 'server.js'), 'server.js');
  console.log('[FTP] Uploading package.json...');
  await client.uploadFrom(join(PROXY_DIR, 'package.json'), 'package.json');
  
  console.log('[FTP] Files uploaded to /proxy/');
  
  const list = await client.list();
  console.log('[FTP] Directory contents:', list.map(f => `${f.name} (${f.size} bytes)`).join(', '));
  
  await client.close();
  console.log('[FTP] Done!');
} catch (e) {
  console.error('[FTP] Error:', e.message);
  try { client.close(); } catch {}
}
