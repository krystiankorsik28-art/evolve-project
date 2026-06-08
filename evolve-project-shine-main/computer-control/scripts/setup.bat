@echo off
REM Setup script for computer-control MCP system (Windows CMD)
echo === computer-control MCP Setup ===
echo.

REM Step 1: Check Python
echo [1/5] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found! Install Python 3.10+ from https://python.org
    pause
    exit /b 1
)
echo   OK

REM Step 2: Install PyAutoGUI
echo [2/5] Installing Python packages...
python -m pip install pyautogui pillow -q
if %errorlevel% neq 0 (
    echo ERROR: pip install failed
    pause
    exit /b 1
)
echo   OK

REM Step 3: npm install
echo [3/5] Installing Node dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo   OK

REM Step 4: Build TypeScript
echo [4/5] Building TypeScript...
call npx tsc
if %errorlevel% neq 0 (
    echo ERROR: TypeScript build failed
    pause
    exit /b 1
)
echo   OK

REM Step 5: Install Playwright browsers
echo [5/5] Installing Playwright Chromium...
call npx playwright install chromium
if %errorlevel% neq 0 (
    echo WARNING: Playwright browser install failed
)
echo   OK

echo.
echo === Setup complete! ===
echo.
echo Add this to your opencode.json MCP config:
echo.
echo   "computer-control": {
echo     "type": "local",
echo     "command": ["node", "%~dp0..\dist\index.js"],
echo     "enabled": true
echo   }
echo.
pause
