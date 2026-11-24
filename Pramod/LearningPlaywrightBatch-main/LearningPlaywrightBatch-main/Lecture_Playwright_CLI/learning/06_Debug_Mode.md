# Debug Mode - Playwright Inspector

## What is Debug Mode?

Debug mode launches the **Playwright Inspector**, a dedicated debugging tool that lets you step through test actions one at a time, inspect locators, and see the browser in headed mode.

```bash
npx playwright test --debug
```

---

## Ways to Activate Debug Mode

| Method | Usage | Scope |
|--------|-------|-------|
| `--debug` flag | `npx playwright test --debug` | All tests |
| `--debug` with file | `npx playwright test tests/login.spec.js --debug` | Single file |
| `--debug` with grep | `npx playwright test --grep "Login" --debug` | Matching tests |
| `PWDEBUG=1` env var | `PWDEBUG=1 npx playwright test` | All tests |
| `page.pause()` | Add `await page.pause()` in code | Specific breakpoint |
| `PWDEBUG=console` | `PWDEBUG=console npx playwright test` | Debug with console API |

---

## What Happens When You Run --debug

1. The browser opens in **headed mode** (you can see it).
2. The **Playwright Inspector** window opens alongside the browser.
3. Test execution **pauses at the first action**.
4. You control execution with the Inspector toolbar buttons.

---

## Playwright Inspector Toolbar

| Button | Keyboard Shortcut | Action |
|--------|--------------------|--------|
| **Resume** | `F8` | Run until next breakpoint or `page.pause()` |
| **Step Over** | `F10` | Execute the current action and pause at the next one |
| **Pick Locator** | -- | Hover over page elements to see locators |
| **Record** | -- | Start recording new actions |

---

## Using page.pause()

Insert `await page.pause()` anywhere in your test to create a breakpoint:

```javascript
test('login test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.fill('#username', 'tomsmith');

  // Execution will pause here -- Inspector opens
  await page.pause();

  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');
});
```

When execution reaches `page.pause()`, the Inspector opens and you can:
- Inspect the current DOM state
- Try locators in the locator input field
- Step through remaining actions

---

## PWDEBUG Environment Variable

```bash
# Opens Inspector for all tests
PWDEBUG=1 npx playwright test

# Windows (PowerShell)
$env:PWDEBUG=1; npx playwright test

# Windows (cmd)
set PWDEBUG=1 && npx playwright test
```

When `PWDEBUG=1` is set:
- Browsers launch in headed mode
- Default timeout is set to 0 (no timeout) so tests wait for you
- The Playwright Inspector opens automatically

---

## Browser DevTools Integration

You can also use the browser's built-in DevTools alongside the Inspector:

```bash
# Launch with DevTools open (Chromium only)
PWDEBUG=console npx playwright test
```

This exposes a `playwright` object in the browser console:

```javascript
// In browser DevTools console:
playwright.$(selector)    // Query a single element
playwright.$$(selector)   // Query all elements
playwright.inspect(selector)  // Highlight element
playwright.locator(selector)  // Get Playwright locator
```

---

## Step-by-Step Debugging Walkthrough

### Step 1: Run a test in debug mode

```bash
npx playwright test tests/login.spec.js --debug
```

### Step 2: Observe the first action

The browser navigates to the URL. The Inspector highlights the current line of code.

### Step 3: Step through actions

Press `F10` (Step Over) to execute one action at a time. Watch the browser update after each step.

### Step 4: Try a locator

Click "Pick Locator" in the Inspector. Hover over elements in the browser to see what locator Playwright recommends.

### Step 5: Test a locator manually

Type a locator in the Inspector's locator input box (e.g., `getByRole('button', { name: 'Login' })`). Matching elements are highlighted in the browser.

### Step 6: Resume execution

Press `F8` (Resume) to run all remaining actions at full speed.

---

## Common Debugging Scenarios

| Problem | Debug Approach |
|---------|---------------|
| Test fails with "element not found" | Use `--debug`, step to the failing action, inspect the DOM |
| Wrong element is clicked | Use Pick Locator to find the correct selector |
| Test is flaky (sometimes passes) | Add `page.pause()` before the flaky step, inspect timing |
| Assertion fails unexpectedly | Step to just before the assertion, check the page state |
| Test works headed but fails headless | Compare screenshots; check viewport size differences |
| Navigation timeout | Step through, check if the URL redirect is expected |

---

## Debug Mode Configuration

You can also set debug-friendly defaults in your config:

```javascript
// playwright.config.js
export default {
  use: {
    // Slow down actions by 500ms each (useful for visual debugging)
    launchOptions: {
      slowMo: 500,
    },
  },
};
```

---

## Tips

- Use `--workers 1` with `--debug` to avoid multiple browser windows.
- `page.pause()` is safe to commit -- it only activates when `PWDEBUG` is set or `--debug` is used.
- Combine `--debug` with `--grep` to debug a single test quickly.
- The Inspector's locator input is the fastest way to validate selectors.

---

## Next Steps

Continue to [07_Trace_Viewer.md](./07_Trace_Viewer.md) to learn about the Trace Viewer for post-mortem analysis.
