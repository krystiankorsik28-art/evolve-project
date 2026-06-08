# Example Commands for computer-control MCP

## Browser Control

### Open a website
> "open youtube"
> "navigate to github.com"
> "go to https://chat.openai.com"

### Search and interact
> "search AI news on youtube"
> "find the best laptop deals on amazon"
> "go to google and search for Node.js tutorials"

### Click and type
> "click the login button"
> "type my email into the email field"
> "click the search bar and type 'typescript tutorial' then press enter"

### Page navigation
> "scroll down"
> "scroll down more"
> "go back to the previous page"
> "take a screenshot of this page"
> "what's on this page?" (browser_snapshot)

## Desktop Control (PyAutoGUI)

### Mouse control
> "move mouse to the top-left corner"
> "click at position 500, 300"
> "right-click at 200, 100"
> "double-click the desktop icon"

### Keyboard
> "type 'hello world'"
> "press enter"
> "press ctrl+c"
> "press f5 to refresh"
> "press alt+tab to switch windows"

### Screenshots
> "take a screenshot of my desktop"
> "show me what's on my screen"
> "capture the screen and find where the login button is"

### Combined workflows
> "open chrome, go to gmail.com, and log in"
> "open spotify and play some music"
> "search for Python tutorials on youtube, click the first video, and take a screenshot"

## Opera GX Specific

> "launch Opera browser"
> "open youtube in opera"
> "launch opera and go to discord.com"

Browser channels supported: `chrome`, `opera`, `msedge`, `chromium`

## Complex Multi-Step Tasks

### Example: Check Gmail
1. `browser_launch` (chrome)
2. `browser_navigate` (gmail.com)
3. `browser_snapshot` (get the page structure)
4. `browser_type` (click email field, type email)
5. `browser_type` (click password field, type password)
6. `browser_click` (click sign in button)
7. `browser_screenshot` (verify login succeeded)

### Example: Research a topic
1. `browser_navigate` (scholar.google.com)
2. `browser_type` (search bar, "machine learning 2026")
3. `browser_click` (search button)
4. `browser_scroll` (scroll down)
5. `browser_screenshot` (capture results)
