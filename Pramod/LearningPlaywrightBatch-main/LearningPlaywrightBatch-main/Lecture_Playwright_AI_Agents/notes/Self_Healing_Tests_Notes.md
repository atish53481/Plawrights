# Self-Healing Tests - Quick Notes

## What Self-Healing Means in Testing

Self-healing tests are automated tests that can detect when they break due to application changes and automatically repair themselves without manual intervention. Instead of failing permanently when a UI element moves or gets renamed, the test adapts to the new state of the application.

---

## How Playwright's Healer Agent Implements Self-Healing

Playwright's healer is an AI-powered agent that reads test failure output, navigates to the application to observe its current state, diagnoses the root cause of failure, and applies code fixes directly to the test file.

Unlike simple selector-retry mechanisms, the healer uses an LLM to reason about failures. It understands whether the issue is a wrong assertion value, a broken locator, a missing element, or a logical error in the test.

---

## The Healing Process

```
1. RUN       -->  Execute the failing test, capture error output
2. FAIL      -->  Parse the error message and stack trace
3. DIAGNOSE  -->  Navigate to the page, take snapshots, compare expected vs actual
4. FIX       -->  Edit the test source code with the correction
5. VERIFY    -->  Re-run the test to confirm the fix works
6. REPEAT    -->  If still failing, iterate with a different fix approach
```

### Key Tools Used in Each Phase

| Phase     | Tools Used                                    |
|-----------|-----------------------------------------------|
| Run       | `test_run`, `test_list`                       |
| Diagnose  | `browser_navigate`, `browser_snapshot`, `test_debug` |
| Fix       | `browser_generate_locator`, `edit`            |
| Verify    | `test_run`                                    |

### When the Healer Cannot Fix a Test

If the healer exhausts its repair strategies and the test still fails, it marks the test with `test.fixme()`. This annotation:
- Skips the test in future runs
- Signals to the team that manual attention is needed
- Preserves the test code for future reference

---

## Limitations

Self-healing has clear boundaries. Manual intervention is required when:

- **Business logic changed**: The expected behavior itself is different, not just the UI
- **New features added**: Tests for new functionality cannot be healed into existence
- **API contract changed**: Backend changes that affect data shape or endpoints
- **Authentication flow changed**: Login mechanisms require deliberate test updates
- **Test design flaw**: The original test was poorly designed or tested the wrong thing
- **Environment issues**: The failure is caused by infrastructure, not the application

---

## Comparison with Commercial Self-Healing Tools

| Feature                  | Playwright Healer       | Healenium              | Testim                 |
|--------------------------|-------------------------|------------------------|------------------------|
| Approach                 | LLM-powered reasoning   | ML-based selector matching | AI visual matching   |
| Fix Types                | Locators, assertions, logic | Selectors only       | Selectors, visual      |
| Requires Training Data   | No                      | Yes (builds selector history) | Yes (baseline screenshots) |
| Cost                     | LLM API usage           | Open source / free     | Commercial license     |
| Framework Integration    | Playwright only          | Selenium               | Proprietary            |
| Human Review Needed      | Recommended              | Minimal                | Minimal                |
| Handles Logic Errors     | Yes (to some extent)    | No                     | No                     |
| CI/CD Integration        | Via Claude Code          | Plugin-based           | Cloud platform         |

---

## Best Practices for Writing Healable Tests

1. **Use semantic locators**: `getByRole`, `getByText`, and `getByTestId` are easier to heal than raw CSS selectors or XPath
2. **One assertion per concept**: Tests with focused assertions are easier to diagnose
3. **Descriptive test names**: Help the healer understand what the test is supposed to verify
4. **Stable test data**: Use deterministic data so the healer can distinguish data issues from UI issues
5. **Independent tests**: Tests that do not depend on each other are easier to heal in isolation
6. **Avoid hard-coded waits**: Use Playwright's built-in auto-waiting; hard-coded sleeps mask timing issues
7. **Keep tests short**: Smaller tests give the healer a narrower problem space to search
8. **Comment your intent**: A comment like `// Verify user sees success message after checkout` helps the AI understand the purpose

---

## Key Takeaway

Self-healing is a maintenance accelerator, not a replacement for thoughtful test design. The best strategy is to write well-structured tests that are easy to heal, and use the healer agent to handle the routine breakage caused by normal application evolution.
