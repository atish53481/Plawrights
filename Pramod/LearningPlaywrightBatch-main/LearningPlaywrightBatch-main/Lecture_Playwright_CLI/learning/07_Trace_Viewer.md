# Trace Viewer - Analyzing Test Execution

## What are Traces?

Traces are ZIP archives that capture a complete recording of a test run. They include screenshots, DOM snapshots, network logs, console output, and source code -- everything you need to understand what happened during a test.

---

## Enabling Traces in Config

```javascript
// playwright.config.js
export default {
  use: {
    trace: 'on-first-retry',
  },
};
```

### Trace Options

| Option | Description |
|--------|-------------|
| `'off'` | Never record traces (default) |
| `'on'` | Record a trace for every test |
| `'on-first-retry'` | Record trace only on the first retry of a failed test |
| `'retain-on-failure'` | Record trace for every test but only keep it if the test fails |
| `'on-all-retries'` | Record trace on every retry attempt |

### Recommendation by Environment

| Environment | Recommended Setting | Reason |
|-------------|--------------------|--------|
| Local development | `'on'` or `'retain-on-failure'` | Full debugging info available |
| CI/CD | `'on-first-retry'` | Captures failure data without bloating storage |
| Performance-sensitive CI | `'retain-on-failure'` | Only saves traces for failures |

---

## Enabling Traces via CLI

You can override the config setting from the command line:

```bash
# Force traces on for this run
npx playwright test --trace on

# Only on first retry
npx playwright test --trace on-first-retry

# Disable traces
npx playwright test --trace off
```

---

## Opening Traces

### Local Trace Files

```bash
# Open a trace file
npx playwright show-trace trace.zip

# Open a trace from test-results
npx playwright show-trace test-results/tests-login-Login-test/trace.zip
```

### Remote Trace Viewer

Upload or drag-and-drop a trace ZIP to the online viewer:

```
https://trace.playwright.dev
```

This is a client-side app -- your trace data stays in the browser and is not uploaded to any server.

---

## Trace Viewer Interface

| Panel | Description |
|-------|-------------|
| **Timeline** | Visual bar showing all actions over time; click to jump |
| **Actions list** | Step-by-step list of every Playwright action |
| **Before/After tabs** | DOM snapshot before and after each action |
| **Source tab** | Test source code with the current line highlighted |
| **Network tab** | All HTTP requests/responses during the action |
| **Console tab** | Browser console messages (log, warn, error) |
| **Call tab** | Detailed info about the action (locator, timing, args) |
| **Attachments** | Screenshots, videos, and custom attachments |

---

## What is Inside a Trace ZIP?

A trace ZIP file contains:

```
trace.zip
  ├── trace.trace          # Binary action log
  ├── trace.network         # Network request/response data
  ├── resources/
  │   ├── screenshot-1.png  # Screenshots at each step
  │   ├── screenshot-2.png
  │   └── ...
  └── ...
```

You do not need to manually unzip -- the Trace Viewer reads the ZIP directly.

---

## Using Traces to Debug Flaky Tests

Flaky tests pass sometimes and fail other times. Traces are invaluable for debugging them:

### Step 1: Enable traces on retry

```javascript
use: { trace: 'on-first-retry' },
retries: 2,
```

### Step 2: Run the tests multiple times

```bash
npx playwright test --repeat-each 10 --retries 1
```

### Step 3: Open the trace of a failed retry

```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

### Step 4: Compare actions

Look at the timeline and DOM snapshots to find:
- Race conditions (element not ready)
- Network timing differences
- Unexpected pop-ups or overlays
- Different data returned by the API

---

## Trace Configuration Options in Detail

```javascript
// playwright.config.js
export default {
  use: {
    trace: {
      mode: 'on-first-retry',
      screenshots: true,      // Include screenshots (default: true)
      snapshots: true,         // Include DOM snapshots (default: true)
      sources: true,           // Include source code (default: true)
    },
  },
};
```

| Sub-option | Default | Description |
|------------|---------|-------------|
| `screenshots` | `true` | Capture screenshots at each action |
| `snapshots` | `true` | Capture full DOM snapshots |
| `sources` | `true` | Embed test source code in the trace |

Disabling any of these reduces trace file size but limits debugging capability.

---

## Trace File Sizes

| Content | Typical Impact on Size |
|---------|----------------------|
| DOM snapshots | Largest contributor |
| Screenshots | Moderate |
| Network bodies | Can be large for data-heavy APIs |
| Source code | Minimal |

For CI, `'on-first-retry'` or `'retain-on-failure'` keeps storage manageable by only saving traces when needed.

---

## Programmatic Trace Control

You can start and stop tracing within a test:

```javascript
test('manual trace', async ({ page, context }) => {
  await context.tracing.start({ screenshots: true, snapshots: true });

  await page.goto('https://example.com');
  await page.click('text=More info');

  await context.tracing.stop({ path: 'my-trace.zip' });
});
```

---

## Tips

- Always enable `trace: 'on-first-retry'` in CI -- it is the best default for catching failures.
- Use `trace.playwright.dev` to share traces with teammates without requiring local setup.
- Traces are more useful than screenshots alone because they include DOM state, network, and timing.
- Keep `retries: 1` or `retries: 2` in CI so that traces get generated on failure.

---

## Next Steps

Continue to [08_Browser_Management.md](./08_Browser_Management.md) to learn about installing and managing browsers.
