/**
 * Cross-platform setup script for computer-control MCP.
 * Run: node scripts/setup.js
 */
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

function run(cmd, label) {
  process.stdout.write(`[${label}]... `);
  try {
    execSync(cmd, { cwd: root, stdio: 'pipe', timeout: 120000 });
    console.log('OK');
  } catch (e) {
    console.log('FAILED');
    console.error(`  ${e.stderr?.toString()?.trim() || e.message}`);
    return false;
  }
  return true;
}

console.log('=== computer-control MCP Setup ===\n');

run('python --version', 'Check Python');
run('python -m pip install pyautogui pillow -q', 'Install Python deps');
run('npm install', 'Install Node deps');
run('npx tsc', 'Build TypeScript');
run('npx playwright install chromium', 'Install Playwright browser');

console.log('\n=== Setup complete! ===');
console.log('Add to opencode.json:');
console.log(JSON.stringify({
  mcp: {
    'computer-control': {
      type: 'local',
      command: ['node', resolve(root, 'dist/index.js')],
      enabled: true,
    },
  },
}, null, 2));
