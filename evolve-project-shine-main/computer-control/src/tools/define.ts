export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface ToolResult {
  type: 'text' | 'image' | 'resource';
  text?: string;
  resource?: { uri: string; mimeType: string; text?: string; blob?: string };
}

export type ToolHandlerFn = (args: Record<string, unknown>) => Promise<ToolResult[]>;

export interface Tool {
  definition: ToolDefinition;
  handler: ToolHandlerFn;
}

import type { BrowserLayer } from '../layers/browser-layer.js';
import type { FallbackLayer } from '../layers/fallback-layer.js';
import { browserTools } from './browser-tools.js';
import { desktopTools } from './desktop-tools.js';

export function defineTools(browser: BrowserLayer, fallback: FallbackLayer): Tool[] {
  return [
    ...browserTools(browser),
    ...desktopTools(fallback),
  ];
}
