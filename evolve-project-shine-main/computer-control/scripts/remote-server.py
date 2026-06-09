#!/usr/bin/env python3
"""EduNex Remote Desktop Control - HTTP API Server"""
import pyautogui, json, io, base64
from http.server import HTTPServer, BaseHTTPRequestHandler
from PIL import Image

PORT = 8899
pyautogui.FAILSAFE = False

class RCHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # silent

    def do_GET(self):
        if self.path == '/screenshot':
            img = pyautogui.screenshot()
            buf = io.BytesIO()
            img.save(buf, 'PNG', compress_level=1)
            self.send_response(200)
            self.send_header('Content-Type', 'image/png')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(buf.getvalue())
        elif self.path == '/screen-size':
            w, h = pyautogui.size()
            self.send_json({'width': w, 'height': h})
        elif self.path == '/position':
            x, y = pyautogui.position()
            self.send_json({'x': x, 'y': y})
        else:
            self.send_json({'error': 'unknown'}, 404)

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        data = json.loads(self.rfile.read(length)) if length else {}
        path = self.path

        try:
            if '/click' in path:
                pyautogui.click(data.get('x'), data.get('y'), _pause=False)
                self.send_json({'ok': True})
            elif '/double-click' in path:
                pyautogui.doubleClick(data.get('x'), data.get('y'), _pause=False)
                self.send_json({'ok': True})
            elif '/right-click' in path:
                pyautogui.rightClick(data.get('x'), data.get('y'), _pause=False)
                self.send_json({'ok': True})
            elif '/move' in path:
                dur = data.get('duration', 0.3)
                pyautogui.moveTo(data['x'], data['y'], duration=dur, _pause=False)
                self.send_json({'ok': True})
            elif '/drag' in path:
                pyautogui.dragTo(data['x'], data['y'], duration=data.get('duration', 0.3), button=data.get('button', 'left'), _pause=False)
                self.send_json({'ok': True})
            elif '/scroll' in path:
                pyautogui.scroll(data.get('clicks', -3), _pause=False)
                self.send_json({'ok': True})
            elif '/type' in path:
                pyautogui.write(data['text'], interval=data.get('interval', 0.02), _pause=False)
                self.send_json({'ok': True})
            elif '/key' in path:
                pyautogui.press(data['key'], _pause=False)
                self.send_json({'ok': True})
            elif '/hotkey' in path:
                pyautogui.hotkey(*data['keys'], _pause=False)
                self.send_json({'ok': True})
            elif '/writeln' in path:
                pyautogui.write(data['text'], interval=data.get('interval', 0.02), _pause=False)
                pyautogui.press('enter', _pause=False)
                self.send_json({'ok': True})
            else:
                self.send_json({'error': 'unknown'}, 404)
        except Exception as e:
            self.send_json({'error': str(e)}, 500)

    def send_json(self, obj, code=200):
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(obj).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

print(f'EduNex Remote Control Server running on http://localhost:{PORT}')
print(f'Endpoints:')
print(f'  GET  /screenshot  - get screen image')
print(f'  GET  /screen-size - get screen resolution')
print(f'  GET  /position    - get mouse position')
print(f'  POST /click       - click at x,y')
print(f'  POST /double-click')
print(f'  POST /right-click')
print(f'  POST /move        - move mouse to x,y')
print(f'  POST /type        - type text')
print(f'  POST /key         - press key (enter, tab, etc)')
print(f'  POST /hotkey      - press combo (ctrl, c)')
print(f'  POST /writeln     - type text + enter')
print(f'  POST /scroll      - scroll')
print(f'  POST /drag        - drag to x,y')
print(f'\nPyAutoGUI fail-safe is DISABLED. Press Ctrl+C to stop.\n')

HTTPServer(('127.0.0.1', PORT), RCHandler).serve_forever()
