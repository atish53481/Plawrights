# CI/CD Integration - Interview Questions & Answers

---

**Q1: How do you set up Playwright tests in GitHub Actions?**

A1: Create a workflow YAML file in `.github/workflows/` that checks out the code, sets up Node.js, installs npm dependencies with `npm ci`, installs Playwright browsers with `npx playwright install --with-deps`, and runs tests with `npx playwright test`. The `--with-deps` flag is critical because it also installs OS-level dependencies (like font libraries and media codecs) that browsers need on the CI runner. Use `actions/upload-artifact` to save reports and traces.

---

**Q2: What does setting `CI=true` do in Playwright?**

A2: When `CI=true` is set (which most CI platforms do automatically), Playwright changes several default behaviors. The default reporter switches from `list` to `dot` for more compact output. The HTML report will not auto-open in a browser after the test run. Playwright also changes the default for `webServer.reuseExistingServer` to `false`, ensuring a fresh server is started for each run. These changes optimize Playwright for non-interactive CI environments.

---

**Q3: Why is `--with-deps` important when installing browsers in CI?**

A3: The `--with-deps` flag installs not only the browser binaries but also the operating system dependencies they require, such as font packages, graphics libraries, and media codecs. Without these, browsers may crash or render pages incorrectly on fresh CI runners that lack these system libraries. This is especially important on Ubuntu-based runners. On your local machine these dependencies are typically already installed.

---

**Q4: How do you implement test sharding in CI for faster execution?**

A4: Use a GitHub Actions matrix strategy with the `--shard` flag. Define a matrix variable like `shard: [1/4, 2/4, 3/4, 4/4]` and run `npx playwright test --shard ${{ matrix.shard }}` in each job. This creates 4 parallel CI jobs, each running one quarter of the test suite. Playwright splits tests automatically and ensures no overlap. Combine sharded results by uploading artifacts from each job and merging them in a subsequent job.

---

**Q5: How do you upload test artifacts in GitHub Actions?**

A5: Use the `actions/upload-artifact@v4` action with the `if: always()` condition so artifacts are saved even when tests fail. Upload the `test-results/` directory to capture screenshots, videos, and traces, and the `playwright-report/` directory for the HTML report. Set a `retention-days` value to automatically clean up old artifacts. Use unique artifact names per shard when running parallel jobs to avoid name conflicts.

---

**Q6: What is the official Playwright Docker image and when should you use it?**

A6: Microsoft publishes official Docker images at `mcr.microsoft.com/playwright:v<version>-noble` with all browsers and OS dependencies pre-installed. Use these images when you need consistent rendering across environments (especially for visual snapshot tests), when you want faster CI runs by avoiding browser installation, or when running tests in containerized environments like Kubernetes. The image tag should match your installed Playwright version.

---

**Q7: What retry strategy should you use in CI?**

A7: Set `retries: 2` in your CI config as a standard practice. This allows flaky tests to pass on retry while still catching real failures. Tests that pass on retry are reported as "flaky" so you can track and fix them later. Avoid setting retries too high (like 5+) as this masks real bugs and slows down the pipeline. Use `trace: 'on-first-retry'` to capture trace data only for retried tests, providing debugging info without the overhead of tracing every test.

---

**Q8: How do you run multi-browser testing in CI using a matrix strategy?**

A8: Define browser projects in your config file (chromium, firefox, webkit) and use a GitHub Actions matrix to run each browser in a separate CI job: `matrix: { browser: [chromium, firefox, webkit] }` with `npx playwright test --project ${{ matrix.browser }}`. This runs all three browsers in parallel. You can combine this with sharding for even more parallelism: `matrix: { browser: [chromium, firefox], shard: [1/2, 2/2] }` creates 4 parallel jobs.

---

**Q9: How does parallel execution work in CI and what are the considerations?**

A9: Playwright runs tests in parallel using worker processes. In CI, set `workers` to a reasonable number based on the runner's CPU cores -- using `'50%'` is a safe default. Too many workers on a resource-constrained CI runner causes memory pressure and slower execution. Set `fullyParallel: true` for maximum parallelism. Ensure tests are isolated and do not share state, as parallel execution means tests may run in any order.

---

**Q10: How do you generate and access test reports in CI?**

A10: Configure multiple reporters in your CI config: `['list']` for console output during the run, `['html', { open: 'never' }]` for an interactive HTML report, and `['junit', { outputFile: 'results.xml' }]` for CI tool integration. Upload the `playwright-report/` directory as an artifact. To view the HTML report, download the artifact and run `npx playwright show-report` locally, or publish it to GitHub Pages or a static hosting service.

