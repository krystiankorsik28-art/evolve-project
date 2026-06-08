import { chromium, type Browser, type Page, type BrowserContext } from 'playwright';

export class BrowserLayer {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async launch(channel: string = 'chrome'): Promise<void> {
    await this.close();
    const channelMap: Record<string, string> = {
      chrome: 'chrome',
      opera: 'opera',
      msedge: 'msedge',
      chromium: undefined as unknown as string,
    };
    const ch = channelMap[channel] ?? undefined;
    this.browser = await chromium.launch({
      channel: ch === undefined ? undefined : ch,
      headless: false,
      args: [
        '--start-maximized',
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-gpu-sandbox',
      ],
    });
    this.context = await this.browser.newContext({
      viewport: null, // full screen
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
    });
    this.page = await this.context.newPage();
  }

  async navigate(url: string): Promise<void> {
    await this.ensurePage();
    await this.page!.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  }

  async snapshot(): Promise<string> {
    await this.ensurePage();
    const snapshot = await this.page!.evaluate(() => {
      const walk = (node: Element, depth = 0): Record<string, unknown> | null => {
        if (depth > 10) return null;
        const role = node.getAttribute('role') || node.tagName.toLowerCase();
        const name = node.getAttribute('aria-label') || node.textContent?.trim().slice(0, 100) || '';
        const attrs: Record<string, unknown> = { role, name };
        const rect = node.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          attrs.box = [Math.round(rect.x), Math.round(rect.y), Math.round(rect.width), Math.round(rect.height)];
        }
        const children: Record<string, unknown>[] = [];
        for (const child of node.children) {
          const c = walk(child, depth + 1);
          if (c) children.push(c);
        }
        if (children.length > 0) attrs.children = children;
        return attrs;
      };
      return walk(document.body);
    });
    return JSON.stringify(snapshot, null, 2);
  }

  async click(selector: string): Promise<void> {
    await this.ensurePage();
    if (selector === 'focused') {
      await this.page!.keyboard.press('Enter');
      return;
    }
    try {
      await this.page!.click(selector, { timeout: 5000 });
    } catch {
      // fallback: try XPath
      await this.page!.locator(selector).first().click({ timeout: 5000 });
    }
  }

  async type(selector: string, text: string, submit: boolean): Promise<void> {
    await this.ensurePage();
    if (selector === 'focused') {
      await this.page!.keyboard.type(text, { delay: 20 });
      if (submit) await this.page!.keyboard.press('Enter');
      return;
    }
    const el = this.page!.locator(selector).first();
    await el.click();
    await el.fill('');
    await el.type(text, { delay: 20 });
    if (submit) await this.page!.keyboard.press('Enter');
  }

  async screenshot(): Promise<Buffer> {
    await this.ensurePage();
    return await this.page!.screenshot({ type: 'png', fullPage: false });
  }

  async scroll(deltaX: number, deltaY: number): Promise<void> {
    await this.ensurePage();
    await this.page!.mouse.wheel(deltaX, deltaY);
  }

  async evaluate(code: string): Promise<unknown> {
    await this.ensurePage();
    return await this.page!.evaluate(code);
  }

  async close(): Promise<void> {
    try {
      if (this.page) await this.page.close().catch(() => {});
      if (this.context) await this.context.close().catch(() => {});
      if (this.browser) await this.browser.close().catch(() => {});
    } finally {
      this.page = null;
      this.context = null;
      this.browser = null;
    }
  }

  private async ensurePage(): Promise<void> {
    if (!this.page || !this.browser?.isConnected()) {
      await this.launch('chrome');
    }
  }
}
