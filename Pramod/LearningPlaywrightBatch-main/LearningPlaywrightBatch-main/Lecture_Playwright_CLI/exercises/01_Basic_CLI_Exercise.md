# Exercise 1: Basic CLI Commands

## Objective
Get hands-on experience with the core Playwright CLI commands for running, filtering, and configuring test execution from the terminal.

---

## Prerequisites
- Node.js installed
- A Playwright project with at least 5-10 test files
- Browsers installed via `npx playwright install`

---

## Tasks

### Task 1: Run All Tests
```bash
npx playwright test
```
- Note the total number of tests discovered
- Note the default reporter format
- Record the total execution time

### Task 2: Compare Worker Counts
```bash
npx playwright test --workers 4
npx playwright test --workers 1
```
- Run each command 3 times and record the average execution time
- What is the speed difference between 4 workers and 1 worker?
- Why might you use `--workers 1` intentionally?

### Task 3: Filter Tests with --grep
```bash
npx playwright test --grep "login"
npx playwright test --grep "login|signup"
npx playwright test --grep-invert "login"
```
- How many tests match "login"?
- What does `--grep-invert` do differently?
- Can you use regex patterns with `--grep`?

### Task 4: Compare Reporters
```bash
npx playwright test --reporter list
npx playwright test --reporter dot
npx playwright test --reporter line
npx playwright test --reporter json
npx playwright test --reporter html
```
- Describe the output format of each reporter in one sentence
- Which reporter gives the most detail during execution?
- Which reporter is best for CI pipelines?

### Task 5: Test Sharding
```bash
npx playwright test --shard 1/2
npx playwright test --shard 2/2
```
- How many tests does each shard run?
- Do the shards overlap (run the same test twice)?
- Try `--shard 1/3`, `--shard 2/3`, `--shard 3/3` -- does every test get covered?

### Task 6: Timeout Control
```bash
npx playwright test --timeout 5000
npx playwright test --timeout 1000
npx playwright test --timeout 0
```
- What happens when timeout is too short?
- What does `--timeout 0` mean?
- How does CLI timeout interact with `test.setTimeout()` in code?

---

## Deliverable

Complete the following comparison table:

| Command | Tests Run | Time (s) | Reporter Output | Notes |
|---------|-----------|-----------|-----------------|-------|
| `npx playwright test` | | | | |
| `--workers 4` | | | | |
| `--workers 1` | | | | |
| `--grep "login"` | | | | |
| `--reporter list` | | | | |
| `--reporter dot` | | | | |
| `--reporter line` | | | | |
| `--shard 1/2` | | | | |
| `--shard 2/2` | | | | |
| `--timeout 5000` | | | | |

---

## Bonus Challenge
- Combine multiple flags: `npx playwright test --grep "login" --workers 1 --reporter list --timeout 10000`
- What is the order of precedence when flags conflict with config file settings?
