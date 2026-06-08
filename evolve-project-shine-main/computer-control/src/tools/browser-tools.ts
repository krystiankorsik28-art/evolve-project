import type { Tool, ToolResult, ToolHandlerFn } from './define.js';
import type { BrowserLayer } from '../layers/browser-layer.js';

export function browserTools(browser: BrowserLayer): Tool[] {
  const navigate: ToolHandlerFn = async (args) => {
    const url = String(args.url ?? '');
    await browser.navigate(url);
    return [{ type: 'text', text: `Navigated to ${url}` }];
  };

  const snapshot: ToolHandlerFn = async () => {
    const snap = await browser.snapshot();
    return [{ type: 'text', text: snap }];
  };

  const click: ToolHandlerFn = async (args) => {
    const selector = String(args.selector ?? '');
    await browser.click(selector);
    return [{ type: 'text', text: `Clicked: ${selector}` }];
  };

  const type: ToolHandlerFn = async (args) => {
    const selector = String(args.selector ?? '');
    const text = String(args.text ?? '');
    const submit = Boolean(args.submit ?? false);
    await browser.type(selector, text, submit);
    return [{ type: 'text', text: `Typed "${text}" into ${selector}` }];
  };

  const screenshot: ToolHandlerFn = async () => {
    const buf = await browser.screenshot();
    return [{
      type: 'image',
      text: 'Browser screenshot',
      resource: { uri: 'screenshot://browser', mimeType: 'image/png', blob: buf.toString('base64') },
    }];
  };

  const scroll: ToolHandlerFn = async (args) => {
    const dx = Number(args.deltaX ?? 0);
    const dy = Number(args.deltaY ?? 300);
    await browser.scroll(dx, dy);
    return [{ type: 'text', text: `Scrolled by (${dx}, ${dy})` }];
  };

  const evaluate: ToolHandlerFn = async (args) => {
    const code = String(args.code ?? '');
    const result = await browser.evaluate(code);
    return [{ type: 'text', text: String(result) }];
  };

  const close: ToolHandlerFn = async () => {
    await browser.close();
    return [{ type: 'text', text: 'Browser closed' }];
  };

  const launch: ToolHandlerFn = async (args) => {
    const channel = String(args.channel ?? 'chrome');
    await browser.launch(channel);
    return [{ type: 'text', text: `Launched ${channel}` }];
  };

  return [
    {
      definition: {
        name: 'browser_launch',
        description: 'Launch a browser (chrome, opera, msedge, or chromium)',
        inputSchema: {
          type: 'object',
          properties: {
            channel: { type: 'string', enum: ['chrome', 'opera', 'msedge', 'chromium'], default: 'chrome' },
          },
        },
      },
      handler: launch,
    },
    {
      definition: {
        name: 'browser_navigate',
        description: 'Navigate to a URL in the browser',
        inputSchema: {
          type: 'object',
          properties: { url: { type: 'string', description: 'Full URL to open' } },
          required: ['url'],
        },
      },
      handler: navigate,
    },
    {
      definition: {
        name: 'browser_snapshot',
        description: 'Get the accessibility tree of the current page (find selectors for click/type)',
        inputSchema: { type: 'object', properties: {} },
      },
      handler: snapshot,
    },
    {
      definition: {
        name: 'browser_click',
        description: 'Click an element by CSS/XPath selector. Get selectors from browser_snapshot first.',
        inputSchema: {
          type: 'object',
          properties: { selector: { type: 'string', description: 'CSS selector or XPath' } },
          required: ['selector'],
        },
      },
      handler: click,
    },
    {
      definition: {
        name: 'browser_type',
        description: 'Type text into an element. Use `selector: "focused"` to type into the currently focused element.',
        inputSchema: {
          type: 'object',
          properties: {
            selector: { type: 'string', description: 'CSS selector or "focused"' },
            text: { type: 'string', description: 'Text to type' },
            submit: { type: 'boolean', default: false, description: 'Press Enter after typing' },
          },
          required: ['selector', 'text'],
        },
      },
      handler: type,
    },
    {
      definition: {
        name: 'browser_screenshot',
        description: 'Take a screenshot of the current page',
        inputSchema: { type: 'object', properties: {} },
      },
      handler: screenshot,
    },
    {
      definition: {
        name: 'browser_scroll',
        description: 'Scroll the page. Positive deltaY = scroll down.',
        inputSchema: {
          type: 'object',
          properties: {
            deltaX: { type: 'number', default: 0 },
            deltaY: { type: 'number', default: 300 },
          },
        },
      },
      handler: scroll,
    },
    {
      definition: {
        name: 'browser_evaluate',
        description: 'Execute JavaScript in the browser page',
        inputSchema: {
          type: 'object',
          properties: { code: { type: 'string', description: 'JavaScript code to execute' } },
          required: ['code'],
        },
      },
      handler: evaluate,
    },
    {
      definition: {
        name: 'browser_close',
        description: 'Close the current browser',
        inputSchema: { type: 'object', properties: {} },
      },
      handler: close,
    },
  ];
}
