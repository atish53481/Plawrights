# CI/CD Integration

## Overview

Running Playwright tests in CI/CD ensures that every code change is validated automatically. This guide covers GitHub Actions, sharding, artifacts, Docker, and other CI platforms.

---

## The CI Environment Variable

When `CI=true` is set (automatically done by most CI providers), Playwright changes its behavior:

| Behavior | With `CI=true` |
|----------|---------------|
| HTML report auto-open | Disabled |
| Browser installation check | Strict (fails if not installed) |
| Screenshot on failure | Follows config (no prompt) |
| Terminal colors | Disabled for cleaner logs |

---

## GitHub Actions - Complete Workflow

```yaml
# .github/workflows/playwright.yml
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

    steps:
      - name: Checkout code
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

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14

      - name: Upload test results (traces)
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: test-results
          path: test-results/
          retention-days: 7
```

---

## Sharding Across Multiple CI Jobs

Split tests across multiple machines for faster execution:

```yaml
# .github/workflows/playwright-sharded.yml
name: Playwright Tests (Sharded)

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    strategy:
      fail-fast: false
      matrix:
        shard: [1/4, 2/4, 3/4, 4/4]

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run tests (shard ${{ matrix.shard }})
        run: npx playwright test --shard ${{ matrix.shard }}

      - name: Upload blob report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: blob-report-${{ strategy.job-index }}
          path: blob-report/
          retention-days: 1

  merge-reports:
    if: ${{ !cancelled() }}
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci

      - name: Download blob reports
        uses: actions/download-artifact@v4
        with:
          path: all-blob-reports
          pattern: blob-report-*
          merge-multiple: true

      - name: Merge reports
        run: npx playwright merge-reports --reporter html ./all-blob-reports

      - name: Upload merged HTML report
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

---

## Multi-Browser Matrix Strategy

```yaml
strategy:
  fail-fast: false
  matrix:
    browser: [chromium, firefox, webkit]

steps:
  # ... setup steps ...
  - name: Run tests on ${{ matrix.browser }}
    run: npx playwright test --project ${{ matrix.browser }}
```

---

## Retry Strategies in CI

```javascript
// playwright.config.js
export default {
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
  },
};
```

| Strategy | Config | When |
|----------|--------|------|
| No retries | `retries: 0` | Local development |
| 1 retry | `retries: 1` | Stable test suites |
| 2 retries | `retries: 2` | Suites with occasional flakiness |
| 3 retries | `retries: 3` | Very flaky (address root cause instead) |

---

## Docker Integration

### Using the Official Playwright Image

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.49.0-noble
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npx playwright test
      # No need for "npx playwright install" -- browsers are pre-installed
```

### Standalone Docker Run

```bash
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  mcr.microsoft.com/playwright:v1.49.0-noble \
  bash -c "npm ci && npx playwright test"
```

### Docker Image Tags

| Tag | Description |
|-----|-------------|
| `v1.49.0-noble` | Ubuntu 24.04, Playwright 1.49.0 |
| `v1.49.0-jammy` | Ubuntu 22.04, Playwright 1.49.0 |

---

## GitLab CI Example

```yaml
# .gitlab-ci.yml
playwright-tests:
  image: mcr.microsoft.com/playwright:v1.49.0-noble
  stage: test
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    expire_in: 7 days
  retry:
    max: 1
    when: script_failure
```

---

## Jenkins Pipeline Example

```groovy
// Jenkinsfile
pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.49.0-noble'
        }
    }
    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Test') {
            steps {
                sh 'npx playwright test --reporter junit --output test-results'
            }
            post {
                always {
                    junit 'test-results/*.xml'
                    archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                }
            }
        }
    }
}
```

---

## CI Best Practices Checklist

| Practice | How |
|----------|-----|
| Install browsers in CI | `npx playwright install --with-deps` |
| Use `--forbid-only` | Prevents `test.only` from reaching CI |
| Enable retries | `retries: process.env.CI ? 2 : 0` |
| Upload reports as artifacts | `actions/upload-artifact@v4` |
| Enable traces for failures | `trace: 'on-first-retry'` |
| Shard for speed | `--shard N/M` with matrix strategy |
| Set global timeout | `--global-timeout 600000` |
| Use Docker for consistency | `mcr.microsoft.com/playwright` image |
| Cache browser downloads | `actions/cache@v4` on `~/.cache/ms-playwright` |
| Pin Playwright version | Lock in `package-lock.json` |

---

## Recommended CI Config

```javascript
// playwright.config.js -- CI-optimized
export default {
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI
    ? [['html', { open: 'never' }], ['blob']]
    : 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
};
```

---

## Summary

- Use `npx playwright install --with-deps` in every CI pipeline.
- Enable `trace: 'on-first-retry'` and `retries: 2` for CI.
- Upload `playwright-report/` and `test-results/` as artifacts.
- Shard tests with `--shard N/M` and merge reports for faster pipelines.
- Use the official Docker image to eliminate browser installation steps.
- Add `--forbid-only` to prevent accidental `test.only` in production runs.
