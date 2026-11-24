# Exercise 1: Explore Playwright Agent Files

## Objective

Navigate to the Playwright agents directory inside `node_modules` and understand each agent's role, tools, and configuration. By the end of this exercise you will be able to describe all three built-in agents and compare their capabilities.

---

## Prerequisites

- Node.js and npm installed
- Playwright installed in the project (`npm init playwright@latest`)
- A code editor (VS Code recommended)

---

## Tasks

### Task 1: List All Agent Files

1. Open your terminal in the project root.
2. Navigate to `node_modules/playwright/lib/agents/`.
3. List every file in the directory.
4. You should find three `.agent.md` files. Write down their exact filenames.

### Task 2: Inspect the Planner Agent

1. Open `playwright-test-planner.agent.md` in your editor.
2. Look at the YAML frontmatter at the top of the file.
3. Answer these questions:
   - What value is set for the `model` field?
   - What `color` is assigned to the planner?
   - What is the agent's `description`?
4. Read the prompt body. What is the planner's primary workflow?

### Task 3: Count the Tools

1. For each of the three agents, count the number of tools listed in the `tools` array inside the YAML frontmatter.
2. Record the count for each agent:
   - Planner: _____ tools
   - Generator: _____ tools
   - Healer: _____ tools
3. Which agent has the most tools? Why do you think that is?

### Task 4: Compare Planner and Generator

1. Create two lists: tools available to the planner and tools available to the generator.
2. Identify tools that appear in the planner but NOT in the generator.
3. Identify tools that appear in the generator but NOT in the planner.
4. Why does each agent have its own unique tools? How does this relate to its purpose?

### Task 5: Discover the Healer's Unique Tool

1. Open the healer agent file.
2. Find the tool that no other agent has: `browser_generate_locator`.
3. Read the prompt to understand what this tool does.
4. Why is this tool exclusive to the healer? How does it help the healing process?

### Task 6: Understand the Healer's Fallback Behavior

1. In the healer agent prompt, find the section that describes what happens when the healer cannot fix a test.
2. What annotation does the healer apply to unfixable tests? (Hint: `test.fixme()`)
3. Why is this a better strategy than simply deleting the test or leaving it broken?

---

## Deliverable

Create a comparison table with the following columns and fill it in for all three agents:

| Property          | Planner         | Generator       | Healer          |
|-------------------|-----------------|-----------------|-----------------|
| File Name         |                 |                 |                 |
| Color             |                 |                 |                 |
| Model             |                 |                 |                 |
| Description       |                 |                 |                 |
| Number of Tools   |                 |                 |                 |
| Unique Tools      |                 |                 |                 |
| Primary Output    |                 |                 |                 |

---

## Reflection Questions

1. Why did the Playwright team choose to separate planning, generating, and healing into three agents instead of one?
2. If you could add a fourth agent, what would it do?
3. How does the YAML frontmatter format make agents easy to configure and extend?

---

## Estimated Time: 30-40 minutes
