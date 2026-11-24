# Agent Workflow: Plan -> Generate -> Heal

## Introduction

Playwright's three built-in agents are designed to work as a pipeline. Each agent's output
becomes the next agent's input, creating a complete automated testing lifecycle from
exploration to code generation to maintenance.

This document covers how the agents hand off work, how feedback loops operate, and how
to integrate the full pipeline into real-world workflows.

---

## The Complete Lifecycle

```
  ┌──────────────────────────────────────────────────────────────┐
  │                   AGENTIC TESTING PIPELINE                   │
  ├──────────────────────────────────────────────────────────────┤
  │                                                              │
  │  ┌──────────┐       ┌───────────┐       ┌──────────┐        │
  │  │ PLANNER  │──────▶│ GENERATOR │──────▶│  HEALER  │        │
  │  │ (Green)  │       │  (Blue)   │       │  (Red)   │        │
  │  └──────────┘       └───────────┘       └──────────┘        │
  │       │                  │                   │               │
  │       ▼                  ▼                   ▼               │
  │   Test Plan         Test Code           Fixed Tests          │
  │  (markdown)        (.spec.ts)          (.spec.ts)            │
  │                                              │               │
  │                                              ▼               │
  │                                     ┌──────────────┐         │
  │                                     │   CI / CD    │         │
  │                                     │   Pipeline   │         │
  │                                     └──────────────┘         │
  │                                                              │
  └──────────────────────────────────────────────────────────────┘
```

---

## How Agents Hand Off Work

### Planner -> Generator

The planner produces a **test plan in markdown format**. This plan is the contract
between the two agents.

```
Planner Output (test-plan.md):
─────────────────────────────
# Test Plan: Login Page

## Test 1: Successful Login
1. Navigate to /login
2. Enter "tomsmith" in Username
3. Enter "SuperSecretPassword!" in Password
4. Click Login
5. Verify success message

## Test 2: Invalid Username
1. Navigate to /login
2. Enter "invalid" in Username
...
```

The generator reads this plan and executes each step. It does not need to re-explore
the application -- the planner already did that work.

### Generator -> Healer

The generator produces a **`.spec.ts` test file**. The healer runs this file using
Playwright's test runner and processes any failures.

```
Generator Output (login.spec.ts):
──────────────────────────────────
import { test, expect } from '@playwright/test';

test.describe('Login Page Tests', () => {
  test('Test 1: Successful Login', async ({ page }) => {
    await page.goto('/login');
    ...
  });
});
```

The healer runs `npx playwright test login.spec.ts` and works with whatever fails.

### Healer -> CI/CD

The healer produces **fixed test files** that pass reliably. These files are ready
to be committed and run in continuous integration.

---

## Feedback Loops

The pipeline is not strictly linear. There are feedback loops that improve quality
over time:

```
  ┌──────────────────────────────────────────────────┐
  │                                                  │
  │    ┌────────┐     ┌───────────┐     ┌────────┐   │
  │    │PLANNER │────▶│ GENERATOR │────▶│ HEALER │   │
  │    └────────┘     └───────────┘     └────────┘   │
  │         ▲               ▲               │        │
  │         │               │               │        │
  │         │               └───────────────┘        │
  │         │          Healer informs future          │
  │         │          generation patterns            │
  │         │                                        │
  │         └────────────────────────────────┘        │
  │           Healer findings inform                  │
  │           future planning                         │
  └──────────────────────────────────────────────────┘
```

### Healer -> Generator Feedback
When the healer fixes locator issues, those patterns inform future generation.
For example, if `getByRole` locators consistently survive while CSS selectors break,
the generator learns to prefer role-based locators.

### Healer -> Planner Feedback
When the healer finds that certain test scenarios are consistently problematic
(e.g., tests that depend on animation timing), this informs future planning to
avoid or handle those scenarios differently.

---

## Practical Example Walkthrough

Let us walk through the entire pipeline for testing a to-do application.

### Phase 1: Planning

```
Human: "Create a test plan for https://demo.playwright.dev/todomvc"

Planner Agent:
  1. planner_setup_page({ url: "https://demo.playwright.dev/todomvc" })
  2. browser_snapshot()
     → Found: text input "What needs to be done?", empty list
  3. browser_type({ text: "Buy groceries" })
  4. browser_press_key({ key: "Enter" })
  5. browser_snapshot()
     → Found: todo item "Buy groceries", checkbox, delete button
  6. ... explores more features ...
  7. planner_save_plan({
       plan: "# TodoMVC Test Plan\n## Test 1: Add a todo item\n..."
     })
```

### Phase 2: Generation

```
Generator Agent:
  1. Reads test plan (7 test scenarios)
  2. generator_setup_page({ url: "https://demo.playwright.dev/todomvc" })
  3. For Test 1 - Add a todo:
     a. browser_snapshot()
     b. browser_type({ element: "What needs to be done?", text: "Buy groceries" })
     c. browser_press_key({ key: "Enter" })
     d. browser_verify_text_visible({ text: "Buy groceries" })
  4. generator_read_log()
  5. ... repeats for all 7 tests ...
  6. generator_write_test({ path: "tests/todomvc.spec.ts", content: "..." })
```

### Phase 3: Healing (when tests break later)

```
Healer Agent (after app update changes the input placeholder):
  1. test_run()
     → 3 of 7 tests failing: "locator 'What needs to be done?' not found"
  2. test_debug("Test 1 - Add a todo")
     → placeholder changed to "Add a new task"
  3. browser_snapshot()
     → Confirmed: textbox now says "Add a new task"
  4. edit(todomvc.spec.ts)
     → Replace all: "What needs to be done?" → "Add a new task"
  5. test_run()
     → 7 of 7 tests passing
```

---

## Continuous Testing with Agents in CI/CD

Integrating agents into CI/CD enables continuous test maintenance:

```yaml
# .github/workflows/agentic-tests.yml
name: Agentic Test Pipeline

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'  # Daily at 6 AM

jobs:
  run-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install

      # Run existing tests
      - run: npx playwright test
        continue-on-error: true

      # If tests fail, invoke healer agent
      - name: Heal failing tests
        if: failure()
        run: |
          npx playwright test --reporter=json > results.json
          # Invoke healer agent with results
          claude-code run test-healer --input results.json

      # Re-run healed tests
      - run: npx playwright test
```

### Workflow Strategies

| Strategy           | Trigger                    | Agents Used          | Use Case               |
|--------------------|----------------------------|----------------------|------------------------|
| **On-demand plan** | New feature deployed       | Planner + Generator  | Bootstrap tests        |
| **Nightly heal**   | Scheduled (cron)           | Healer               | Fix drift              |
| **PR validation**  | Pull request opened        | Healer               | Ensure tests pass      |
| **Weekly explore** | Scheduled (weekly)         | Planner              | Discover new scenarios |

---

## Best Practices

1. **Version control plans**: Store test plans in your repo alongside test code
2. **Review generated tests**: Always have a human review agent-generated code before merging
3. **Set agent limits**: Configure maximum iterations and token budgets
4. **Monitor costs**: Track LLM API usage per pipeline run
5. **Start small**: Begin with one page or feature, not the entire application
6. **Use the hybrid approach**: Keep critical path tests hand-written, use agents for the rest

---

## Key Takeaway

The Plan -> Generate -> Heal pipeline creates a self-sustaining testing ecosystem.
The planner explores and designs, the generator builds and verifies, and the healer
maintains and repairs. Together, they transform test automation from a one-time effort
into a continuous, adaptive process.

---

*Next: [08 - Prompt Engineering for Test Automation](08_Prompt_Engineering_For_Testing.md)*
