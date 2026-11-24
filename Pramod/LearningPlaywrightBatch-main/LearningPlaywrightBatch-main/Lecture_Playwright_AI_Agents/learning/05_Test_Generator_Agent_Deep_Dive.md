# Test Generator Agent - Deep Dive

## Introduction

The Test Generator agent (blue) is the second stage of Playwright's agentic testing
pipeline. It takes a test plan produced by the Planner and converts it into executable
Playwright `.spec.ts` test code.

The critical insight about this agent: **it actually executes each step in a real browser
before writing the test code.** It does not guess or hallucinate selectors -- it interacts
with the live application, observes the results, and writes code based on what it sees.

---

## The Generator's System Prompt (Paraphrased)

The generator is instructed to be an **expert Playwright test code writer**. Key rules:

- Read the test plan carefully
- Execute each step in the real browser to verify it works
- Use the execution log to generate accurate test code
- Use `test.describe` blocks that match the plan structure
- Add comments before each significant step
- Use semantic locators (`getByRole`, `getByLabel`, `getByText`) over CSS selectors
- Never use `networkidle` or deprecated Playwright APIs
- Include proper assertions using `expect`

---

## Workflow

### Step 1: Read the Test Plan

The generator receives the test plan (either from the planner output or a file path).
It parses the plan to understand:
- How many test scenarios exist
- What steps each scenario contains
- What assertions are expected

### Step 2: Setup Page with `generator_setup_page`

```
Agent calls: generator_setup_page({
  url: "https://the-internet.herokuapp.com/login"
})
Result: "Browser ready. Execution logging enabled."
```

This tool also enables **execution logging** -- every browser action the agent takes
is recorded so it can later be converted to test code.

### Step 3: Execute Each Step in Real-Time

This is what makes the generator special. For each step in the test plan, the agent:

1. Takes a `browser_snapshot` to see the current page state
2. Performs the action (click, type, navigate, etc.)
3. Takes another snapshot to verify the result
4. Uses verification tools to confirm assertions

```
// For Test 1: Successful Login
Agent calls: browser_snapshot()        // See the login form
Agent calls: browser_type({           // Type in username field
  element: "Username textbox",
  text: "tomsmith"
})
Agent calls: browser_type({           // Type in password field
  element: "Password textbox",
  text: "SuperSecretPassword!"
})
Agent calls: browser_click({          // Click login button
  element: "Login button"
})
Agent calls: browser_verify_text_visible({  // Verify success
  text: "You logged into a secure area!"
})
```

### Step 4: Read Execution Log with `generator_read_log`

After executing all steps for a test scenario, the agent reads the execution log:

```
Agent calls: generator_read_log()
Result:
  Action 1: navigated to "https://the-internet.herokuapp.com/login"
  Action 2: filled textbox [id=username] with "tomsmith"
  Action 3: filled textbox [id=password] with "SuperSecretPassword!"
  Action 4: clicked button "Login"
  Action 5: verified text "You logged into a secure area!" is visible
```

This log contains the **actual locators and actions** that worked, not guesses.

### Step 5: Write Test with `generator_write_test`

The agent converts the execution log into a `.spec.ts` file:

```
Agent calls: generator_write_test({
  path: "tests/login.spec.ts",
  content: "import { test, expect } from '@playwright/test';\n\n..."
})
```

---

## Verification Tools

The generator has four specialized verification tools that map to Playwright assertions:

| Tool                            | Playwright Equivalent                         | Use Case              |
|---------------------------------|-----------------------------------------------|-----------------------|
| `browser_verify_element_visible`| `expect(locator).toBeVisible()`               | Element exists on page|
| `browser_verify_text_visible`   | `expect(page.getByText(...))).toBeVisible()`   | Text content check    |
| `browser_verify_value`          | `expect(locator).toHaveValue(...)`            | Input field values    |
| `browser_verify_list_visible`   | Multiple `toBeVisible()` checks               | List/table content    |

These tools do not just check -- they also record the assertion in the execution log
so the generated code includes proper `expect` statements.

---

## Output Format

The generator produces a complete Playwright test file:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Page Tests', () => {

  test('Test 1: Successful Login with Valid Credentials', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://the-internet.herokuapp.com/login');

    // Enter username
    await page.getByLabel('Username').fill('tomsmith');

    // Enter password
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    // Click the Login button
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify success message is displayed
    await expect(page.getByText('You logged into a secure area!')).toBeVisible();
  });

  test('Test 2: Login with Invalid Username', async ({ page }) => {
    // Navigate to the login page
    await page.goto('https://the-internet.herokuapp.com/login');

    // Enter invalid username
    await page.getByLabel('Username').fill('invaliduser');

    // Enter password
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    // Click the Login button
    await page.getByRole('button', { name: 'Login' }).click();

    // Verify error message is displayed
    await expect(page.getByText('Your username is invalid!')).toBeVisible();
  });

});
```

### Code Quality Standards
- `test.describe` block title matches the plan section
- Each `test()` title matches the plan scenario name
- Comments precede each significant action
- Semantic locators used throughout
- Proper `await` on all async operations
- `expect` assertions for all verifications

---

## The Seed File Concept

When generating tests for a large application, the generator can use a **seed file** --
a shared setup file that contains common configuration:

```typescript
// tests/seed.ts (shared setup)
export const BASE_URL = 'https://the-internet.herokuapp.com';
export const VALID_USER = { username: 'tomsmith', password: 'SuperSecretPassword!' };

export async function loginAsUser(page, user = VALID_USER) {
  await page.goto(`${BASE_URL}/login`);
  await page.getByLabel('Username').fill(user.username);
  await page.getByLabel('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
}
```

The generator can reference this seed file to avoid duplicating login logic across
multiple test files. The host can provide the seed file path as context when invoking
the generator agent.

---

## Key Insight: Execute First, Generate Second

The most important thing to understand about the Test Generator is its approach:

```
  Traditional code generators:
  Read spec → Guess code → Hope it works

  Playwright Test Generator Agent:
  Read plan → Execute in browser → Record what works → Write proven code
```

This "execute-first" approach means:
- Locators are verified against the real DOM
- Assertions are tested against actual page state
- Timing and wait conditions are observed, not assumed
- The generated code has a much higher chance of passing on first run

---

*Next: [06 - Test Healer Agent Deep Dive](06_Test_Healer_Agent_Deep_Dive.md)*
