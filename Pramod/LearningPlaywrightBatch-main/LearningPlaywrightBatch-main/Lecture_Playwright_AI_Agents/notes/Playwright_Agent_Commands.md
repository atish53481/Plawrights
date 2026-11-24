# Playwright Agent Commands & Tools

## Overview

Each Playwright AI agent has access to a set of tools. Some tools are unique to a specific agent, while others are shared across all agents. This document catalogs every tool organized by agent.

---

## Planner Agent Tools

### Unique to Planner

| Tool                | Description                                                              |
|---------------------|--------------------------------------------------------------------------|
| `planner_setup_page`| Opens a browser and navigates to the target URL for exploration          |
| `planner_save_plan` | Saves the generated test plan to a file in the project                   |

### Usage

- `planner_setup_page` is called first to load the target page in a browser instance. The planner then uses browser tools to explore the page.
- `planner_save_plan` writes the final test plan to disk after the planner has finished exploring and reasoning about the page.

---

## Generator Agent Tools

### Unique to Generator

| Tool                   | Description                                                           |
|------------------------|-----------------------------------------------------------------------|
| `generator_setup_page` | Opens a browser and navigates to the target URL for verification      |
| `generator_read_log`   | Reads the test plan or seed files to understand what tests to create   |
| `generator_write_test` | Writes the generated test code to a .spec.js file in the project      |

### Usage

- `generator_read_log` reads the planner's output or any seed test files to understand the testing requirements.
- `generator_setup_page` opens the page so the generator can verify elements exist before writing locators.
- `generator_write_test` outputs the final test file with all scenarios implemented.

---

## Healer Agent Tools

### Unique to Healer

| Tool                      | Description                                                        |
|---------------------------|--------------------------------------------------------------------|
| `test_run`                | Executes a specific test file or test suite and captures output     |
| `test_debug`              | Runs a test in debug mode to get detailed failure information       |
| `test_list`               | Lists all available test files and test names in the project        |
| `browser_generate_locator`| Generates a resilient locator for a target element on the page      |
| `edit`                    | Modifies the test source code to apply fixes                        |

### Usage

- `test_list` identifies which tests exist in the project.
- `test_run` executes the failing test to capture the error message and stack trace.
- `test_debug` provides more detailed diagnostic information when needed.
- `browser_generate_locator` navigates to the page and creates a new, working locator for an element whose selector has broken.
- `edit` applies the fix directly to the test file's source code.

---

## Shared Browser Tools

These tools are available to all three agents for interacting with web pages:

| Tool                  | Description                                                          |
|-----------------------|----------------------------------------------------------------------|
| `browser_navigate`    | Navigates the browser to a specified URL                             |
| `browser_snapshot`    | Takes an accessibility snapshot of the current page state             |
| `browser_click`       | Clicks on an element identified by a reference from the snapshot      |
| `browser_type`        | Types text into an input field                                        |
| `browser_fill_form`   | Fills a form field with a specified value                             |
| `browser_select_option`| Selects an option from a dropdown element                            |
| `browser_hover`       | Hovers over an element                                                |
| `browser_press_key`   | Presses a keyboard key or key combination                             |
| `browser_take_screenshot` | Captures a visual screenshot of the page                          |
| `browser_tabs`        | Lists and switches between browser tabs                               |
| `browser_navigate_back`| Navigates back to the previous page                                  |
| `browser_wait_for`    | Waits for a specific condition or element                             |
| `browser_console_messages` | Retrieves console messages from the browser                     |
| `browser_network_requests` | Captures network requests made by the page                      |

---

## Tool Access Summary

| Tool Category           | Planner | Generator | Healer |
|-------------------------|---------|-----------|--------|
| Shared browser tools    | Yes     | Yes       | Yes    |
| planner_setup_page      | Yes     | No        | No     |
| planner_save_plan       | Yes     | No        | No     |
| generator_setup_page    | No      | Yes       | No     |
| generator_read_log      | No      | Yes       | No     |
| generator_write_test    | No      | Yes       | No     |
| test_run / test_debug   | No      | No        | Yes    |
| test_list               | No      | No        | Yes    |
| browser_generate_locator| No      | No        | Yes    |
| edit                    | No      | No        | Yes    |
