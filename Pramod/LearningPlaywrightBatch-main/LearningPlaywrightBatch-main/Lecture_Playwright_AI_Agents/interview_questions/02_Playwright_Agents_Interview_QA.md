# Playwright AI Agents - Interview Questions & Answers

---

**Q1: What are the three built-in AI agents in Playwright?**

A1: Playwright ships with three AI agents: the Planner, the Generator, and the Healer. The Planner explores a web application and produces a structured test plan. The Generator takes that plan and writes executable Playwright test code. The Healer diagnoses and fixes failing tests automatically. Together they form a complete Plan-Generate-Heal pipeline for AI-assisted test automation.

---

**Q2: Describe the Planner agent's workflow.**

A2: The Planner navigates to the target URL using `planner_setup_page`, then systematically explores the page by taking accessibility snapshots, clicking interactive elements, and observing state changes. It identifies all testable elements and user flows, reasons about happy paths and edge cases, and produces a structured test plan. The plan is saved to a file using `planner_save_plan` and includes scenario descriptions, steps, and expected outcomes.

---

**Q3: How does the Generator agent create test code?**

A3: The Generator first reads the test plan or seed files using `generator_read_log` to understand what tests to write. It then opens the target page with `generator_setup_page` and takes snapshots to verify that elements referenced in the plan actually exist. It writes locators based on the live page state rather than guessing, and outputs complete Playwright test files using `generator_write_test`. The generated code includes proper test structure, assertions, and page interactions.

---

**Q4: Explain the Healer agent's workflow when it encounters a failing test.**

A4: The Healer first uses `test_list` to identify available tests, then runs the failing test with `test_run` to capture the error output. It analyzes the error message and stack trace to form a hypothesis about the root cause. It then navigates to the application with browser tools to observe the actual page state and compare it with the test's expectations. Finally, it applies a fix using `edit` and re-runs the test to verify the fix works. If the fix fails, it iterates with a different approach.

---

**Q5: What is the file format for Playwright agent definitions?**

A5: Playwright agents are defined as Markdown files with YAML frontmatter. The frontmatter contains metadata like `name`, `description`, `model`, `color`, and a `tools` array listing the tools the agent can use. The Markdown body below the frontmatter contains the agent's system prompt, which defines its role, workflow, constraints, and output format. These files are stored in `node_modules/playwright/lib/agents/`.

---

**Q6: What fields are in the YAML frontmatter of an agent file?**

