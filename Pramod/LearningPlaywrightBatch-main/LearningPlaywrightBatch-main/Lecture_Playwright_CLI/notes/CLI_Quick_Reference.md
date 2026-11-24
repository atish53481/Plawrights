# Playwright CLI - Quick Reference

## Running Tests

| Command | Example | Description |
|---------|---------|-------------|
| `npx playwright test` | `npx playwright test` | Run all tests in the project |
| `npx playwright test <file>` | `npx playwright test login.spec.js` | Run tests in a specific file |
| `npx playwright test <dir>` | `npx playwright test tests/auth/` | Run all tests in a directory |
| `npx playwright test -g <regex>` | `npx playwright test -g "login"` | Run tests matching a pattern |
| `npx playwright test --grep-invert` | `npx playwright test --grep-invert "slow"` | Exclude tests matching pattern |
| `npx playwright test --project` | `npx playwright test --project chromium` | Run tests for a specific project |
| `npx playwright test --headed` | `npx playwright test --headed` | Run with visible browser window |
| `npx playwright test --workers` | `npx playwright test --workers 4` | Set parallel worker count |
| `npx playwright test --retries` | `npx playwright test --retries 2` | Retry failed tests N times |
| `npx playwright test --repeat-each` | `npx playwright test --repeat-each 3` | Run each test N times |
| `npx playwright test --shard` | `npx playwright test --shard 1/3` | Run a subset of tests (for CI) |
| `npx playwright test --timeout` | `npx playwright test --timeout 60000` | Set test timeout in ms |
| `npx playwright test --config` | `npx playwright test --config ci.config.js` | Use a custom config file |
| `npx playwright test --last-failed` | `npx playwright test --last-failed` | Re-run only previously failed tests |
| `npx playwright test --list` | `npx playwright test --list` | List all tests without running |
| `npx playwright test --pass-with-no-tests` | `npx playwright test --pass-with-no-tests` | Exit 0 even if no tests found |
| `npx playwright test --forbid-only` | `npx playwright test --forbid-only` | Fail if test.only is present |
| `npx playwright test --fully-parallel` | `npx playwright test --fully-parallel` | Run all tests in parallel |
| `npx playwright test --output` | `npx playwright test --output results/` | Set output directory |
| `npx playwright test --update-snapshots` | `npx playwright test --update-snapshots` | Update visual comparison baselines |

## Recording Tests

| Command | Example | Description |
|---------|---------|-------------|
| `npx playwright codegen` | `npx playwright codegen https://example.com` | Record browser actions as test code |
| `codegen --browser` | `npx playwright codegen --browser firefox` | Record using specific browser |
| `codegen --device` | `npx playwright codegen --device "iPhone 13"` | Emulate a mobile device |
| `codegen --viewport-size` | `npx playwright codegen --viewport-size "800,600"` | Set custom viewport |
| `codegen --color-scheme` | `npx playwright codegen --color-scheme dark` | Set dark/light mode |
| `codegen --save-storage` | `npx playwright codegen --save-storage auth.json` | Save auth state after session |
| `codegen --load-storage` | `npx playwright codegen --load-storage auth.json` | Load saved auth state |

## Reporting

| Command | Example | Description |
|---------|---------|-------------|
| `--reporter list` | `npx playwright test --reporter list` | Detailed step-by-step output |
| `--reporter dot` | `npx playwright test --reporter dot` | Minimal dot output |
| `--reporter line` | `npx playwright test --reporter line` | One line per test update |
| `--reporter html` | `npx playwright test --reporter html` | Generate interactive HTML report |
| `--reporter json` | `npx playwright test --reporter json` | Output results as JSON |
| `--reporter junit` | `npx playwright test --reporter junit` | JUnit XML format for CI |
| `show-report` | `npx playwright show-report` | Open last HTML report in browser |

## Debugging

| Command | Example | Description |
|---------|---------|-------------|
| `--debug` | `npx playwright test --debug` | Run with Playwright Inspector |
| `--ui` | `npx playwright test --ui` | Open interactive UI mode |
| `PWDEBUG=1` | `PWDEBUG=1 npx playwright test` | Force Inspector for all tests |
| `PWDEBUG=console` | `PWDEBUG=console npx playwright test` | Enable playwright.$ in DevTools |
| `DEBUG=pw:api` | `DEBUG=pw:api npx playwright test` | Verbose Playwright API logs |
| `show-trace` | `npx playwright show-trace trace.zip` | Open Trace Viewer for a trace file |

## Browser Management

| Command | Example | Description |
|---------|---------|-------------|
| `install` | `npx playwright install` | Install all browsers |
| `install <browser>` | `npx playwright install chromium` | Install a specific browser |
| `install --with-deps` | `npx playwright install --with-deps` | Install browsers + OS dependencies |
| `install --dry-run` | `npx playwright install --dry-run` | Show what would be installed |
| `uninstall` | `npx playwright uninstall` | Remove installed browsers |
| `uninstall --all` | `npx playwright uninstall --all` | Remove all Playwright browsers |

## Project Initialization

| Command | Example | Description |
|---------|---------|-------------|
| `init` | `npm init playwright@latest` | Create a new Playwright project |
| `--help` | `npx playwright --help` | Show all available commands |
| `--version` | `npx playwright --version` | Show installed Playwright version |
