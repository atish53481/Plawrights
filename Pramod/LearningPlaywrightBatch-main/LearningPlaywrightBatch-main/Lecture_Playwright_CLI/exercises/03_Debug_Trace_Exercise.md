# Exercise 3: Debugging with Inspector & Trace Viewer

## Objective
Master Playwright's built-in debugging tools: the Inspector for stepping through tests, and the Trace Viewer for post-mortem analysis of test runs.

---

## Prerequisites
- A Playwright project with both passing and failing tests
- At least one test that interacts with form elements

---

## Part A: Playwright Inspector

### Task 1: Debug a Passing Test
```bash
npx playwright test tests/example.spec.js --debug
```
- The Inspector window opens alongside the browser
- Click "Step Over" to execute one action at a time
- Observe: the current line is highlighted in the Inspector
- Note how the browser state changes after each step

### Task 2: Use page.pause()
Add `await page.pause()` in the middle of any test:
```javascript
test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await page.pause(); // Execution stops here
  await page.click('text=More information');
});
```
Run without `--debug`:
```bash
npx playwright test tests/example.spec.js
```
- What happens when execution hits `page.pause()`?
- Can you resume execution from the Inspector?
- Can you run additional commands in the Inspector console?

### Task 3: Pick Locator
- While paused in the Inspector, click the "Pick Locator" button (crosshair icon)
- Hover over elements on the page -- observe the suggested locator
- Click on an element to copy the locator
- Compare the suggested locator with what you would have written manually
- Try picking 5 different elements and record the locators

### Task 4: Debug a Failing Test
Intentionally break a test (e.g., use a wrong selector) and run:
```bash
npx playwright test tests/broken.spec.js --debug
```
- Step through until the failure point
- What information does the Inspector show at the failure?
- Can you identify the root cause from the Inspector alone?

---

## Part B: Trace Viewer

### Task 5: Record Traces
Add trace configuration to your test or config:
```javascript
// playwright.config.js
use: {
  trace: 'on',
}
```
Run tests:
```bash
npx playwright test
```
- Find the trace ZIP files in `test-results/` directory
- What is the file naming pattern for traces?
- How large is a typical trace file?

### Task 6: Open Trace Locally
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```
Explore the Trace Viewer:
- **Timeline**: Click on different actions to see the page state
- **DOM Snapshot**: Inspect the page at each step (before/after)
- **Network**: Review all network requests during the test
- **Console**: Check for browser console errors
- **Source**: See which line of code corresponds to each action

### Task 7: Use trace.playwright.dev
- Open https://trace.playwright.dev in your browser
- Drag and drop a trace ZIP file onto the page
- Navigate through the same views as the local Trace Viewer
- Note: traces are processed locally in the browser, not uploaded to a server

---

## Deliverable
Capture screenshots or notes for each of the following:
1. Inspector paused mid-test with "Pick Locator" active
2. Inspector showing a test failure with error details
3. Trace Viewer timeline with at least 5 actions visible
4. Trace Viewer DOM snapshot showing before/after state
5. Trace Viewer network tab showing API calls
6. A comparison of the locator suggested by "Pick Locator" vs your manual locator

---

## Bonus: Environment Variable Debugging
```bash
PWDEBUG=1 npx playwright test           # Opens Inspector for every test
PWDEBUG=console npx playwright test      # Enables playwright.$ in DevTools console
DEBUG=pw:api npx playwright test         # Verbose API logging
DEBUG=pw:browser npx playwright test     # Browser protocol logging
```
Try each and describe when you would use it.
