# Prompt Engineering for Testing - Cheatsheet

## Agent File Structure

Playwright agent files are Markdown documents with YAML frontmatter followed by the prompt body.

```yaml
---
name: my-agent-name
description: "Brief description of what this agent does"
model: sonnet
color: "#hexcolor"
tools:
  - tool_name_1
  - tool_name_2
---

[Prompt body goes here in Markdown]
```

### YAML Frontmatter Fields Explained

| Field         | Purpose                                                    | Example                |
|---------------|------------------------------------------------------------|------------------------|
| `name`        | Unique identifier for the agent                            | `playwright-test-planner` |
| `description` | Human-readable summary shown in UI                         | `"Plans test scenarios"` |
| `model`       | Which LLM model to use (sonnet, opus, haiku)               | `sonnet`               |
| `color`       | UI accent color for the agent                              | `"#0ea5e9"`            |
| `tools`       | List of tools the agent can call during execution           | `[browser_navigate, ...]` |

---

## Prompt Structure Best Practices

A well-structured agent prompt follows this pattern:

```markdown
## Role
You are a [specific role] that [primary responsibility].

## Workflow
1. First, do [step 1]
2. Then, do [step 2]
3. Finally, do [step 3]

## Constraints
- Always [requirement]
- Never [restriction]
- If [condition], then [action]

## Output Format
Return your results as:
- [format specification]
```

---

## Do's

- **Be specific**: "Test the login form with valid credentials and verify redirect to dashboard"
- **Include examples**: Provide sample input/output so the agent knows the expected format
- **Specify output format**: "Return the plan as a numbered list with assertions for each step"
- **Define scope**: "Only test the checkout flow, do not test navigation or footer links"
- **Set quality bars**: "Each scenario must include at least one assertion"
- **Use numbered workflows**: Sequential steps are easier for agents to follow

---

## Don'ts

- **Don't be vague**: Avoid "test the page" without specifying what to test
- **Don't skip constraints**: Without guardrails, agents may take unexpected actions
- **Don't assume context**: The agent starts fresh each time; provide all necessary information
- **Don't overload**: Keep prompts focused on one task; split complex work across agents
- **Don't forget edge cases**: If you want edge cases tested, explicitly ask for them
- **Don't use ambiguous terms**: "Check" could mean assert, click, or visually inspect

---

## Custom Agent Prompt Template

```yaml
---
name: custom-[feature]-tester
model: sonnet
color: "#your-color"
description: "Tests [feature] on [application]"
tools:
  - browser_navigate
  - browser_snapshot
  - browser_click
  - browser_fill_form
  - browser_take_screenshot
---

## Role
You are a QA automation agent specialized in testing [feature].

## Context
- Application URL: [URL]
- Key elements: [list of important elements]
- Business rules: [any domain-specific rules]

## Workflow
1. Navigate to [URL]
2. Verify the page loads with [expected initial state]
3. Perform [primary interaction]
4. Assert [expected outcome]
5. Test edge cases: [list specific edge cases]

## Constraints
- Use resilient locators (getByRole, getByText, getByTestId)
- Wait for elements before interacting
- Take a screenshot after each major step
- Report any unexpected behavior

## Output Format
Return a structured report:
- Page: [URL]
- Tests Run: [count]
- Passed: [count]
- Failed: [count]
- Details: [list of test results]
```

---

## Quick Tips for Better Results

1. Start with the planner to understand the page before writing prompts
2. Reference existing test files as "seed" examples for the generator
3. Include the exact URL, not just the page name
4. Mention the tech stack if relevant (React, Angular, etc.)
5. For complex forms, list all field names and valid/invalid values
6. Ask the agent to explain its reasoning when debugging unexpected output
7. Iterate: refine your prompt based on the agent's output quality
