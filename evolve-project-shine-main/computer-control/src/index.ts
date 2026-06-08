import { BrowserLayer } from './layers/browser-layer.js';
import { FallbackLayer } from './layers/fallback-layer.js';
import { defineTools } from './tools/define.js';

const browser = new BrowserLayer();
const fallback = new FallbackLayer();

const tools = defineTools(browser, fallback);

// ── MCP Protocol over stdio (JSON-RPC 2.0) ────────────────────────────

let initialized = false;
let buffer = '';

function send(msg: unknown) {
  const line = JSON.stringify(msg) + '\n';
  process.stdout.write(line);
}

function handleMessage(raw: string) {
  let msg: any;
  try { msg = JSON.parse(raw); } catch { return; }

  const { id, method, params } = msg;

  // initialization
  if (method === 'initialize') {
    initialized = true;
    send({
      jsonrpc: '2.0', id,
      result: {
        protocolVersion: '0.1.0',
        capabilities: {
          tools: {},
          resources: {},
          logging: {},
        },
        serverInfo: { name: 'computer-control', version: '1.0.0' },
      },
    });
    return;
  }

  if (method === 'notifications/initialized') return;
  if (method === 'notifications/cancelled') return;

  if (!initialized) {
    send({ jsonrpc: '2.0', id, error: { code: -32000, message: 'Not initialized' } });
    return;
  }

  // tools/list
  if (method === 'tools/list') {
    send({
      jsonrpc: '2.0', id,
      result: { tools: tools.map(t => t.definition) },
    });
    return;
  }

  // tools/call
  if (method === 'tools/call') {
    const name: string = params?.name;
    const args: any = params?.arguments ?? {};
    const tool = tools.find(t => t.definition.name === name);
    if (!tool) {
      send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown tool: ${name}` } });
      return;
    }
    tool.handler(args)
      .then(result => {
        send({ jsonrpc: '2.0', id, result: { content: result } });
      })
      .catch(err => {
        send({ jsonrpc: '2.0', id, error: { code: -32000, message: err.message } });
      });
    return;
  }

  send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown method: ${method}` } });
}

process.stdin.on('data', (chunk: Buffer) => {
  buffer += chunk.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop() ?? '';
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed) handleMessage(trimmed);
  }
});

process.stdin.on('end', () => {
  if (buffer.trim()) handleMessage(buffer.trim());
});

process.on('SIGINT', () => {
  browser.close();
  fallback.close();
  process.exit(0);
});
