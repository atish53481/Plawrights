# CI/CD Pipeline - Quick Notes

## GitHub Actions Template (Copy-Paste Ready)

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test --shard ${{ matrix.shard }} --retries 2
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ strategy.job-index }}
          path: test-results/
          retention-days: 7

      - name: Upload HTML report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ strategy.job-index }}
          path: playwright-report/
          retention-days: 14
```

---

## Common CI Gotchas & Solutions

| Problem | Cause | Solution |
|---------|-------|----------|
| Tests pass locally, fail in CI | Missing OS deps | Use `--with-deps` flag |
| Timeout errors in CI | Slower CI machines | Increase timeout: `--timeout 60000` |
| Flaky tests | Race conditions | Add `retries: 2` in CI config |
| `test.only` left in code | Dev oversight | Add `--forbid-only` in CI |
| Browser not found | Not installed | Run `npx playwright install` in CI |
| Screenshots differ | Font rendering | Use Docker image for consistency |
| Out of memory | Too many workers | Reduce `--workers 2` in CI |
| Tests run twice | Duplicate config projects | Check project dependencies |
| Trace files too large | `trace: 'on'` | Use `trace: 'on-first-retry'` |
| Slow browser install | No cache | Cache `~/.cache/ms-playwright` |

---

## Docker Setup

```dockerfile
# Use official Playwright Docker image
FROM mcr.microsoft.com/playwright:v1.50.0-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Run tests
CMD ["npx", "playwright", "test"]
```

Run locally:
```bash
docker build -t pw-tests .
docker run --rm pw-tests
docker run --rm pw-tests npx playwright test --project chromium
```

---

## Artifact Upload Patterns

```yaml
# Upload everything on failure
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: test-failures
    path: |
      test-results/
      playwright-report/

# Upload traces only
- uses: actions/upload-artifact@v4
  if: always()
  with:
    name: traces
    path: test-results/**/trace.zip

# Upload screenshots only
- uses: actions/upload-artifact@v4
  if: failure()
  with:
    name: screenshots
    path: test-results/**/*.png
```

---

## Sharding Matrix Example

For large test suites, split across multiple machines:

```yaml
strategy:
  fail-fast: false
  matrix:
    shard: [1/4, 2/4, 3/4, 4/4]

# Access in step:
run: npx playwright test --shard ${{ matrix.shard }}
```

Multi-browser matrix:
```yaml
strategy:
  fail-fast: false
  matrix:
    browser: [chromium, firefox, webkit]
    shard: [1/2, 2/2]

steps:
  - run: npx playwright test --project ${{ matrix.browser }} --shard ${{ matrix.shard }}
```

---

## Browser Caching in CI

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-${{ runner.os }}-${{ hashFiles('package-lock.json') }}

- name: Install Playwright (uses cache if available)
  run: npx playwright install --with-deps
```

---

## CI Config Best Practices

```javascript
// playwright.ci.config.js
module.exports = defineConfig({
  forbidOnly: true,           // Fail on test.only
  retries: 2,                 // Retry flaky tests
  workers: '50%',             // Don't overwhelm CI
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'results.xml' }],
  ],
  use: {
    trace: 'on-first-retry',  // Traces only on retry
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});
```
