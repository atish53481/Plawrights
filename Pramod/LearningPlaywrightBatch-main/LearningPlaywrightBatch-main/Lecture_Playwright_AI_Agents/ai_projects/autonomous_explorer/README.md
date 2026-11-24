# Project 6: Autonomous Explorer

## Overview
An AI agent that autonomously explores web applications — clicking links, checking for errors — and reports bugs it finds, all without pre-written test scripts.

## Quick Start
```bash
# Explore default site (the-internet.herokuapp.com)
node explorer_agent.js

# Explore a custom URL
node explorer_agent.js https://your-app.com
```

## How It Works
1. Starts at the given URL
2. Uses BFS (breadth-first search) to visit pages
3. On each page: checks for console errors, broken images, 404s, missing titles
4. Discovers new links and adds them to the queue
5. Stops at 15 pages or 60 seconds (configurable)
6. Generates HTML report + JSON exploration log

## Files
| File | Purpose |
|------|---------|
| `explorer_agent.js` | Main exploration engine |
| `action_strategies.js` | Page element discovery functions |
| `bug_detector.js` | Issue detection heuristics |
| `exploration_log.json` | Detailed exploration log |
| `reports/` | Generated HTML reports |

## Bug Detection
- Console errors and warnings
- Broken images (naturalWidth === 0)
- HTTP 404/500 error pages
- Missing page titles
- Empty page bodies
- Dead links (HTTP >= 400)

## Configuration
| Setting | Default | Description |
|---------|---------|-------------|
| `MAX_PAGES` | 15 | Maximum pages to explore |
| `MAX_TIME_MS` | 60000 | Maximum exploration time (ms) |
| Start URL | the-internet.herokuapp.com | Pass as CLI argument |
