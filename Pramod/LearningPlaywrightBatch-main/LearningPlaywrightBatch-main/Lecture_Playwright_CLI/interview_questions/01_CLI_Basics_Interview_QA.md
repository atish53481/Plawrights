# CLI Basics - Interview Questions & Answers

---

**Q1: How do you run a specific test file using the Playwright CLI?**

A1: You pass the file path as an argument to `npx playwright test`, for example `npx playwright test tests/login.spec.js`. You can also pass multiple files separated by spaces. Playwright will only execute tests within the specified file(s) while respecting the config for browser projects, retries, and other settings.

---

**Q2: What is the difference between `--grep` and `--grep-invert`?**

A2: `--grep` filters tests to only run those whose title matches the provided regex pattern, such as `--grep "login"` to run only login-related tests. `--grep-invert` does the opposite -- it excludes tests matching the pattern and runs everything else. You can combine both flags to include one pattern while excluding another, for example `--grep "@smoke" --grep-invert "@skip"`.

---

**Q3: How do you run Playwright tests in headed mode?**

A3: Use the `--headed` flag: `npx playwright test --headed`. This launches a visible browser window so you can watch the test execute in real time. It is useful for debugging and understanding test flow, but should be avoided in CI where there is typically no display server available. You can also set `headless: false` in the config file.

---

**Q4: What does the `--workers` flag control and what is the default?**

A4: The `--workers` flag sets the number of parallel worker processes that run tests simultaneously. The default is 50% of the available CPU cores on the machine. Setting `--workers 1` runs tests sequentially, which is useful for debugging order-dependent issues. In CI, you might limit workers to avoid overwhelming shared runners.

---

**Q5: How does `--retries` work in Playwright?**

A5: The `--retries` flag specifies how many times a failed test should be retried before being marked as failed. For example, `--retries 2` means a failing test gets up to 2 additional attempts. If it passes on any retry, it is reported as "flaky" rather than "failed." This is commonly set to 1-2 in CI pipelines to handle transient failures without masking real bugs.

---

**Q6: What is the purpose of `--repeat-each` and when would you use it?**

A6: `--repeat-each N` runs every test N times in a row. This is primarily used to detect flaky tests -- if a test passes once but fails on subsequent runs, it indicates a reliability issue. For example, `--repeat-each 5` runs each test 5 times. This is a debugging and validation tool, not something you would use in regular CI runs due to the multiplied execution time.

---

**Q7: How does test sharding work with `--shard`?**

A7: The `--shard` flag splits the test suite into equal parts for parallel execution across multiple machines. The syntax is `--shard X/Y` where X is the current shard number and Y is the total number of shards. For example, with `--shard 1/3` and `--shard 2/3` and `--shard 3/3`, each machine runs roughly one-third of the tests. Shards do not overlap, ensuring every test runs exactly once across all shards.

---

**Q8: What reporters are available in Playwright and how do you select one?**

A8: Playwright includes several built-in reporters: `list` (detailed step-by-step), `dot` (minimal dots), `line` (single updating line), `html` (interactive HTML report), `json` (machine-readable JSON), and `junit` (XML for CI tools). You select one with `--reporter list` on the CLI. Multiple reporters can be configured simultaneously in the config file, for example outputting both `list` to the console and `html` to a file.

---

**Q9: What does `--timeout` set and how does it interact with code-level timeouts?**

A9: `--timeout` sets the maximum time in milliseconds that each individual test can run before being terminated. The default is 30000ms (30 seconds). CLI timeout overrides the config file timeout. However, `test.setTimeout()` called within test code overrides the CLI flag for that specific test. There is also `--global-timeout` which sets a maximum for the entire test run.

---

**Q10: How do you run tests for a specific browser project?**

A10: Use the `--project` flag followed by the project name defined in your config, for example `npx playwright test --project chromium`. You can specify multiple projects: `--project chromium --project firefox`. If you specify a project name that does not exist in the config, Playwright will report an error. This is useful for running quick local checks on a single browser before pushing.

