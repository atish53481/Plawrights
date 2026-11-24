# Lecture - Playwright CLI: Mastering Command-Line Tools

## Overview

This lecture covers every **Playwright CLI command** — from running tests and recording with codegen, to debugging with the Inspector, viewing traces, and integrating into CI/CD pipelines. Master the command line to become a Playwright power user.

## What You'll Learn

1. **CLI Overview** - All Playwright commands at a glance
2. **Running Tests** - `npx playwright test` with all flags and filters
3. **Codegen** - Recording tests with `npx playwright codegen`
4. **HTML Reports** - Generating and viewing test reports
5. **UI Mode** - Interactive test runner with `--ui`
6. **Debug Mode** - Step-through debugging with `--debug`
7. **Trace Viewer** - Analyzing test execution with traces
8. **Browser Management** - Installing and managing browsers
9. **Config vs CLI** - When to use config file vs CLI flags
10. **CI/CD Integration** - GitHub Actions, Docker, sharding

## Folder Structure

```
learning/        - Core concepts: every CLI command explained
cli_project/     - Complete project with demo scripts and tests
exercises/       - Hands-on practice exercises
notes/           - Quick reference guides
interview_questions/ - Interview preparation Q&A (60 questions)
```

## Prerequisites

- Node.js 18+ installed
- Playwright installed (`npm install`)
- Basic understanding of JavaScript and testing concepts

## Quick Start

### Run the Tests

```bash
# 1. Navigate to lecture directory
cd Lecture_Playwright_CLI

# 2. Run all tests (expect 7 pass, 3 intentional failures)
npx playwright test

# 3. Run demo scripts
bash cli_project/scripts/01_run_basic.sh
```

### View Reports

```bash
# View Playwright HTML report
npx playwright show-report cli_project/reports/html-report

# View TTA custom report
open tta-report/index.html
```

## Learning Path

1. Start with `learning/01_Playwright_CLI_Overview.md` — see all commands
2. Read through all learning files in order (01-10)
3. Try the demo scripts in `cli_project/scripts/`
4. Complete the exercises in `exercises/`
5. Review `notes/` for quick reference
6. Prepare for interviews with `interview_questions/`
