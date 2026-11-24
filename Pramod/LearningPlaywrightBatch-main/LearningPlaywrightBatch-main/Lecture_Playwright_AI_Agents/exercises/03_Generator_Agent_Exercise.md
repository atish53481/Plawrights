# Exercise 3: Using the Generator Agent

## Objective

Use the Playwright generator agent to produce executable test code from a test plan. You will evaluate the generated code quality, run it, and make improvements.

---

## Prerequisites

- Completed Exercise 2 (you have a test plan ready)
- Claude Code CLI installed and authenticated
- Playwright project initialized and configured

---

## Tasks

### Task 1: Feed the Test Plan to the Generator

1. Open Claude Code in your project directory.
2. Provide the test plan from Exercise 2 to the generator agent.
3. Example prompt:
   ```
   Use the Playwright generator agent to create test code for the dropdown page
   at https://the-internet.herokuapp.com/dropdown based on this test plan:
   [paste your test plan here]
   ```
4. Let the agent navigate the page, take snapshots, and generate the test file.
5. Save the generated test file in your `tests/` directory.

### Task 2: Review the Generated Code

Open the generated test file and evaluate it against these criteria:

1. **Locators**: Are the locators robust?
   - Does it use `getByRole`, `getByText`, or `getByTestId` over raw CSS/XPath?
   - Would the locators survive minor UI changes?
2. **Assertions**: Are the assertions correct and meaningful?
   - Does it verify the expected state after each action?
   - Are the assertion messages clear?
3. **Structure**: Is the code well-organized?
   - Are `test.describe` blocks used appropriately?
   - Is there a `beforeEach` for common setup (like navigation)?
4. **Edge Cases**: Does it handle edge cases from the plan?

Record your findings for each criterion.

### Task 3: Run the Generated Test

1. Run the test using Playwright:
   ```bash
   npx playwright test <generated-test-file> --headed
   ```
2. Record the results:
   - How many tests passed?
   - How many tests failed?
   - What were the failure reasons (if any)?
3. If tests fail, note whether the failure is due to:
   - Bad locators
   - Incorrect assertions
   - Missing waits or timing issues
   - Logic errors

### Task 4: Identify Three Improvements

Review the generated code critically and identify at least three improvements. Consider:

1. **Improvement 1**: Could any locator be more resilient?
   - Example: Replace `page.locator('#dropdown')` with `page.getByRole('combobox')`
2. **Improvement 2**: Are there missing assertions?
   - Example: Add a check for the default selected value on page load
3. **Improvement 3**: Is the test structure optimal?
   - Example: Extract repeated navigation into `beforeEach`
   - Example: Add descriptive test names that explain the expected behavior

Write down each improvement with a brief justification.

### Task 5: Refactor the Generated Code

1. Create a copy of the generated test file (e.g., `dropdown_improved.spec.js`).
2. Apply all three improvements from Task 4.
3. Add any additional improvements you think of while refactoring.
4. Run the improved tests to make sure they still pass:
   ```bash
   npx playwright test dropdown_improved.spec.js --headed
   ```

---

## Deliverable

Submit three artifacts:
1. **Generated test file** (original output from the generator agent)
2. **Improved test file** (your refactored version)
3. **Improvement notes** documenting each change and why you made it

---

## Reflection Questions

1. What percentage of the generated code was usable without modification?
2. Did the generator make any mistakes a junior QA engineer might also make?
3. How does AI-generated test code compare to record-and-playback tools like Playwright Codegen?
4. Would you feel comfortable committing the generated code to a production test suite?

---

## Estimated Time: 45-60 minutes
