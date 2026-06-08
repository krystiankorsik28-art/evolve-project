<#
.SYNOPSIS
  Setup script for computer-control MCP system (Windows PowerShell)
.DESCRIPTION
  Installs Python dependencies, Node.js dependencies, Playwright browsers,
  and configures OpenCode to use the computer-control MCP server.
#>

$ErrorActionPreference = "Stop"
$RootDir = Split-Path -Parent $PSScriptRoot
$OpenCodeConfig = "$env:USERPROFILE\.config\opencode\opencode.json"

Write-Host "=== computer-control MCP Setup ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Python
Write-Host "[1/5] Checking Python..." -ForegroundColor Yellow
try {
    $pyVersion = python --version 2>&1
    Write-Host "  Found: $pyVersion" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Python not found!" -ForegroundColor Red
    Write-Host "  Install Python 3.10+ from https://python.org" -ForegroundColor Red
    Write-Host "  Make sure to check 'Add Python to PATH' during installation." -ForegroundColor Red
    exit 1
}

# Step 2: Install PyAutoGUI + Pillow
Write-Host "[2/5] Installing Python packages (pyautogui, pillow)..." -ForegroundColor Yellow
try {
    python -m pip install --upgrade pip -q
    python -m pip install pyautogui pillow -q
    Write-Host "  Done" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Failed to install Python packages" -ForegroundColor Red
    Write-Host "  Try manually: pip install pyautogui pillow" -ForegroundColor Red
    exit 1
}

# Step 3: Install Node.js dependencies
Write-Host "[3/5] Installing Node.js dependencies..." -ForegroundColor Yellow
try {
    Push-Location $RootDir
    npm install
    Pop-Location
    Write-Host "  Done" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: npm install failed" -ForegroundColor Red
    exit 1
}

# Step 4: Build TypeScript
Write-Host "[4/5] Building TypeScript..." -ForegroundColor Yellow
try {
    Push-Location $RootDir
    npx tsc
    Pop-Location
    Write-Host "  Done" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: TypeScript build failed" -ForegroundColor Red
    exit 1
}

# Step 5: Install Playwright browsers
Write-Host "[5/5] Installing Playwright Chromium browser..." -ForegroundColor Yellow
try {
    Push-Location $RootDir
    npx playwright install chromium
    Pop-Location
    Write-Host "  Done" -ForegroundColor Green
} catch {
    Write-Host "  WARNING: Playwright browser install failed" -ForegroundColor Yellow
    Write-Host "  Try manually: npx playwright install chromium" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setup complete! ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "To activate the MCP server in OpenCode, add this to your opencode.json:" -ForegroundColor White
Write-Host ""
Write-Host '  "mcp": {' -ForegroundColor Gray
Write-Host '    "computer-control": {' -ForegroundColor Gray
Write-Host "      `"type`": `"local`"," -ForegroundColor Gray
Write-Host "      `"command`": [`"node`", `"$RootDir\dist\index.js`"]," -ForegroundColor Gray
Write-Host '      "enabled": true' -ForegroundColor Gray
Write-Host '    }' -ForegroundColor Gray
Write-Host '  }' -ForegroundColor Gray
Write-Host ""
Write-Host "Or copy config/opencode-computer-control.json into your project's opencode.json" -ForegroundColor White
Write-Host ""
Write-Host "Then restart OpenCode and try:" -ForegroundColor White
Write-Host '  "open youtube and search AI news"' -ForegroundColor Green
Write-Host '  "click login button"' -ForegroundColor Green
Write-Host '  "take a screenshot of my desktop"' -ForegroundColor Green
