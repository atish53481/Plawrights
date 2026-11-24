# Playwright CLI Overview

## What is the Playwright CLI?

The Playwright CLI is the command-line interface provided by the `@playwright/test` package. It is the primary way to run tests, generate test code, view reports, debug, and manage browsers -- all from the terminal.

The general syntax is:

```bash
npx playwright <command> [options]
```

`npx` runs the locally installed Playwright binary from `node_modules/.bin/`.

---

## Complete Playwright CLI Commands

| Command | Description |
|---------|-------------|
| `npx playwright test` | Run all tests (or filtered subset) |
| `npx playwright codegen` | Open a browser and record actions to generate test code |
| `npx playwright show-report` | Open the HTML test report in a browser |
| `npx playwright show-trace` | Open the Trace Viewer for a `.zip` trace file |
| `npx playwright install` | Download and install browser binaries |
| `npx playwright test --ui` | Launch the interactive UI mode test runner |
| `npx playwright test --debug` | Run tests with the Playwright Inspector debugger |
| `npx playwright open` | Open a browser window for manual exploration |
| `npx playwright screenshot` | Capture a screenshot of a URL |
| `npx playwright pdf` | Generate a PDF from a URL (Chromium only) |

---

## How the CLI is Structured

```
npx playwright <command> [subcommand] [options] [arguments]
```

**Examples:**

```bash
# command = test, options = --headed --workers 2
npx playwright test --headed --workers 2

# command = codegen, argument = URL
npx playwright codegen https://example.com

# command = install, argument = browser name
npx playwright install chromium
```

---

## Getting Help

Every command supports the `--help` flag to display usage information:

```bash
# General help
npx playwright --help

# Help for the test command
npx playwright test --help

# Help for codegen
npx playwright codegen --help

# Help for install
npx playwright install --help
```

The `--help` output lists every available flag, its default value, and a brief description.

---

## CLI vs Programmatic API vs Config File

| Aspect | CLI Flags | Config File (`playwright.config.js`) | Programmatic API |
|--------|-----------|--------------------------------------|------------------|
| **Purpose** | One-off overrides, running commands | Persistent project settings | Custom scripts, not using test runner |
| **Syntax** | `--flag value` | `export default { ... }` | `const browser = await chromium.launch()` |
| **Scope** | Current run only | Every run unless overridden | Standalone Node.js scripts |
| **Examples** | `--workers 1`, `--headed` | `workers: 4`, `use: { headless: false }` | `page.goto()`, `page.click()` |
| **Precedence** | Highest (overrides config) | Base settings | N/A (different usage) |
| **Best for** | CI tweaks, quick debugging | Team-shared defaults | Scraping, automation outside testing |

---

## Key Takeaways

- The CLI is the entry point for all Playwright operations: testing, recording, reporting, debugging, and browser management.
- Use `--help` on any command to discover available options.
- CLI flags always override `playwright.config.js` settings for the current run.
- The config file is for defaults; the CLI is for overrides.

---

## Quick Reference Card

```bash
# Run all tests
npx playwright test

# Record a new test
npx playwright codegen https://example.com

# View report
npx playwright show-report

# Debug a test
npx playwright test --debug

# Install browsers
npx playwright install

# Interactive UI
npx playwright test --ui
```

---

## Next Steps

Continue to [02_Running_Tests.md](./02_Running_Tests.md) to learn every flag available for `npx playwright test`.
