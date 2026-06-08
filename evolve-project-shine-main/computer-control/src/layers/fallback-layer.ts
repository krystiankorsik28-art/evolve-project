import { spawn, type ChildProcess } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInterface } from 'node:readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PYTHON_SCRIPT = resolve(__dirname, '..', '..', 'scripts', 'controller.py');

interface PyResponse {
  ok: boolean;
  result?: unknown;
  error?: string;
}

export class FallbackLayer {
  private proc: ChildProcess | null = null;
  private rl: ReturnType<typeof createInterface> | null = null;
  private msgId = 0;
  private pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();

  private async send(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
    if (!this.proc) await this.start();

    const id = ++this.msgId;
    const msg = JSON.stringify({ id, method, params }) + '\n';

    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.proc!.stdin!.write(msg);
      setTimeout(() => {
        const p = this.pending.get(id);
        if (p) {
          this.pending.delete(id);
          reject(new Error(`Timeout: ${method}`));
        }
      }, 15000);
    });
  }

  private async start(): Promise<void> {
    const pythonCmd = await this.findPython();
    this.proc = spawn(pythonCmd, [PYTHON_SCRIPT], {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: false,
    });

    this.rl = createInterface({ input: this.proc.stdout! });
    this.rl.on('line', (line: string) => {
      try {
        const resp: PyResponse & { id: number } = JSON.parse(line.trim());
        const pending = this.pending.get(resp.id);
        if (!pending) return;
        this.pending.delete(resp.id);
        if (resp.ok) pending.resolve(resp.result);
        else pending.reject(new Error(resp.error ?? 'Unknown error'));
      } catch { /* ignore malformed responses */ }
    });

    this.proc.on('exit', (code) => {
      this.proc = null;
      this.rl = null;
      for (const [id, p] of this.pending) {
        p.reject(new Error(`Python process exited with code ${code}`));
        this.pending.delete(id);
      }
    });

    // Wait for ready signal
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Python startup timeout')), 10000);
      this.rl!.once('line', (line: string) => {
        clearTimeout(timeout);
        if (line.trim() === 'READY') resolve();
        else reject(new Error(`Unexpected: ${line}`));
      });
    });
  }

  private async findPython(): Promise<string> {
    for (const cmd of ['python', 'python3', 'py']) {
      try {
        const { execSync } = await import('node:child_process');
        execSync(`${cmd} --version`, { stdio: 'ignore' });
        return cmd;
      } catch { /* try next */ }
    }
    throw new Error(
      'Python not found. Install Python 3.10+ from https://python.org and run:\n' +
      '  pip install pyautogui pillow'
    );
  }

  async click(x: number, y: number, button: string): Promise<void> {
    await this.send('click', { x, y, button });
  }

  async doubleClick(x: number, y: number): Promise<void> {
    await this.send('doubleClick', { x, y });
  }

  async move(x: number, y: number): Promise<void> {
    await this.send('move', { x, y });
  }

  async type(text: string): Promise<void> {
    await this.send('type', { text });
  }

  async keypress(key: string, ctrl: boolean, alt: boolean, shift: boolean): Promise<void> {
    await this.send('keypress', { key, ctrl, alt, shift });
  }

  async screenshot(): Promise<Buffer> {
    const result = await this.send('screenshot', {}) as { base64: string };
    return Buffer.from(result.base64, 'base64');
  }

  async scroll(clicks: number, x?: number, y?: number): Promise<void> {
    await this.send('scroll', { clicks, x, y });
  }

  async position(): Promise<{ x: number; y: number }> {
    return await this.send('position', {}) as { x: number; y: number };
  }

  close(): void {
    try { this.proc?.kill(); } catch { /* ignore */ }
    this.proc = null;
    this.rl = null;
    this.pending.clear();
  }
}
