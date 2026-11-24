# Test Planner Agent - Deep Dive

## Introduction

The Test Planner agent (green) is the starting point of Playwright's agentic testing
pipeline. Its job is to explore a web application, understand its user flows, and produce
a comprehensive test plan in markdown format.

Think of it as a senior QA engineer who visits the application for the first time, clicks
around, takes notes, and writes a detailed test plan document.

---

## The Planner's System Prompt (Paraphrased)

The planner's system prompt establishes it as an **expert web application test planner**.
Key instructions include:

- You are an expert in testing web applications
- Your goal is to create a comprehensive test plan for the given page
- Explore the page thoroughly using browser tools
- Design tests that cover happy paths, edge cases, and error handling
- Each test must be independent and self-contained
- Include specific steps, not vague descriptions
- Include negative test scenarios (invalid inputs, empty fields)
- Output the plan in a clear markdown format with numbered steps

---

## Workflow Steps

### Step 1: Setup Page with `planner_setup_page`

The agent begins by calling `planner_setup_page` with the target URL. This tool:
- Launches a browser instance
- Navigates to the specified URL
- Returns confirmation that the page is ready for exploration

```
Agent calls: planner_setup_page({ url: "https://the-internet.herokuapp.com/login" })
Result: "Browser launched and navigated to the login page."
```

### Step 2: Explore via `browser_snapshot`

The agent takes an accessibility snapshot of the page to understand its structure:

```
Agent calls: browser_snapshot()
Result:
  - heading "Login Page" [level=2]
  - text "This is where you can log into the secure area."
  - textbox "Username" [id=username]
  - textbox "Password" [id=password, type=password]
  - button "Login"
  - link "Elemental Selenium"
```

This accessibility tree is far more useful than raw HTML because it shows the page
the way a user (or screen reader) would perceive it.

### Step 3: Analyze User Flows

Based on the snapshot, the agent reasons about possible user interactions:
- What can the user do on this page?
- What inputs are expected?
- What happens on success?
- What happens on failure?
- Are there edge cases (empty fields, special characters)?

### Step 4: Design Test Scenarios

The agent designs scenarios across three categories:

**Happy Path Tests:**
- Login with valid username and password
- Verify redirect to secure area
- Verify success message displayed

**Negative Tests:**
- Login with invalid username
- Login with invalid password
- Login with both fields empty
- Login with only username filled
- Login with only password filled

**Edge Case Tests:**
- Login with username containing spaces
- Login with very long input strings
- Login with special characters in fields

### Step 5: Save Plan with `planner_save_plan`

The agent calls `planner_save_plan` to write the test plan to a markdown file:

```
Agent calls: planner_save_plan({
  plan: "# Test Plan: Login Page\n\n## Test 1: Successful Login\n..."
})
```

---

## Output Format

The planner produces a markdown document with this structure:

```markdown
# Test Plan: Login Page

## Test 1: Successful Login with Valid Credentials
1. Navigate to https://the-internet.herokuapp.com/login
2. Enter "tomsmith" in the Username field
3. Enter "SuperSecretPassword!" in the Password field
4. Click the "Login" button
5. Verify the page redirects to /secure
6. Verify the message "You logged into a secure area!" is displayed

## Test 2: Login with Invalid Username
1. Navigate to https://the-internet.herokuapp.com/login
2. Enter "invaliduser" in the Username field
3. Enter "SuperSecretPassword!" in the Password field
4. Click the "Login" button
5. Verify the error message "Your username is invalid!" is displayed

## Test 3: Login with Invalid Password
1. Navigate to https://the-internet.herokuapp.com/login
2. Enter "tomsmith" in the Username field
3. Enter "wrongpassword" in the Password field
4. Click the "Login" button
5. Verify the error message "Your password is invalid!" is displayed

## Test 4: Login with Empty Fields
1. Navigate to https://the-internet.herokuapp.com/login
2. Leave the Username field empty
3. Leave the Password field empty
4. Click the "Login" button
5. Verify an error message is displayed
```

---

## Quality Standards

The planner enforces several quality standards in its test plans:

### Independence
Each test must be fully self-contained. No test should depend on the state left by
a previous test. Every test starts with a fresh navigation to the page.

### Specificity
Steps must be specific and actionable:
- **Bad**: "Fill in the login form"
- **Good**: "Enter 'tomsmith' in the Username field"

### Negative Testing
The planner always includes negative scenarios -- invalid inputs, empty fields,
boundary conditions. This is where agents excel over manual test writing, as they
systematically consider failure modes.

### Completeness
The planner explores all interactive elements on the page. If there is a link,
it checks where it goes. If there is a dropdown, it tests all options.

---

## Exploration Techniques

The planner uses multiple browser tools to explore thoroughly:

| Technique               | Tool Used                 | Purpose                          |
|--------------------------|---------------------------|----------------------------------|
| Page structure analysis  | `browser_snapshot`        | Understand DOM and elements      |
| Navigation discovery     | `browser_click` + links   | Find connected pages             |
| Form exploration         | `browser_type`, `browser_click` | Test input fields          |
| Dynamic content check    | `browser_evaluate`        | Check for JavaScript-driven UI   |
| Network analysis         | `browser_network_requests`| Identify API endpoints           |
| Console monitoring       | `browser_console_messages`| Detect client-side errors        |
| Visual inspection        | `browser_take_screenshot` | Capture visual state             |

---

## Key Takeaway

The Test Planner agent is the foundation of the agentic testing pipeline. Its output
quality directly impacts the Generator and Healer agents downstream. A well-crafted
test plan with specific steps, clear assertions, and comprehensive coverage leads to
better generated tests and fewer failures to heal.

---

*Next: [05 - Test Generator Agent Deep Dive](05_Test_Generator_Agent_Deep_Dive.md)*
