"""PyAutoGUI fallback controller for computer-control MCP server.
Reads JSON-RPC commands from stdin, executes PyAutoGUI actions, writes responses to stdout."""

import sys
import json
import traceback
import base64
from io import BytesIO

try:
    import pyautogui
    import PIL.Image
except ImportError as e:
    print(json.dumps({"ok": False, "error": f"Missing dependency: {e}. Run: pip install pyautogui pillow"}), flush=True)
    sys.exit(1)

pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.05


def handle(method, params):
    try:
        if method == "click":
            x, y = int(params["x"]), int(params["y"])
            button = params.get("button", "left")
            pyautogui.click(x, y, button=button)
            return {"ok": True, "result": None}

        elif method == "doubleClick":
            x, y = int(params["x"]), int(params["y"])
            pyautogui.doubleClick(x, y)
            return {"ok": True, "result": None}

        elif method == "move":
            x, y = int(params["x"]), int(params["y"])
            pyautogui.moveTo(x, y)
            return {"ok": True, "result": None}

        elif method == "type":
            text = params["text"]
            pyautogui.typewrite(text, interval=0.02)
            return {"ok": True, "result": None}

        elif method == "keypress":
            key = params["key"]
            modifiers = []
            if params.get("ctrl"): modifiers.append("ctrl")
            if params.get("alt"): modifiers.append("alt")
            if params.get("shift"): modifiers.append("shift")
            if modifiers:
                for mod in modifiers:
                    pyautogui.keyDown(mod)
                pyautogui.press(key)
                for mod in reversed(modifiers):
                    pyautogui.keyUp(mod)
            else:
                pyautogui.press(key)
            return {"ok": True, "result": None}

        elif method == "screenshot":
            img = pyautogui.screenshot()
            buf = BytesIO()
            img.save(buf, format="PNG")
            b64 = base64.b64encode(buf.getvalue()).decode("ascii")
            return {"ok": True, "result": {"base64": b64}}

        elif method == "scroll":
            clicks = int(params.get("clicks", 3))
            x = params.get("x")
            y = params.get("y")
            if x is not None and y is not None:
                pyautogui.scroll(clicks, x=int(x), y=int(y))
            else:
                pyautogui.scroll(clicks)
            return {"ok": True, "result": None}

        elif method == "position":
            x, y = pyautogui.position()
            return {"ok": True, "result": {"x": x, "y": y}}

        else:
            return {"ok": False, "error": f"Unknown method: {method}"}

    except Exception as e:
        return {"ok": False, "error": f"{type(e).__name__}: {e}\n{traceback.format_exc()}"}


def main():
    # Signal ready
    print("READY", flush=True)

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
            req_id = msg.get("id")
            method = msg.get("method")
            params = msg.get("params", {})
            result = handle(method, params)
            result["id"] = req_id
            print(json.dumps(result), flush=True)
        except json.JSONDecodeError as e:
            print(json.dumps({"ok": False, "error": f"JSON parse error: {e}"}), flush=True)
        except Exception as e:
            print(json.dumps({"ok": False, "error": f"Fatal: {e}"}), flush=True)


if __name__ == "__main__":
    main()
