# Trace Files

Trace files will appear in this directory after running tests with `trace: 'on'` enabled in your Playwright config.

## How Traces Are Generated
When your `playwright.config.js` includes `trace: 'on'` (or `trace: 'on-first-retry'`), Playwright records a trace ZIP file for each test run. These files capture screenshots, DOM snapshots, network requests, and console logs.

## How to View Traces
Use the Playwright CLI trace viewer:

```bash
npx playwright show-trace <trace-file.zip>
```

This opens an interactive viewer in your browser where you can step through each action, inspect the DOM, and debug failures.
