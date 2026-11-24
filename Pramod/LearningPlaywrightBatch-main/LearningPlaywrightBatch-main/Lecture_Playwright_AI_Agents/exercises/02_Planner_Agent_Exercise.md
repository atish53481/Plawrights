# Exercise 2: Using the Planner Agent

## Objective

Use the Playwright planner agent to automatically create a test plan for a real web page. You will compare the AI-generated plan with one you write yourself to evaluate the agent's strengths and gaps.

---

## Prerequisites

- Claude Code CLI installed and authenticated
- Playwright project initialized
- Internet access (to reach the target page)

---

## Target Page

```
https://the-internet.herokuapp.com/dropdown
```

This page contains a simple dropdown menu with three options: the default prompt and two selectable values.

---

## Tasks

### Task 1: Open Claude Code in Your Project

1. Open your terminal.
2. Navigate to your Playwright project directory.
3. Launch Claude Code by running `claude` in the terminal.
4. Confirm Claude Code is ready and can access your project files.

### Task 2: Invoke the Planner Agent

1. Ask Claude to use the planner agent to analyze the dropdown page.
2. Example prompt:
   ```
   Use the Playwright planner agent to create a test plan for
   https://the-internet.herokuapp.com/dropdown
   ```
3. Wait for the agent to navigate the page, take snapshots, and produce its plan.
4. Save the generated test plan to a file for review.

### Task 3: Review the Generated Plan

1. Open the generated test plan.
2. Check the following:
   - Does it cover the **happy path** (selecting each option successfully)?
   - Does it include **edge cases** (default state, switching between options)?
   - Does it mention **assertions** (verifying the selected value)?
   - Does it identify all interactive elements on the page?
3. Rate the plan's completeness on a scale of 1-5.

### Task 4: Manually Verify Element Coverage

1. Open `https://the-internet.herokuapp.com/dropdown` in your browser.
2. Use browser DevTools to inspect all interactive elements.
3. List every element the planner should have identified:
   - The `<select>` dropdown element
   - Option 1, Option 2, and the default disabled option
   - The page heading
   - Any other elements present
4. Did the planner miss any elements? Note any gaps.

### Task 5: Write Your Own Test Plan

1. Without looking at the AI-generated plan, write your own test plan for the dropdown page.
2. Include at least:
   - 3 happy path scenarios
   - 2 edge case scenarios
   - Specific assertions for each scenario
3. Format it similarly to the AI plan for easy comparison.

### Task 6: Compare Both Plans

1. Place both plans side by side.
2. Answer:
   - What did the AI plan include that you missed?
   - What did you include that the AI missed?
   - Which plan has better scenario descriptions?
   - Which plan would be easier to hand to a developer?

---

## Deliverable

Submit three artifacts:
1. **AI-generated test plan** (saved from the planner agent)
2. **Your manual test plan** (written independently)
3. **Comparison notes** (strengths and weaknesses of each approach)

---

## Reflection Questions

1. How much time did the planner agent save compared to writing the plan manually?
2. Would you trust the AI plan enough to send it directly to a generator agent?
3. What additional context could you provide to the planner to improve its output?

---

## Estimated Time: 40-50 minutes
