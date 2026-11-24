# Playwright's Built-in AI Agents

## Introduction

Starting with Playwright 1.50+, the framework ships with three built-in AI agents located
in the `node_modules/playwright/lib/agents/` directory. These agents are designed to work
together in a pipeline: **Plan -> Generate -> Heal**.

Each agent is defined as a `.agent.md` file -- a markdown document with YAML frontmatter
that describes the agent's identity, tools, and system prompt.

---

## The Three Agents at a Glance

| Agent              | File                        | Color   | Model  | Purpose                                    |
|--------------------|-----------------------------|---------|--------|--------------------------------------------|
| **Test Planner**   | `test-planner.agent.md`     | Green   | Sonnet | Explores apps and creates detailed test plans |
| **Test Generator** | `test-generator.agent.md`   | Blue    | Sonnet | Generates `.spec.ts` test code from plans     |
| **Test Healer**    | `test-healer.agent.md`      | Red     | Sonnet | Debugs and fixes failing tests                |

```
  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
  │   TEST PLANNER   │   │  TEST GENERATOR  │   │   TEST HEALER    │
  │    (Green)       │   │     (Blue)       │   │     (Red)        │
  │                  │   │                  │   │                  │
  │  Explores app    │──▶│  Writes tests    │──▶│  Fixes failures  │
  │  Creates plans   │   │  from plans      │   │  Self-heals      │
  └──────────────────┘   └──────────────────┘   └──────────────────┘
```

---

## Agent File Format

Each `.agent.md` file follows this structure:

```yaml
---
name: Agent Name
description: What this agent does
model: sonnet
color: green
tools:
  - tool_name_1
  - tool_name_2
  - tool_name_3
---

# System Prompt

The rest of the markdown file is the system prompt that tells the LLM
how to behave, what rules to follow, and what output format to produce.
```

### YAML Frontmatter Fields

| Field           | Type     | Description                                          |
|-----------------|----------|------------------------------------------------------|
| `name`          | string   | Display name shown in the host UI                    |
| `description`   | string   | Brief description of the agent's purpose             |
| `model`         | string   | LLM model to use (sonnet, opus, gpt-4, etc.)        |
| `color`         | string   | UI color coding (green, blue, red)                   |
| `tools`         | string[] | List of tool names the agent can invoke              |

---

## How Hosts Load and Execute Agents

Agents are not standalone executables. They require a **host** -- an application that:

1. Reads the `.agent.md` file
2. Parses the YAML frontmatter for configuration
3. Uses the markdown body as the system prompt
4. Connects the specified tools to the LLM
5. Runs the agent loop (Observe -> Think -> Act -> Repeat)

