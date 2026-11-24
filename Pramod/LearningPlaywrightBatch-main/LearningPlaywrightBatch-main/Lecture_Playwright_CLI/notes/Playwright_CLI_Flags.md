# Playwright CLI Flags - Complete Reference

All flags for `npx playwright test` organized by category.

---

## File Selection

| Flag | Example | Description | Default |
|------|---------|-------------|---------|
| `<file>` | `npx playwright test login.spec.js` | Run specific test file(s) | All files matching testMatch |
| `<directory>` | `npx playwright test tests/auth/` | Run all tests in a directory | testDir from config |
| `--config <path>` | `--config playwright.ci.config.js` | Path to config file | `playwright.config.js` |

## Filtering

| Flag | Example | Description | Default |
|------|---------|-------------|---------|
| `--grep <regex>` / `-g` | `--grep "login"` | Run tests matching pattern | None (run all) |
| `--grep-invert <regex>` | `--grep-invert "slow"` | Skip tests matching pattern | None |
| `--project <name>` | `--project chromium` | Run specific project(s) | All projects |
| `--last-failed` | `--last-failed` | Re-run only previously failed tests | Off |
| `--list` | `--list` | List tests without running | Off |

## Execution

| Flag | Example | Description | Default |
|------|---------|-------------|---------|
| `--workers <n>` / `-j` | `--workers 4` | Number of parallel workers | 50% of CPU cores |
| `--retries <n>` | `--retries 2` | Retry count for failed tests | 0 |
| `--repeat-each <n>` | `--repeat-each 3` | Run each test N times | 1 |
| `--timeout <ms>` | `--timeout 30000` | Per-test timeout in milliseconds | 30000 |
| `--global-timeout <ms>` | `--global-timeout 3600000` | Total timeout for entire run | 0 (no limit) |
| `--max-failures <n>` / `-x` | `--max-failures 5` | Stop after N test failures | 0 (no limit) |
| `--fully-parallel` | `--fully-parallel` | Run all tests in parallel (ignore serial) | Off |
| `--forbid-only` | `--forbid-only` | Fail if `test.only` is present | Off |
| `--shard <n/total>` | `--shard 1/3` | Run subset of tests for sharding | None |
| `--pass-with-no-tests` | `--pass-with-no-tests` | Exit 0 if no tests are found | Off (exit 1) |
| `--ignore-snapshots` | `--ignore-snapshots` | Skip snapshot expectations | Off |
| `--update-snapshots` / `-u` | `--update-snapshots` | Update golden/baseline snapshots | Off |

## Output & Reporting

| Flag | Example | Description | Default |
|------|---------|-------------|---------|
| `--reporter <name>` | `--reporter list` | Set reporter (list, dot, line, html, json, junit) | Depends on CI |
| `--output <dir>` | `--output ./results` | Test results output directory | `test-results/` |
| `--quiet` | `--quiet` | Suppress stdio from tests | Off |

## Browser & Display

| Flag | Example | Description | Default |
|------|---------|-------------|---------|
| `--headed` | `--headed` | Run tests with visible browser | Headless |
| `--browser <name>` | `--browser firefox` | Run on specific browser (no config needed) | chromium |
| `--debug` | `--debug` | Run with Playwright Inspector open | Off |
| `--ui` | `--ui` | Launch interactive UI mode | Off |
| `--ui-host <host>` | `--ui-host 0.0.0.0` | Host for UI mode server | localhost |
| `--ui-port <port>` | `--ui-port 8080` | Port for UI mode server | Auto |

## Advanced

| Flag | Example | Description | Default |
|------|---------|-------------|---------|
| `--trace <mode>` | `--trace on` | Force trace recording (on, off, retain-on-failure) | Config value |
| `--no-deps` | `--no-deps` | Do not run project dependencies | Off |
| `--tsconfig <path>` | `--tsconfig custom.tsconfig.json` | Path to TypeScript config | Auto-detected |

---

## Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `CI` | `CI=true npx playwright test` | Enable CI mode (changes defaults) |
| `PWDEBUG` | `PWDEBUG=1 npx playwright test` | Force Playwright Inspector |
| `DEBUG` | `DEBUG=pw:api npx playwright test` | Enable debug logging |
| `PLAYWRIGHT_BROWSERS_PATH` | `PLAYWRIGHT_BROWSERS_PATH=/cache` | Custom browser install path |
| `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD` | `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` | Skip auto browser download |

---

## Flag Precedence Rules
1. CLI flags always override config file values
2. Environment variables override both CLI flags and config for certain settings
3. `test.use()` in code overrides project-level config
4. Fixture overrides in `test.extend()` take highest precedence
