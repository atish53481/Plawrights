# Agents Project - AI-Powered Test Automation Pipeline

## Overview

This project demonstrates how Playwright's built-in AI agents can be orchestrated to create a fully automated test lifecycle. It showcases three core agents working together:

1. **Planner Agent** - Analyzes the application and generates structured test plans
2. **Generator Agent** - Converts test plans into executable Playwright test code
3. **Healer Agent** - Diagnoses test failures and proposes fixes automatically

The pipeline targets [The Internet - Herokuapp](https://the-internet.herokuapp.com) as the application under test, covering common UI patterns like forms, dropdowns, checkboxes, file uploads, and dynamic content.

## How to Run

### Run All Tests

```bash
npx playwright test
```

### Run Individual Agent Workflows

```bash
# Run the Planner Agent workflow
node agents/planner_workflow.js

# Run the Generator Agent workflow
node agents/generator_workflow.js

# Run the Healer Agent workflow
node agents/healer_workflow.js
```

### Run the Full Pipeline (Plan -> Generate -> Execute -> Heal)

```bash
node agents/full_agent_pipeline.js
```

## Project Structure

```
agents_project/
|-- config/
|   |-- project_config.js          # Central configuration (URLs, paths, credentials)
|
|-- templates/
|   |-- agent_prompt_template.md   # Template for writing custom agent prompts
|   |-- test_plan_template.md      # Reusable test plan template
|
|-- plans/
|   |-- sample_test_plan.md        # Pre-generated test plan from the Planner Agent
|
|-- generated/
|   |-- sample_generated_test.spec.js  # Example output from the Generator Agent
|
|-- healed/
|   |-- (healed test files appear here after the Healer Agent runs)
|
|-- tests/
|   |-- 01_homepage_load.spec.js       # TC-001: Homepage verification (PASS)
|   |-- 02_login_form.spec.js          # TC-002: Login form (PASS)
|   |-- 03_dropdown_select.spec.js     # TC-003: Dropdown selection (PASS)
|   |-- 04_checkbox_toggle.spec.js     # TC-004: Checkbox toggle (PASS)
|   |-- 05_dynamic_content.spec.js     # TC-005: Dynamic content (PASS)
|   |-- 06_file_upload_page.spec.js    # TC-006: File upload page (PASS)
|   |-- 07_broken_selector.spec.js     # TC-007: Broken selector (INTENTIONAL FAIL)
|   |-- 08_stale_element.spec.js       # TC-008: Stale element (INTENTIONAL FAIL)
|   |-- 09_wrong_assertion.spec.js     # TC-009: Wrong assertion (INTENTIONAL FAIL)
|   |-- 10_drag_and_drop.spec.js       # TC-010: Drag and drop (PASS)
|
|-- agents/
|   |-- planner_workflow.js        # Planner Agent simulation script
|   |-- generator_workflow.js      # Generator Agent simulation script
|   |-- healer_workflow.js         # Healer Agent simulation script
|   |-- full_agent_pipeline.js     # Master orchestrator for all agents
|
|-- reports/
|   |-- (test execution reports appear here)
|
|-- reporters/
|   |-- (custom reporters)
```

## Key Concepts

- **Agent Prompt Files**: Playwright ships agent definitions as `.agent.md` files inside `node_modules/playwright/lib/agents/`. Each file contains YAML frontmatter (name, model, tools) and a system prompt.
- **Test Plan Driven**: The planner agent produces a structured test plan. The generator agent reads the plan and produces test code. This ensures traceability.
- **Self-Healing**: When tests fail, the healer agent analyzes the failure output, diagnoses root causes (wrong selectors, stale assertions, incorrect URLs), and proposes fixes.
- **Intentional Failures**: Tests 07-09 are designed to fail, simulating common AI agent mistakes like hallucinated selectors, wrong expected text, and incorrect URL assumptions.
