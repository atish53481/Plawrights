# Test Healer Agent - Deep Dive

## Introduction

The Test Healer agent (red) is the third and final stage of Playwright's agentic testing
pipeline. Its purpose is to diagnose and fix failing tests. When the application changes
and tests break, the healer investigates the root cause, applies fixes, and verifies that
the repaired tests pass.

This is arguably the most valuable agent for day-to-day test maintenance, as fixing broken
tests is one of the most time-consuming tasks in test automation.

---

## The Healer's System Prompt (Paraphrased)

The healer is instructed to be an **expert Playwright test debugger**. Key rules:

- Run all tests first to identify failures
- Debug each failing test individually
- Investigate root causes using browser tools
- Fix tests using the edit tool
- Verify fixes by re-running tests
- Never use `networkidle` or deprecated Playwright APIs
- If a fix is not possible, mark the test with `test.fixme()`
- Iterate until all tests pass or are marked as fixme

---

## Workflow

### Step 1: Run All Tests with `test_run`

The healer starts by running the entire test suite to identify which tests are failing:

```
Agent calls: test_run()
Result:
  Running 5 tests...
  PASS: Test 1 - Successful Login (1.2s)
  PASS: Test 2 - Invalid Username (0.9s)
  FAIL: Test 3 - Invalid Password (timeout)
  PASS: Test 4 - Empty Fields (0.8s)
  FAIL: Test 5 - Logout Flow (element not found)

  3 passed, 2 failed
```

### Step 2: Debug Failing Tests with `test_debug`

For each failing test, the healer runs it in debug mode to get detailed output:

```
Agent calls: test_debug({
  testName: "Test 3 - Invalid Password"
})
Result:
  Error: Timed out waiting for locator('#flash-message')
  at login.spec.ts:45:5

  Page URL at failure: https://the-internet.herokuapp.com/login
  Timeout: 30000ms
```

### Step 3: Investigate with Browser Tools

The healer uses multiple tools to understand the current state of the application:

**Browser Snapshot** -- see what elements actually exist:
```
Agent calls: browser_snapshot()
Result:
  - heading "Login Page" [level=2]
  - textbox "Username"
  - textbox "Password"
  - button "Login"
  - div [id="flash"] "Your password is invalid!"
```

**Console Messages** -- check for JavaScript errors:
```
Agent calls: browser_console_messages()
Result:
  [warning] Form validation updated - using new flash component
```

**Network Requests** -- check API behavior:
```
Agent calls: browser_network_requests()
Result:
  POST /authenticate -> 401 (response: {"error": "invalid password"})
```

### Step 4: Root Cause Analysis

Based on investigation, the healer identifies the root cause. In this example:
- The test was looking for `#flash-message` but the element ID is `#flash`
- The selector was incorrect or the application changed the element ID

### Step 5: Fix with `edit` Tool

The healer applies the fix directly to the test file:

```
Agent calls: edit({
  file: "tests/login.spec.ts",
  old_text: "await expect(page.locator('#flash-message'))",
  new_text: "await expect(page.locator('#flash'))"
})
```

### Step 6: Verify Fix with `test_run`

After applying the fix, the healer re-runs the specific test:

```
Agent calls: test_run({ testName: "Test 3 - Invalid Password" })
Result:
  PASS: Test 3 - Invalid Password (0.9s)
```

### Step 7: Iterate

The healer moves to the next failing test and repeats steps 2-6. This loop continues
until all tests pass or are marked as unfixable.

---

## Root Cause Categories

The healer encounters several common categories of test failures:

| Category              | Symptoms                              | Typical Fix                         |
|-----------------------|---------------------------------------|-------------------------------------|
| **Selector Changes**  | Element not found, timeout            | Update locator to match new DOM     |
| **Timing Issues**     | Intermittent timeouts                 | Add proper waits or increase timeout|
| **Data Dependencies** | Assertion mismatches                  | Update expected values              |
| **App Changes**       | New flows, removed features           | Rewrite test steps                  |
| **Network Issues**    | API failures, CORS errors             | Add retry logic or mock APIs        |
| **Auth Changes**      | Login failures                        | Update credentials or auth flow     |

---

## The `browser_generate_locator` Tool

This is a unique tool available only to the healer. When a test fails because a locator
is broken, the healer can ask Playwright to generate a new, robust locator:

```
Agent calls: browser_generate_locator({
  description: "the login button on the page"
})
Result:
  Recommended locators (in order of preference):
  1. page.getByRole('button', { name: 'Login' })
  2. page.getByText('Login')
  3. page.locator('button[type="submit"]')
```

The tool generates locators ranked by robustness:
1. **Role-based** (most resilient to UI changes)
2. **Text-based** (resilient unless copy changes)
3. **CSS-based** (least resilient, but most specific)

---

## The `test.fixme()` Fallback

Sometimes a test failure cannot be fixed by the healer because:
- The feature has been intentionally removed
- The test requires human judgment to update
- The failure is caused by an actual bug in the application

In these cases, the healer marks the test with `test.fixme()`:

```typescript
// Before
test('should display feature X', async ({ page }) => {
  // ... test steps that fail because feature was removed
});

// After healer marks it
test.fixme('should display feature X', async ({ page }) => {
  // TODO: Feature X was removed in the latest release.
  // This test needs human review to determine if it should
  // be deleted or updated for the replacement feature.
});
```

`test.fixme()` is different from `test.skip()`:
- `test.skip()` means "we know it fails, skip it"
- `test.fixme()` means "this needs to be fixed by a human"

---

## Rules the Healer Follows

The healer has strict rules to ensure quality fixes:

1. **Never use `networkidle`** -- it is deprecated and unreliable
2. **Never use deprecated Playwright APIs** -- always use current API
3. **Prefer semantic locators** -- `getByRole`, `getByLabel`, `getByText`
4. **Verify every fix** -- re-run the test after each change
5. **Minimal changes** -- fix only what is broken, do not refactor
6. **Document changes** -- add comments explaining why the fix was made

---

## Complete Healing Session Example

```
Healer Agent Session:
═══════════════════════════════════════════════

1. test_run()
   → 2 of 5 tests failing

2. test_debug("Test 3 - Invalid Password")
   → Error: locator('#flash-message') not found

3. browser_snapshot()
   → Found: div[id="flash"] contains error text

4. browser_generate_locator("flash message div")
   → Recommended: page.locator('#flash')

5. edit(login.spec.ts)
   → Changed: '#flash-message' → '#flash'

6. test_run("Test 3 - Invalid Password")
   → PASS

7. test_debug("Test 5 - Logout Flow")
   → Error: button "Sign Out" not found

8. browser_snapshot() on /secure page
   → Found: button with text "Logout" (was "Sign Out")

9. edit(login.spec.ts)
   → Changed: { name: 'Sign Out' } → { name: 'Logout' }

10. test_run("Test 5 - Logout Flow")
    → PASS

11. test_run()
    → 5 of 5 tests passing

═══════════════════════════════════════════════
Session complete. All tests passing.
```

---

## Key Takeaway

The Test Healer agent transforms test maintenance from a manual chore into an automated
process. It systematically diagnoses failures, applies targeted fixes, and verifies
results. The `browser_generate_locator` tool is particularly powerful, generating
resilient locators that reduce future breakage. When a fix is beyond its capability,
it gracefully falls back to `test.fixme()` and flags the issue for human review.

---

*Next: [07 - Agent Workflow: Plan, Generate, Heal](07_Agent_Workflow_Plan_Generate_Heal.md)*
