# UI Mode - Interactive Test Runner

## What is UI Mode?

UI Mode is an interactive graphical test runner built into Playwright. It lets you run, watch, filter, and debug tests with a rich visual interface directly in your browser.

```bash
npx playwright test --ui
```

This opens a browser-based UI at `http://localhost:0` (random port by default).

---

## Launching UI Mode

```bash
# Default launch
npx playwright test --ui

# Specify a port
npx playwright test --ui-port 8080

# Specify a host (useful in containers)
npx playwright test --ui-host 0.0.0.0

# Combine host and port
npx playwright test --ui-port 8080 --ui-host 0.0.0.0
```

---

## UI Mode Interface Overview

The UI Mode window has several panels:

| Panel | Description |
|-------|-------------|
| **Sidebar (left)** | File tree of all test files and individual tests |
| **Action list** | Step-by-step list of every action the test performed |
| **DOM Snapshot** | Visual snapshot of the page at each action step |
| **Source tab** | Highlights the current line in the test source code |
| **Network tab** | Shows all network requests made during the step |
| **Console tab** | Browser console messages logged during the step |
| **Errors tab** | Detailed error messages and stack traces |
| **Metadata tab** | Test duration, browser, project, and status |

---

## Key Features

### 1. Run Individual Tests

Click the play button next to any test or test file to run it. No need to type file paths in the terminal.

### 2. Watch Mode

UI Mode watches your test files for changes. When you save a file, affected tests re-run automatically.

```
Watch mode is ON by default in UI Mode.
Toggle it using the eye icon in the toolbar.
```

### 3. Time-Travel Debugging

Click on any action in the action list to see:
- The DOM snapshot at that exact moment
- The source code line that triggered the action
- Network requests made during that action
- Console messages logged at that point

### 4. Filtering Tests

| Filter Method | How |
|---------------|-----|
| By file | Click a file in the sidebar |
| By text search | Type in the search bar at the top |
| By status | Click passed/failed/skipped filter buttons |
| By project | Select project from the dropdown |
| By tag | Search for `@tag` in the search bar |

### 5. Pick Locator

Use the locator picker tool in UI Mode to hover over elements in the DOM snapshot and see the recommended Playwright locator.

---

## UI Mode vs HTML Report

| Feature | UI Mode | HTML Report |
|---------|---------|-------------|
| **When used** | During development | After test run |
| **Interactive** | Yes (run, re-run, debug) | View only |
| **Watch mode** | Yes | No |
| **Time-travel** | Yes (DOM snapshots per step) | Only if trace attached |
| **Locator picker** | Yes | No |
| **Filtering** | Real-time | Static filters |
| **Re-run tests** | Click play button | Must go back to terminal |
| **Sharing** | Not shareable (local server) | Shareable as static files |
| **CI usage** | Not suitable | Ideal as artifact |

---

## UI Mode vs Debug Mode

| Feature | UI Mode | Debug Mode (Inspector) |
|---------|---------|------------------------|
| **Interface** | Browser-based GUI | Desktop Inspector window |
| **Run multiple tests** | Yes | Usually one at a time |
| **Watch mode** | Yes | No |
| **Step through code** | Click actions in list | Step/Resume buttons |
| **Edit and re-run** | Auto re-runs on save | Must restart |
| **Best for** | Development workflow | Pinpointing a specific bug |

---

## Practical Workflow with UI Mode

### Step 1: Start UI Mode

```bash
npx playwright test --ui
```

### Step 2: Select a test

Click on a test in the sidebar to highlight it.

### Step 3: Run the test

Click the green play button. Watch the actions populate in real time.

### Step 4: Inspect a step

Click on any action (e.g., `page.click`) to see the DOM snapshot at that moment.

### Step 5: Edit your test

Open the test file in your editor, make changes, and save. UI Mode detects the change and re-runs automatically.

### Step 6: Fix failures

If a test fails, click on the failed step to see the error, DOM state, and network activity.

---

## Tips and Best Practices

- Use UI Mode as your primary development tool -- it replaces the terminal for running tests.
- Keep a terminal open for `npx playwright test --ui` and your editor side by side.
- Use the search bar to quickly jump to specific tests when your suite grows large.
- UI Mode works best on `localhost`; for remote machines, set `--ui-host 0.0.0.0`.
- UI Mode is not designed for CI -- use it only for local development.

---

## Limitations

- Cannot be used in CI/CD pipelines (requires a display).
- The watch mode watches test files, not application source code.
- Large test suites may take a moment to load the sidebar.

---

## Next Steps

Continue to [06_Debug_Mode.md](./06_Debug_Mode.md) to learn about the Playwright Inspector and debug mode.