---

**Q11: What is the `--output` flag used for?**

A11: The `--output` flag sets the directory where test artifacts are stored, such as screenshots, videos, traces, and downloaded files. The default directory is `test-results/`. Changing it with `--output ./my-results` is useful when you need to organize artifacts differently, for example separating results by shard or environment in CI pipelines.

---

**Q12: How do you use multiple config files in a Playwright project?**

A12: You create separate config files like `playwright.config.js` for local development and `playwright.ci.config.js` for CI, then select one at runtime with `--config playwright.ci.config.js`. This allows different settings per environment: for example, local config might have `retries: 0` and `headed: true`, while CI config has `retries: 2`, `forbidOnly: true`, and multiple browser projects. The CI config can import and extend the base config to avoid duplication.

---

**Q13: What information does `npx playwright --help` provide?**

A13: Running `npx playwright --help` displays all available Playwright CLI commands such as `test`, `codegen`, `install`, `show-report`, and `show-trace`. For detailed flags on a specific command, you run `npx playwright test --help` which lists every available flag with a brief description. This is the fastest way to look up flag names and syntax without leaving the terminal.

---

**Q14: What exit codes does Playwright return and why do they matter?**

A14: Playwright returns exit code 0 when all tests pass and exit code 1 when any test fails or an error occurs. This is critical for CI pipelines where the exit code determines whether the build is marked as successful or failed. The `--pass-with-no-tests` flag changes behavior so that exit code 0 is returned even when no tests are found, which can be useful in certain shard configurations.

---

**Q15: How do you filter tests by tag in Playwright?**

A15: Playwright uses `--grep` for tag-based filtering. By convention, tags are added to test titles using the `@` prefix, for example `test('login @smoke', ...)`. You then run `npx playwright test --grep "@smoke"` to execute only smoke tests. Multiple tags can be combined with regex: `--grep "@smoke|@critical"`. Tags can also be excluded with `--grep-invert "@slow"`.

---

**Q16: How does Playwright handle parallel test execution by default?**

A16: By default, Playwright runs test files in parallel (each file gets its own worker) but tests within a single file run sequentially. The `fullyParallel: true` config option or `--fully-parallel` CLI flag changes this so that individual tests within files can also run in parallel. The number of parallel workers defaults to 50% of CPU cores and can be controlled with `--workers`.

---

**Q17: Can you control the order in which tests run?**

A17: Playwright does not guarantee test execution order by default since tests run in parallel across workers. Within a single file, tests run in the order they are defined. You can use `test.describe.serial()` to enforce sequential execution within a describe block, where later tests are skipped if an earlier test fails. For cross-file ordering, project dependencies in the config allow you to run one project before another.

---

**Q18: What is the default reporter and how does it change in CI?**

A18: The default reporter is `list` for local development, which shows each test with a step-by-step pass/fail status. When the `CI` environment variable is set (automatically true in most CI systems), Playwright switches to the `dot` reporter by default for more compact output. You can always override this with `--reporter` on the CLI or the `reporter` config option regardless of environment.

---

**Q19: How do you pass environment variables to Playwright tests?**

A19: Environment variables can be passed inline on the command line: `MY_VAR=value npx playwright test`. They are accessible in test code via `process.env.MY_VAR`. You can also use `.env` files with the `dotenv` package, or set them in your config file. In CI, environment variables are typically set in the workflow YAML. Common Playwright-specific variables include `CI`, `PWDEBUG`, and `PLAYWRIGHT_BROWSERS_PATH`.

---

**Q20: How do you run Playwright tests from a different directory?**

A20: You can either change to the project directory with `cd /path/to/project && npx playwright test`, or use the `--config` flag to point to a config file in another directory: `npx playwright test --config /path/to/project/playwright.config.js`. The `testDir` in the config file is resolved relative to the config file's location, so all test paths are determined from there regardless of your current working directory.
