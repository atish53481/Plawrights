# AI Agents - Quick Reference

## Agent Comparison Table

| Property        | Planner                          | Generator                        | Healer                           |
|-----------------|----------------------------------|----------------------------------|----------------------------------|
| File            | playwright-test-planner.agent.md | playwright-test-generator.agent.md | playwright-test-healer.agent.md |
| Color           | Blue (#0ea5e9)                   | Green (#10b981)                  | Amber (#f59e0b)                  |
| Model           | sonnet                           | sonnet                           | sonnet                           |
| Purpose         | Create test plans by exploring the application | Generate test code from plans    | Fix failing tests automatically  |
| Unique Tools    | planner_setup_page, planner_save_plan | generator_setup_page, generator_read_log, generator_write_test | test_run, test_debug, test_list, browser_generate_locator, edit |
| Output          | Structured test plan document    | Executable .spec.js test file    | Fixed test file or test.fixme()  |

## One-Liner Invocations

```
# Planner
"Use the Playwright planner agent to create a test plan for [URL]"

# Generator
"Use the Playwright generator agent to write tests for [URL] based on this plan: [plan]"

# Healer
"Use the Playwright healer agent to fix failing tests in [test-file]"
```

## Agent File Location

```
node_modules/playwright/lib/agents/
```

All three agents are Markdown files with YAML frontmatter. They ship with Playwright and are used by Claude Code when you reference them in your prompts.

## When to Use Which Agent

| Situation                                      | Agent     |
|------------------------------------------------|-----------|
| Starting from scratch, need test scenarios     | Planner   |
| Have a plan, need executable test code         | Generator |
| Tests broke after a UI change                  | Healer    |
| Exploring a new page to understand its elements| Planner   |
| Need resilient locators for changed elements   | Healer    |
| Need full pipeline: plan to code               | Planner then Generator |
| Maintenance of existing test suite             | Healer    |

## Pipeline Flow

```
Planner --> Test Plan --> Generator --> Test Code --> Run Tests
                                                        |
                                                   Pass? Done!
                                                   Fail? --> Healer --> Fixed Code --> Re-run
```
