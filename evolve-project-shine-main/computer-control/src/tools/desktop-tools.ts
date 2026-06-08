import type { Tool, ToolResult, ToolHandlerFn } from './define.js';
import type { FallbackLayer } from '../layers/fallback-layer.js';

export function desktopTools(fallback: FallbackLayer): Tool[] {
  const click: ToolHandlerFn = async (args) => {
    const x = Number(args.x);
    const y = Number(args.y);
    const button = String(args.button ?? 'left');
    await fallback.click(x, y, button);
    return [{ type: 'text', text: `Clicked at (${x}, ${y}) with ${button} button` }];
  };

  const doubleClick: ToolHandlerFn = async (args) => {
    const x = Number(args.x);
    const y = Number(args.y);
    await fallback.doubleClick(x, y);
    return [{ type: 'text', text: `Double-clicked at (${x}, ${y})` }];
  };

  const move: ToolHandlerFn = async (args) => {
    const x = Number(args.x);
    const y = Number(args.y);
    await fallback.move(x, y);
    return [{ type: 'text', text: `Moved mouse to (${x}, ${y})` }];
  };

  const type: ToolHandlerFn = async (args) => {
    const text = String(args.text ?? '');
    await fallback.type(text);
    return [{ type: 'text', text: `Typed: ${text}` }];
  };

  const keypress: ToolHandlerFn = async (args) => {
    const key = String(args.key ?? '');
    const ctrl = Boolean(args.ctrl ?? false);
    const alt = Boolean(args.alt ?? false);
    const shift = Boolean(args.shift ?? false);
    await fallback.keypress(key, ctrl, alt, shift);
    const mods = [ctrl && 'Ctrl', alt && 'Alt', shift && 'Shift'].filter(Boolean).join('+');
    return [{ type: 'text', text: `Pressed ${mods ? mods + '+' : ''}${key}` }];
  };

  const screenshot: ToolHandlerFn = async () => {
    const buf = await fallback.screenshot();
    return [{
      type: 'image',
      text: 'Desktop screenshot',
      resource: { uri: 'screenshot://desktop', mimeType: 'image/png', blob: buf.toString('base64') },
    }];
  };

  const scroll: ToolHandlerFn = async (args) => {
    const clicks = Number(args.clicks ?? 3);
    const x = args.x !== undefined ? Number(args.x) : undefined;
    const y = args.y !== undefined ? Number(args.y) : undefined;
    await fallback.scroll(clicks, x, y);
    return [{ type: 'text', text: `Scrolled ${clicks > 0 ? 'down' : 'up'} (${clicks} clicks) at (${x ?? 'current'}, ${y ?? 'current'})` }];
  };

  const cursorPosition: ToolHandlerFn = async () => {
    const pos = await fallback.position();
    return [{ type: 'text', text: `Cursor at (${pos.x}, ${pos.y})` }];
  };

  return [
    {
      definition: {
        name: 'computer_click',
        description: 'Click at specific screen coordinates. Use screenshot + computer_cursor_position first to find coordinates. PyAutoGUI fallback.',
        inputSchema: {
          type: 'object',
          properties: {
            x: { type: 'number', description: 'X coordinate' },
            y: { type: 'number', description: 'Y coordinate' },
            button: { type: 'string', enum: ['left', 'right', 'middle'], default: 'left' },
          },
          required: ['x', 'y'],
        },
      },
      handler: click,
    },
    {
      definition: {
        name: 'computer_doubleclick',
        description: 'Double-click at specific screen coordinates',
        inputSchema: {
          type: 'object',
          properties: {
            x: { type: 'number', description: 'X coordinate' },
            y: { type: 'number', description: 'Y coordinate' },
          },
          required: ['x', 'y'],
        },
      },
      handler: doubleClick,
    },
    {
      definition: {
        name: 'computer_move',
        description: 'Move mouse to screen coordinates',
        inputSchema: {
          type: 'object',
          properties: {
            x: { type: 'number', description: 'X coordinate' },
            y: { type: 'number', description: 'Y coordinate' },
          },
          required: ['x', 'y'],
        },
      },
      handler: move,
    },
    {
      definition: {
        name: 'computer_type',
        description: 'Type text using keyboard (PyAutoGUI fallback)',
        inputSchema: {
          type: 'object',
          properties: { text: { type: 'string', description: 'Text to type' } },
          required: ['text'],
        },
      },
      handler: type,
    },
    {
      definition: {
        name: 'computer_keypress',
        description: 'Press a keyboard key (e.g. enter, tab, escape, f5) with optional modifiers',
        inputSchema: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'Key name (enter, tab, escape, f5, up, down, left, right, home, end, backspace, delete, etc.)' },
            ctrl: { type: 'boolean', default: false },
            alt: { type: 'boolean', default: false },
            shift: { type: 'boolean', default: false },
          },
          required: ['key'],
        },
      },
      handler: keypress,
    },
    {
      definition: {
        name: 'computer_screenshot',
        description: 'Take a full-screen screenshot (desktop, not browser)',
        inputSchema: { type: 'object', properties: {} },
      },
      handler: screenshot,
    },
    {
      definition: {
        name: 'computer_scroll',
        description: 'Scroll at current mouse position or specific coordinates',
        inputSchema: {
          type: 'object',
          properties: {
            clicks: { type: 'number', default: 3, description: 'Number of scroll clicks (positive=down, negative=up)' },
            x: { type: 'number', description: 'Optional X coordinate' },
            y: { type: 'number', description: 'Optional Y coordinate' },
          },
        },
      },
      handler: scroll,
    },
    {
      definition: {
        name: 'computer_cursor_position',
        description: 'Get current mouse cursor position',
        inputSchema: { type: 'object', properties: {} },
      },
      handler: cursorPosition,
    },
  ];
}
