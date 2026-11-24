# Prompt Engineering for Test Automation

## Introduction

In Playwright's agentic testing framework, the `.agent.md` files ARE the prompts. Every
agent's behavior is controlled by a combination of YAML frontmatter (configuration) and
a markdown body (system prompt). Understanding how to write and customize these prompts
is essential for getting high-quality test output from agents.

---

## Agent .md Files ARE Prompts

An agent file is not code -- it is a structured prompt:

```markdown
---
name: My Custom Test Agent
description: Tests checkout flows for e-commerce applications
model: sonnet
color: purple
tools:
  - browser_navigate
  - browser_snapshot
  - browser_click
  - browser_type
  - browser_verify_text_visible
---

# System Prompt

You are an expert QA engineer specializing in e-commerce checkout flows.
Your job is to thoroughly test the checkout process including...
```

The YAML frontmatter tells the **host** (Claude Code, etc.) how to configure the agent.
The markdown body tells the **LLM** how to behave.

---

## Anatomy of the YAML Frontmatter

| Field         | Purpose                              | Example Values                |
|---------------|--------------------------------------|-------------------------------|
| `name`        | Display name in host UI              | `"Test Planner"`              |
| `description` | Brief summary for agent selection    | `"Creates test plans by..."` |
| `model`       | LLM model to use                     | `sonnet`, `opus`, `gpt-4`    |
| `color`       | UI color coding                      | `green`, `blue`, `red`       |
| `tools`       | List of tools the agent can invoke   | `[browser_snapshot, edit]`   |

### Tool Selection Matters

The tools you list determine what the agent CAN do. Be intentional:
- **Read-only agents**: Give only `browser_snapshot`, `search` -- cannot modify anything
- **Writer agents**: Add `edit`, `generator_write_test` -- can create/modify files
- **Full access agents**: All browser tools + file tools -- maximum capability

Restricting tools is a form of **guardrailing** -- it prevents the agent from taking
actions you do not want.

---

## Prompt Structure Best Practices

### 1. Start with Role Definition

```markdown
You are an expert QA engineer with 10 years of experience in web application testing.
You specialize in testing [specific domain] applications.
```

### 2. State the Objective Clearly

```markdown
Your goal is to create a comprehensive test plan for the given web page.
The test plan should cover happy paths, edge cases, and error handling.
```

### 3. Define Output Format

```markdown
Output your test plan in the following format:

# Test Plan: [Page Name]

## Test 1: [Scenario Name]
1. [Step with specific details]
2. [Step with specific details]
3. Verify [expected result]
```

### 4. Include Rules and Constraints

```markdown
Rules:
- Each test must be independent (no shared state)
- Always include negative test cases
- Use specific values, not placeholders
- Never use networkidle
- Prefer getByRole and getByLabel over CSS selectors
```

### 5. Provide Examples

```markdown
Example of a good test step:
  "Enter 'john@example.com' in the Email field"

Example of a bad test step:
  "Fill in the email" (too vague, no specific value)
```

---

## Writing Custom Agent Prompts

### Example: E-Commerce Checkout Agent

```markdown
---
name: Checkout Tester
description: Tests e-commerce checkout flows end-to-end
model: sonnet
color: orange
tools:
  - browser_navigate
  - browser_snapshot
  - browser_click
  - browser_type
  - browser_select_option
  - browser_verify_text_visible
  - browser_verify_element_visible
  - browser_wait_for
---

# Checkout Flow Test Agent

You are an expert QA engineer specializing in e-commerce checkout processes.

## Objective
Test the complete checkout flow from cart to order confirmation.

## Test Scenarios to Cover
1. **Happy path**: Add item, proceed to checkout, fill shipping, fill payment, confirm
2. **Empty cart**: Try to checkout with no items
3. **Invalid payment**: Use declined card number 4000000000000002
4. **Missing required fields**: Submit forms with empty required fields
5. **Coupon codes**: Test valid and invalid coupon codes
6. **Shipping options**: Test all available shipping methods

## Rules
- Always start from the product listing page
- Use realistic test data (not "test123")
- Verify price calculations at each step
- Check for proper error messages on validation failures
- Test both guest checkout and registered user checkout

## Output
Generate Playwright test code in TypeScript with proper assertions.
```

---

## Good vs Bad Prompt Examples

### Bad Prompt
```
Test the website. Find bugs. Write tests.
```

**Problems**: No specific URL, no scope, no format, no constraints. The agent will
wander aimlessly.

### Good Prompt
```
You are an expert web application tester. Your task is to test the login page at
https://the-internet.herokuapp.com/login.

Create tests covering:
1. Valid login (username: tomsmith, password: SuperSecretPassword!)
2. Invalid username
3. Invalid password
4. Empty fields

For each test, navigate to the page fresh. Use semantic locators (getByRole, getByLabel).
Output as a Playwright TypeScript test file using test.describe blocks.
```

**Why it works**: Specific URL, specific credentials, specific scenarios, specific
output format, specific locator strategy.

---

## Parameterizing Prompts with Context

Prompts become more powerful when parameterized with runtime context:

### URL Context
```markdown
Test the page at: {{URL}}
```

### Credentials Context
```markdown
Use these test credentials:
- Admin: username={{ADMIN_USER}}, password={{ADMIN_PASS}}
- Regular user: username={{USER}}, password={{USER_PASS}}
```

### Scope Context
```markdown
Focus only on the {{FEATURE}} feature.
Do not navigate away from the {{FEATURE}} section.
```

### Existing Test Context
```markdown
Here is the existing test file that needs updating:

{{EXISTING_TEST_CODE}}

Update this test to work with the current version of the application.
Do not change the test structure, only fix broken selectors and assertions.
```

---

## Tips for Better Test Generation Results

### 1. Be Specific About Locator Strategy
```markdown
Locator priority (use in this order):
1. page.getByRole('button', { name: 'Submit' })
2. page.getByLabel('Email')
3. page.getByText('Welcome')
4. page.getByTestId('submit-btn')  -- only if above fail
5. page.locator('css-selector')    -- last resort
```

### 2. Define Assertion Expectations
```markdown
Every test must include at least one assertion using expect().
Preferred assertions:
- toBeVisible() for UI element checks
- toHaveText() for content verification
- toHaveURL() for navigation checks
- toHaveValue() for form field values
```

### 3. Specify Error Handling
```markdown
If a step fails during exploration:
1. Take a screenshot
2. Log the error
3. Try an alternative approach
4. If still failing, skip this scenario and note it in the plan
```

### 4. Set Boundaries
```markdown
Constraints:
- Maximum 10 test scenarios per page
- Maximum 8 steps per test scenario
- Do not test third-party integrations (payment gateways, OAuth)
- Do not modify any application data permanently
```

### 5. Request Comments
```markdown
Add a comment above each significant action explaining its purpose.
This makes generated tests maintainable by human developers.
```

---

## Key Takeaway

The quality of agent output is directly proportional to the quality of the prompt.
Agent `.md` files are not magic -- they are carefully engineered instructions that
guide an LLM through a specific task. Master prompt engineering, and you master
agentic testing.

---

*Next: [09 - Using Agents with LLMs](09_Using_Agents_With_LLMs.md)*