---

**Q11: How should you handle flaky tests in a CI pipeline?**

A11: First, use retries to prevent flaky tests from blocking deployments. Second, track flaky tests by monitoring which tests pass only on retry -- most CI tools and the Playwright HTML report highlight these. Third, fix flaky tests systematically by reviewing their traces and adding proper waits or more robust locators. Fourth, consider quarantining persistently flaky tests with a `@flaky` tag and running them separately from the main pipeline so they do not block releases.

---

**Q12: Why is test isolation important in CI and how do you achieve it?**

A12: Test isolation ensures each test runs independently without relying on the outcome or side effects of other tests. Playwright achieves this by default by giving each test a fresh browser context. In CI, avoid shared databases or global state. Use `globalSetup` to prepare a clean test environment and `globalTeardown` to clean up. Each test should set up its own data rather than relying on data created by previous tests, as parallel execution makes ordering unpredictable.

---

**Q13: Why do Playwright tests typically run headless in CI?**

A13: CI environments usually lack a display server (no physical or virtual monitor). Headless mode runs the browser without rendering to a screen, which is faster and requires fewer resources. Playwright defaults to headless mode, and setting `CI=true` reinforces this. If you do need headed mode in CI (rare), you can use `xvfb-run` on Linux to create a virtual display: `xvfb-run npx playwright test --headed`. Most debugging needs are better served by traces.

---

**Q14: How do you cache Playwright browsers in CI for faster runs?**

A14: Use the `actions/cache@v4` action to cache the `~/.cache/ms-playwright` directory with a cache key based on `package-lock.json` (since the Playwright version determines which browsers are needed). On cache hit, `npx playwright install` detects existing browsers and skips downloading. This can save 1-3 minutes per CI run. Always include `--with-deps` even with caching, as OS dependencies are not included in the cache.

---

**Q15: How do you manage environment variables for Playwright tests in CI?**

A15: Define non-sensitive variables directly in the workflow YAML under the `env` key at the job or step level. For sensitive values like API keys and passwords, use GitHub Secrets: `${{ secrets.API_KEY }}`. Access them in tests via `process.env.API_KEY`. You can also use a `.env` file loaded with the `dotenv` package, but never commit it to the repository. Use different environment variables per deployment target (staging vs production).

---

**Q16: How do you handle secrets management for Playwright tests in CI?**

A16: Store sensitive values (API keys, passwords, tokens) in GitHub Actions secrets, never in code or config files. Reference them in YAML with `${{ secrets.SECRET_NAME }}` and pass them as environment variables to the test step. For local development, use a `.env` file (added to `.gitignore`). In the config, access secrets via `process.env` and provide fallback values for local runs. Never log secrets in test output or include them in screenshots/traces that are uploaded as artifacts.

---

**Q17: How do you set up Playwright tests as PR checks?**

A17: Configure a GitHub Actions workflow triggered on `pull_request` events targeting the main branch. The workflow runs the full test suite and its exit code determines the PR check status. In repository settings, mark this workflow as a required status check so PRs cannot be merged unless all tests pass. Add comments to the PR with a link to the test report artifact. Use `--forbid-only` to prevent accidental `test.only` from bypassing the full suite.

---

**Q18: What are deployment gates and how does Playwright fit in?**

A18: Deployment gates are automated checks that must pass before code is deployed to production. Playwright tests serve as a deployment gate by running against a staging environment after deployment and before promoting to production. If tests fail, the deployment is rolled back automatically. This is implemented by running Playwright with `baseURL` pointing to the staging environment in a post-deployment CI step, with the deployment pipeline waiting for the test job to succeed.

---

**Q19: How do you monitor test trends and track test health over time?**

A19: Generate JUnit XML reports in CI and integrate them with tools like Allure, ReportPortal, or CI platform analytics (GitHub Actions does not natively support this). Track metrics such as test pass rate, average execution time, flaky test count, and failure frequency. Use JSON reporter output to build custom dashboards. Regularly review the flaky test list and dedicate time to fixing them. Set up alerts when the overall pass rate drops below a threshold.

---

**Q20: How do you optimize CI costs when running Playwright tests?**

A20: First, use sharding to parallelize across multiple smaller runners instead of one large runner. Second, cache browser installations to avoid repeated downloads. Third, use `trace: 'on-first-retry'` instead of `'on'` to reduce artifact storage. Fourth, run only affected tests on PRs using `--grep` with changed feature tags, and run the full suite nightly. Fifth, use the Playwright Docker image to skip browser installation time. Sixth, limit video recording to failures only with `video: 'retain-on-failure'`.
