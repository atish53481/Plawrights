# Exercise 5: Build Your Own Agent Pipeline

## Objective

Create a complete end-to-end testing pipeline using all three Playwright AI agents: Plan, Generate, and Heal. This mini-project simulates a real-world workflow where AI agents collaborate to deliver a full test suite.

---

## Prerequisites

- Completed Exercises 1-4
- Claude Code CLI installed and authenticated
- Playwright project configured
- Familiarity with all three agents

---

## Choose Your Target Page

Pick ONE of the following pages from The Internet:

| Page                  | URL                                              | Complexity |
|-----------------------|--------------------------------------------------|------------|
| Checkboxes            | https://the-internet.herokuapp.com/checkboxes    | Beginner   |
| Add/Remove Elements   | https://the-internet.herokuapp.com/add_remove_elements/ | Intermediate |
| Key Presses           | https://the-internet.herokuapp.com/key_presses   | Advanced   |

---

## Pipeline Steps

### Step 1: Plan (Using the Planner Agent)

1. Open Claude Code in your project directory.
2. Invoke the planner agent for your chosen page:
   ```
   Use the Playwright planner agent to create a comprehensive test plan
   for [your chosen URL]. Include at least 5 test scenarios covering
   happy paths, edge cases, and boundary conditions.
   ```
3. Review the generated plan. It should have at least 5 scenarios:
   - Scenario 1: Default state verification
   - Scenario 2: Primary interaction (check/uncheck, add/remove, or key press)
   - Scenario 3: Multiple interactions in sequence
   - Scenario 4: Edge case (rapid clicks, special keys, empty state)
   - Scenario 5: State persistence or reset behavior
4. Save the plan to `test-plans/[page-name]-plan.md`.
5. If the plan has fewer than 5 scenarios, ask the planner to expand it.

### Step 2: Generate (Using the Generator Agent)

1. Feed the test plan to the generator agent:
   ```
   Use the Playwright generator agent to create test code for each
   scenario in this test plan: [paste plan or reference file]
   ```
2. The generator should produce a test file with all scenarios implemented.
3. Save the generated test file to `tests/[page-name].spec.js`.
4. Quickly review the code. Do NOT fix anything manually yet.

### Step 3: Run (Execute All Generated Tests)

1. Run the full test suite:
   ```bash
   npx playwright test tests/[page-name].spec.js --headed
   ```
2. Record the results in a table:

   | Test # | Scenario Description      | Result | Error (if failed) |
   |--------|---------------------------|--------|--------------------|
   | 1      |                           |        |                    |
   | 2      |                           |        |                    |
   | 3      |                           |        |                    |
   | 4      |                           |        |                    |
   | 5      |                           |        |                    |

3. Note the pass rate: _____ / 5 tests passed.

### Step 4: Heal (Using the Healer Agent)

1. If any tests failed, invoke the healer agent:
   ```
   Use the Playwright healer agent to fix the failing tests in
   tests/[page-name].spec.js
   ```
2. Let the healer diagnose and fix each failing test.
3. For each healed test, record:
   - What was the root cause?
   - What tool did the healer use to fix it?
   - Did the healer fix it correctly on the first attempt?
4. If all tests passed in Step 3, intentionally break one test and heal it.

### Step 5: Create a Pipeline Summary

Create a summary document with the following sections:

```markdown
# Agent Pipeline Summary: [Page Name]

## Target Page
URL: [your URL]

## Pipeline Metrics
- Planning time: ___ minutes
- Generation time: ___ minutes
- Initial pass rate: ___/5
- Healing time: ___ minutes
- Final pass rate: ___/5
- Total pipeline time: ___ minutes

## Agent Performance
### Planner
- Scenarios generated: ___
- Quality rating (1-5): ___
- Missed scenarios: ___

### Generator
- Tests produced: ___
- Tests passing on first run: ___
- Code quality rating (1-5): ___

### Healer
- Tests healed: ___
- Successful heals: ___
- Tests marked as fixme: ___

## Lessons Learned
1. [Your observation about the planning phase]
2. [Your observation about the generation phase]
3. [Your observation about the healing phase]

## Recommendations
- [What you would do differently next time]
```

---

## Bonus Challenge: Create a Custom Agent Prompt

Write your own agent prompt file targeting your chosen page. Use this template:

```yaml
---
name: custom-[page-name]-tester
model: sonnet
color: "#FF6B35"
description: "A specialized agent for testing [page name] functionality"
tools:
  - browser_navigate
  - browser_snapshot
  - browser_click
  - browser_fill_form
---

You are a specialized testing agent for [page name].

## Your Workflow
1. Navigate to the target page
2. Identify all interactive elements
3. Execute a predefined set of test actions
4. Report results with pass/fail status

## Constraints
- Only test [page name] functionality
- Use resilient locators (getByRole, getByText)
- Always verify state after each interaction
```

Save the custom agent to `agents/custom-[page-name].agent.md`.

---

## Deliverables

Submit the following five artifacts:
1. **Test plan** (`test-plans/[page-name]-plan.md`)
2. **Generated tests** (`tests/[page-name].spec.js`)
3. **Healed tests** (if applicable, the fixed version)
4. **Pipeline summary** (metrics and observations document)
5. **Custom agent prompt** (bonus)

---

## Reflection Questions

1. At which stage of the pipeline did the most value come from AI assistance?
2. What was the biggest gap between AI output and production-ready code?
3. Could this pipeline replace a junior QA engineer? Why or why not?
4. How would you integrate this pipeline into a CI/CD workflow?

---

## Estimated Time: 60-90 minutes
