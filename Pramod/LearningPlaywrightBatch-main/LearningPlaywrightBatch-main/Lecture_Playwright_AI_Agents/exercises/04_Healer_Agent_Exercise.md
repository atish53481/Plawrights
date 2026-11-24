# Exercise 4: Using the Healer Agent

## Objective

Intentionally break a working Playwright test and use the healer agent to diagnose and fix it. You will observe the healing process, evaluate its accuracy, and test the healer with different types of failures.

---

## Prerequisites

- A working test file (e.g., `01_homepage_load.spec.js` from your project)
- Claude Code CLI installed and authenticated
- Playwright project configured and tests passing

---

## Tasks

### Task 1: Break a Test with a Wrong Assertion

1. Open `01_homepage_load.spec.js` (or any working test in your project).
2. Find an assertion that checks the page title or heading text.
3. Change the expected value to something incorrect:
   ```javascript
   // Original
   await expect(page).toHaveTitle('The Internet');

   // Broken
   await expect(page).toHaveTitle('The Internets - Wrong Title');
   ```
4. Save the file.

### Task 2: Confirm the Test Fails

1. Run the broken test:
   ```bash
   npx playwright test 01_homepage_load.spec.js
   ```
2. Verify the test fails with an assertion error.
3. Read the error message. Note the expected vs. received values.
4. Take a screenshot of the failure output for your records.

### Task 3: Invoke the Healer Agent

1. Open Claude Code in your project directory.
2. Ask Claude to use the healer agent:
   ```
   Use the Playwright healer agent to fix the failing test in
   01_homepage_load.spec.js
   ```
3. Watch the healer's process carefully. It will:
   - List available tests
   - Run the failing test
   - Read the error output
   - Navigate to the page to verify the actual state
   - Apply a fix
   - Re-run the test to confirm the fix works

### Task 4: Observe the Diagnosis Process

While the healer works, take notes on:

1. Did the healer correctly identify the root cause of the failure?
2. What tools did the healer use during diagnosis?
3. How did the healer determine the correct expected value?
4. Did the healer navigate to the page to verify the actual title?
5. How long did the entire healing process take?

### Task 5: Evaluate the Fix

1. Open the fixed test file.
2. Compare it with the original (before you broke it):
   - Is the fix identical to the original code?
   - Did the healer change anything else in the file?
   - Is the fix correct and complete?
3. Run the test one more time to confirm it passes:
   ```bash
   npx playwright test 01_homepage_load.spec.js
   ```

### Task 6: Break a Test with a Wrong Selector

1. Now try a different type of failure. Change a locator to something that does not exist:
   ```javascript
   // Original
   await page.getByRole('heading', { name: 'Welcome' }).isVisible();

   // Broken
   await page.getByRole('heading', { name: 'NonExistentHeading123' }).isVisible();
   ```
2. Run the test to confirm it fails.
3. Invoke the healer agent again.
4. Compare the healer's behavior with the previous fix:
   - Did it use `browser_generate_locator` this time?
   - Was the selector fix more or less accurate than the assertion fix?
   - How did the diagnosis differ?

---

## Deliverable

Submit the following:
1. **Broken test file** (with wrong assertion)
2. **Healer's fix** (the corrected file after healing)
3. **Observation notes** covering:
   - Root cause identification accuracy
   - Tools used by the healer
   - Time taken for each fix
   - Comparison between assertion fix and selector fix

---

## Reflection Questions

1. What types of test failures is the healer best at fixing?
2. When would the healer fail and mark a test as `test.fixme()` instead?
3. How does the healer's `browser_generate_locator` tool differ from writing locators manually?
4. Would you trust the healer to run automatically in CI/CD without human review?

---

## Estimated Time: 40-50 minutes