**Compatible hosts include:**
- **Claude Code** (Anthropic's CLI) -- primary host for Playwright agents
- **VS Code with Claude extension** -- GUI-based agent execution
- **Custom hosts** -- any application implementing the agent protocol

```
  ┌─────────────────┐      ┌──────────────────┐
  │   HOST           │      │  .agent.md FILE  │
  │  (Claude Code)   │◀────│                  │
  │                  │      │  - YAML config   │
  │  1. Parse YAML   │      │  - System prompt │
  │  2. Load tools   │      │  - Tool list     │
  │  3. Set prompt   │      └──────────────────┘
  │  4. Run loop     │
  │                  │      ┌──────────────────┐
  │  5. Call LLM ────│─────▶│  LLM (Sonnet)    │
  │  6. Execute tool │      │                  │
  │  7. Return result│◀─────│  Reasoning +     │
  │  8. Repeat       │      │  Tool calls      │
  └─────────────────┘      └──────────────────┘
```

---

## Test Planner Agent Tools

The Test Planner has access to **21 tools** for exploring web applications:

| Tool                        | Category    | Purpose                                         |
|-----------------------------|-------------|--------------------------------------------------|
| `search`                    | File        | Search codebase for relevant files               |
| `browser_click`             | Browser     | Click on elements in the page                    |
| `browser_close`             | Browser     | Close browser tabs                               |
| `browser_console_messages`  | Browser     | Read browser console output                      |
| `browser_drag`              | Browser     | Drag and drop elements                           |
| `browser_evaluate`          | Browser     | Execute JavaScript in the page                   |
| `browser_file_upload`       | Browser     | Upload files through file inputs                 |
| `browser_handle_dialog`     | Browser     | Accept or dismiss browser dialogs                |
| `browser_hover`             | Browser     | Hover over elements                              |
| `browser_navigate`          | Browser     | Navigate to URLs                                 |
| `browser_navigate_back`     | Browser     | Go back in browser history                       |
| `browser_network_requests`  | Browser     | Inspect network traffic                          |
| `browser_press_key`         | Browser     | Press keyboard keys                              |
| `browser_run_code`          | Browser     | Run Playwright code snippets                     |
| `browser_select_option`     | Browser     | Select dropdown options                          |
| `browser_snapshot`          | Browser     | Capture accessibility tree snapshot               |
| `browser_take_screenshot`   | Browser     | Take visual screenshots                          |
| `browser_type`              | Browser     | Type text into elements                          |
| `browser_wait_for`          | Browser     | Wait for conditions                              |
| `planner_setup_page`        | Planner     | Initialize browser with target URL               |
| `planner_save_plan`         | Planner     | Save the generated test plan to a file           |

---

## Test Generator Agent Tools

The Test Generator has access to **20 tools** for generating test code:

| Tool                            | Category    | Purpose                                     |
|---------------------------------|-------------|----------------------------------------------|
| `search`                        | File        | Search codebase for context                  |
| `browser_click`                 | Browser     | Click elements during execution              |
| `browser_drag`                  | Browser     | Drag and drop during execution               |
| `browser_evaluate`              | Browser     | Run JavaScript during execution              |
| `browser_file_upload`           | Browser     | Upload files during execution                |
| `browser_handle_dialog`         | Browser     | Handle dialogs during execution              |
| `browser_hover`                 | Browser     | Hover elements during execution              |
| `browser_navigate`              | Browser     | Navigate to pages during execution           |
| `browser_press_key`             | Browser     | Press keys during execution                  |
| `browser_select_option`         | Browser     | Select options during execution              |
| `browser_snapshot`              | Browser     | Capture page state during execution          |
| `browser_type`                  | Browser     | Type text during execution                   |
| `browser_verify_element_visible`| Verification| Assert element visibility                    |
| `browser_verify_list_visible`   | Verification| Assert list content visibility               |
| `browser_verify_text_visible`   | Verification| Assert text content visibility               |
| `browser_verify_value`          | Verification| Assert input/element values                  |
| `browser_wait_for`              | Browser     | Wait for conditions during execution         |
| `generator_read_log`            | Generator   | Read execution log for code generation       |
| `generator_setup_page`          | Generator   | Initialize browser for test generation       |
| `generator_write_test`          | Generator   | Write the final .spec.ts test file           |

---

## Test Healer Agent Tools

The Test Healer has access to **10 tools** for diagnosing and fixing failures:

| Tool                        | Category    | Purpose                                         |
|-----------------------------|-------------|--------------------------------------------------|
| `search`                    | File        | Search codebase for relevant code                |
| `edit`                      | File        | Edit test files to apply fixes                   |
| `browser_console_messages`  | Browser     | Check console for errors                         |
| `browser_evaluate`          | Browser     | Run JavaScript to inspect state                  |
| `browser_generate_locator`  | Browser     | Generate robust locators for elements            |
| `browser_network_requests`  | Browser     | Check API calls and responses                    |
| `browser_snapshot`          | Browser     | Capture current page state                       |
| `test_debug`                | Testing     | Run a specific test in debug mode                |
| `test_list`                 | Testing     | List all available tests                         |
| `test_run`                  | Testing     | Run tests and capture results                    |

---

## Key Observations

1. **Tool overlap**: All three agents share `browser_snapshot` and `search` -- observation
   and codebase awareness are fundamental to every agent.

2. **Specialized tools**: Each agent has unique tools matching its role:
   - Planner: `planner_setup_page`, `planner_save_plan`
   - Generator: `generator_setup_page`, `generator_write_test`, `generator_read_log`, `browser_verify_*`
   - Healer: `test_run`, `test_debug`, `test_list`, `edit`, `browser_generate_locator`

3. **Model choice**: All three use Sonnet by default, balancing speed and capability.

4. **The healer is the only agent with the `edit` tool** -- it is the only one that
   modifies existing test files.

---

*Next: [04 - Test Planner Agent Deep Dive](04_Test_Planner_Agent_Deep_Dive.md)*