A6: The YAML frontmatter includes `name` (unique identifier for the agent), `description` (human-readable summary of the agent's purpose), `model` (which LLM model to use, such as sonnet), `color` (hex color code for UI display), and `tools` (an array of tool names the agent is allowed to call). These fields configure the agent's identity, capabilities, and appearance without modifying the prompt logic.

---

**Q7: What tools are available to all three Playwright agents?**

A7: All three agents share a common set of browser interaction tools including `browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_fill_form`, `browser_select_option`, `browser_hover`, `browser_press_key`, `browser_take_screenshot`, `browser_tabs`, `browser_navigate_back`, and `browser_wait_for`. These shared tools allow every agent to navigate and interact with web pages regardless of its specific role.

---

**Q8: What does the `planner_setup_page` tool do?**

A8: The `planner_setup_page` tool opens a browser instance and navigates to the target URL that the planner needs to explore. It initializes the browser context with appropriate settings and loads the page so the planner can begin taking snapshots and interacting with elements. This tool is exclusive to the planner because only the planner needs to explore pages from scratch to create test plans.

---

**Q9: What is `generator_read_log` and why is it important?**

A9: `generator_read_log` allows the generator agent to read test plans, seed test files, or other input documents that define what tests to create. It is important because the generator should not invent test scenarios on its own; it should follow a plan created by the planner or provided by the user. By reading the plan first, the generator ensures its output aligns with the intended test coverage and follows established patterns from seed files.

---

**Q10: What makes `browser_generate_locator` unique to the Healer?**

A10: `browser_generate_locator` navigates to the live application and generates a new, resilient locator for a specific element whose original selector has broken. It is unique to the healer because only the healer deals with broken locators that need replacement. The tool uses the current page state to produce locators using Playwright best practices (getByRole, getByText, getByTestId), ensuring the replacement locator is more resilient than the one that broke.

---

**Q11: What happens when the Healer cannot fix a test?**

A11: When the healer exhausts its repair strategies and cannot make a test pass, it annotates the test with `test.fixme()`. This Playwright annotation skips the test in future runs while clearly signaling that it needs manual attention. This approach is preferable to deleting the test (which loses the test logic) or leaving it broken (which creates noise in test reports). The `test.fixme()` marker preserves the test for future repair while keeping the suite green.

---

**Q12: What does the `model` field in the agent YAML frontmatter control?**

A12: The `model` field specifies which LLM model the agent should use for reasoning and decision-making. Common values include `sonnet` (balanced speed and quality), `opus` (highest quality but slower), and `haiku` (fastest and cheapest). The choice of model affects the agent's reasoning capability, cost, and speed. Complex agents like the healer might benefit from a more capable model, while simpler tasks might use a faster, cheaper model.

---

**Q13: How do Playwright agents explore web applications?**

A13: Agents explore applications by alternating between `browser_snapshot` (which takes an accessibility tree snapshot of the page) and interaction tools like `browser_click` and `browser_type`. The snapshot provides a structured representation of all elements on the page, including their roles, names, and states. The agent reads this snapshot, identifies interactive elements, clicks or interacts with them, and takes another snapshot to observe the resulting state change. This observe-act cycle continues until the agent has explored all relevant functionality.

---

**Q14: How does the Generator verify elements before generating test code?**

A14: The generator uses `generator_setup_page` to open the actual target page in a browser, then takes snapshots to see the real elements present on the page. Before writing a locator in the test code, it checks that the element exists in the snapshot and determines the best locator strategy. This verification step prevents the generator from writing tests with locators for elements that do not exist, which would immediately fail when run.

---

**Q15: What are seed files and how does the Generator use them?**

A15: Seed files are existing test files in the project that serve as examples of the team's coding style, locator conventions, and test structure. The generator reads these files via `generator_read_log` and uses them as templates for the new tests it creates. This ensures consistency: the generated code follows the same patterns, naming conventions, and assertion styles used in the existing test suite, making the output feel like a natural extension of the codebase rather than foreign AI-generated code.

---

**Q16: What quality standards does the Planner enforce in its test plans?**

A16: The planner ensures each test plan includes clearly defined scenarios with descriptive names, step-by-step actions, expected results with specific assertions, coverage of both happy paths and edge cases, and identification of all interactive elements on the page. It structures the plan in a format that the generator can directly consume, with enough detail that each scenario can be unambiguously translated into test code. The planner also considers page state management and test independence.

---

**Q17: How does the Healer perform root cause analysis?**

A17: The healer performs root cause analysis by first parsing the error message and stack trace to understand what failed and where. It then navigates to the application to observe the current state, comparing it with what the test expected. It distinguishes between several failure categories: wrong assertion values (the page changed), broken locators (elements were renamed or restructured), missing elements (features were removed), and timing issues (elements load asynchronously). This diagnosis determines which fix strategy to apply.

---

**Q18: What output formats do the three agents produce?**

A18: The planner produces a structured test plan document in Markdown format with numbered scenarios, steps, and expected results. The generator produces executable `.spec.js` test files with proper Playwright syntax, imports, and test structure. The healer produces modified test files with fixes applied directly to the source code, or tests annotated with `test.fixme()` when automatic repair is not possible. Each agent's output is designed to be consumable by the next stage in the pipeline.

---

**Q19: How do you run Playwright agents with Claude Code?**

A19: You run Playwright agents by launching Claude Code in your project directory (by running `claude` in the terminal) and then asking Claude to use a specific agent in your prompt. For example: "Use the Playwright planner agent to plan tests for [URL]" or "Use the Playwright healer agent to fix failing tests in [file]." Claude Code recognizes these agent references and loads the corresponding agent file from `node_modules/playwright/lib/agents/`, adopting its role, tools, and workflow.

---

**Q20: How do Playwright's built-in agents compare to commercial AI testing tools?**

A20: Playwright's agents are open-source, integrated directly into the Playwright framework, and powered by general-purpose LLMs through Claude Code. Commercial tools like Testim, Mabl, or Functionize offer proprietary AI models trained specifically for testing, cloud-based execution, visual testing, and dedicated support. Playwright's agents offer more flexibility and transparency (you can read and modify the agent prompts), while commercial tools offer more polished UX and out-of-the-box CI/CD integration. The cost model also differs: Playwright agents charge per LLM token usage, while commercial tools charge subscription fees.
