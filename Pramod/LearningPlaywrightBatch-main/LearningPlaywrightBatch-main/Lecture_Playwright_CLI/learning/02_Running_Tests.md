# Running Tests - npx playwright test

## Basic Usage

```bash
# Run all tests found by the config's testDir
npx playwright test

# Run a single test file
npx playwright test tests/01_homepage.spec.js

# Run multiple specific files
npx playwright test tests/login.spec.js tests/signup.spec.js

# Run all tests in a directory
npx playwright test tests/smoke/
```

---

## Complete CLI Flags Reference

| Flag | Example | Description |
|------|---------|-------------|
| `--headed` | `npx playwright test --headed` | Run browsers in headed (visible) mode |
| `--grep` | `--grep "Login"` | Only run tests matching this regex in the title |
| `--grep-invert` | `--grep-invert "SKIP"` | Exclude tests matching this regex |
| `--workers` | `--workers 4` | Number of parallel worker processes |
| `--retries` | `--retries 2` | Retry failed tests up to N times |
| `--repeat-each` | `--repeat-each 3` | Run each test N times (useful for flake detection) |
| `--timeout` | `--timeout 60000` | Test timeout in milliseconds |
| `--project` | `--project chromium` | Run only the specified project(s) |
| `--shard` | `--shard 1/3` | Run shard N of M (for CI parallelism) |
| `--reporter` | `--reporter html` | Override the reporter |
| `--output` | `--output results/` | Directory for test artifacts |
| `--config` | `--config staging.config.js` | Use a custom config file |
| `--forbid-only` | `--forbid-only` | Fail if `test.only` is found (CI safety) |
| `--global-timeout` | `--global-timeout 600000` | Total timeout for the entire test run |
| `--max-failures` | `--max-failures 5` | Stop after N test failures |
| `--list` | `--list` | List all tests without running them |
| `--pass-with-no-tests` | `--pass-with-no-tests` | Exit 0 even when no tests are found |
| `--update-snapshots` | `--update-snapshots` | Update visual comparison baselines |
| `--trace` | `--trace on` | Override trace recording setting |
| `--fully-parallel` | `--fully-parallel` | Run all tests in parallel (ignore serial) |
| `--quiet` | `--quiet` | Suppress stdout from reporters |
| `--last-failed` | `--last-failed` | Re-run only previously failed tests |

---

## Filtering Tests

### By file name or path

```bash
npx playwright test login
npx playwright test tests/smoke/
```

Playwright matches the argument as a substring against file paths.

### By test title (grep)

```bash
# Run tests whose title contains "Login"
npx playwright test --grep "Login"

# Run tests matching a regex
npx playwright test --grep "Login|Signup"

# Exclude tests matching a pattern
npx playwright test --grep-invert "FAIL"
```

### By project

```bash
npx playwright test --project chromium
npx playwright test --project chromium --project firefox
```

---

## Parallelism and Workers

```bash
# Use 4 parallel workers
npx playwright test --workers 4

# Run tests sequentially (useful for debugging)
npx playwright test --workers 1

# Use 50% of available CPU cores
npx playwright test --workers 50%
```

---

## Retries and Repetition

```bash
# Retry each failed test up to 2 times
npx playwright test --retries 2

# Run every test 3 times (detect flaky tests)
npx playwright test --repeat-each 3

# Combine: run each test 5 times, retry failures twice
npx playwright test --repeat-each 5 --retries 2
```

---

## Reporters

```bash
npx playwright test --reporter list      # Line-by-line results
npx playwright test --reporter dot       # Minimal dot output
npx playwright test --reporter html      # Generate HTML report
npx playwright test --reporter json      # JSON output
npx playwright test --reporter junit     # JUnit XML
npx playwright test --reporter line      # One line per test
```

Multiple reporters can be configured in `playwright.config.js` but not stacked via CLI flags.

---

## Timeouts

```bash
# Per-test timeout (30 seconds)
npx playwright test --timeout 30000

# Global timeout for the entire suite (10 minutes)
npx playwright test --global-timeout 600000
```

---

## Sharding for CI

```bash
# Split tests into 3 shards and run the first shard
npx playwright test --shard 1/3

# Second shard
npx playwright test --shard 2/3

# Third shard
npx playwright test --shard 3/3
```

---

## Practical Examples

```bash
# Quick smoke test, headed, single worker, chromium only
npx playwright test tests/smoke/ --project chromium --headed --workers 1

# CI run with retries, HTML report, fail on .only
npx playwright test --retries 2 --reporter html --forbid-only

# Debug a specific test file
npx playwright test tests/login.spec.js --debug

# List all tests without executing
npx playwright test --list

# Stop after first 3 failures
npx playwright test --max-failures 3
```

---

## Next Steps

Continue to [03_Codegen_Recording_Tests.md](./03_Codegen_Recording_Tests.md) to learn how to record tests using `npx playwright codegen`.
