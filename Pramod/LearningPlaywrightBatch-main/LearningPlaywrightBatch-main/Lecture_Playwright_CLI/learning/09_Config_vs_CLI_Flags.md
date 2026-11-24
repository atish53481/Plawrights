# Config File vs CLI Flags

## Precedence Rule

**CLI flags always override config file settings.**

If `playwright.config.js` sets `workers: 4` and you run `npx playwright test --workers 1`, the test uses 1 worker. The config file provides defaults; the CLI provides overrides.

```
CLI flags  >  Config file  >  Playwright defaults
```

---

## Using a Custom Config File

```bash
# Default: uses playwright.config.js or playwright.config.ts
npx playwright test

# Use a custom config file
npx playwright test --config staging.config.js
npx playwright test --config configs/ci.config.ts
```

---

## Mapping Table: Config Option to CLI Equivalent

| Config Option | CLI Equivalent | Example |
|--------------|----------------|---------|
| `workers` | `--workers` | `--workers 4` |
| `retries` | `--retries` | `--retries 2` |
| `timeout` | `--timeout` | `--timeout 30000` |
| `globalTimeout` | `--global-timeout` | `--global-timeout 600000` |
| `reporter` | `--reporter` | `--reporter html` |
| `outputDir` | `--output` | `--output results/` |
| `grep` | `--grep` | `--grep "Login"` |
| `grepInvert` | `--grep-invert` | `--grep-invert "SKIP"` |
| `shard` | `--shard` | `--shard 1/3` |
| `forbidOnly` | `--forbid-only` | `--forbid-only` |
| `fullyParallel` | `--fully-parallel` | `--fully-parallel` |
| `maxFailures` | `--max-failures` | `--max-failures 5` |
| `repeatEach` | `--repeat-each` | `--repeat-each 3` |
| `updateSnapshots` | `--update-snapshots` | `--update-snapshots` |
| `use.trace` | `--trace` | `--trace on` |
| `use.headless: false` | `--headed` | `--headed` |
| `projects[n].name` | `--project` | `--project chromium` |

---

## Config-Only Options (No CLI Equivalent)

These options can only be set in `playwright.config.js`:

| Config Option | Purpose | Example |
|--------------|---------|---------|
| `use.baseURL` | Base URL for `page.goto('/')` | `'https://staging.example.com'` |
| `use.storageState` | Pre-saved auth cookies/tokens | `'auth.json'` |
| `use.viewport` | Browser viewport size | `{ width: 1280, height: 720 }` |
| `use.locale` | Browser locale | `'en-US'` |
| `use.timezoneId` | Timezone emulation | `'America/New_York'` |
| `use.geolocation` | GPS coordinates emulation | `{ latitude: 40.7, longitude: -74.0 }` |
| `use.permissions` | Browser permissions | `['geolocation']` |
| `use.httpCredentials` | HTTP basic auth | `{ username: 'user', password: 'pass' }` |
| `use.video` | Video recording | `'on'`, `'retain-on-failure'` |
| `use.screenshot` | Automatic screenshots | `'on'`, `'only-on-failure'` |
| `use.launchOptions` | Browser launch args | `{ slowMo: 500 }` |
| `use.extraHTTPHeaders` | Custom request headers | `{ 'X-Custom': 'value' }` |
| `testDir` | Directory to scan for tests | `'./tests'` |
| `testMatch` | File pattern for test files | `'**/*.spec.js'` |
| `testIgnore` | Files to exclude | `'**/helpers/**'` |
| `webServer` | Start a dev server before tests | `{ command: 'npm start', port: 3000 }` |
| `projects` | Multi-browser/device configuration | Array of project objects |
| `globalSetup` | Script to run once before all tests | `'./global-setup.js'` |
| `globalTeardown` | Script to run once after all tests | `'./global-teardown.js'` |
| `expect` | Assertion configuration | `{ timeout: 10000 }` |

---

## CLI-Only Options (No Config Equivalent)

| CLI Flag | Purpose |
|----------|---------|
| `--ui` | Launch interactive UI mode |
| `--debug` | Launch Playwright Inspector |
| `--list` | List tests without running them |
| `--last-failed` | Re-run only previously failed tests |
| `--pass-with-no-tests` | Exit 0 if no tests found |
| `--quiet` | Suppress reporter output |
| `--config` | Specify a config file path |
| `show-report` | Open the HTML report |
| `show-trace` | Open the Trace Viewer |
| `codegen` | Record test code |
| `install` | Download browser binaries |

---

## Practical Guide: What to Put Where

| Setting | Where to Put It | Why |
|---------|-----------------|-----|
| `baseURL` | Config | Shared across all tests, varies by environment |
| `workers` | Config (CI override via CLI) | Default for local, override in CI |
| `retries` | Config | Consistent retry policy |
| `reporter` | Config | Multiple reporters need config syntax |
| `trace` | Config | `'on-first-retry'` is a good default |
| `timeout` | Config | Consistent across runs |
| `--headed` | CLI only | Temporary for debugging |
| `--debug` | CLI only | One-off debugging |
| `--grep` | CLI only | Ad-hoc test filtering |
| `--project` | CLI only | Running a subset of browsers |
| `--shard` | CLI only | CI parallelism |

---

## Environment-Specific Configs

### Option A: Multiple config files

```bash
npx playwright test --config playwright.staging.config.js
npx playwright test --config playwright.production.config.js
```

### Option B: Environment variables in a single config

```javascript
// playwright.config.js
export default {
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: process.env.CI ? [['html'], ['junit', { outputFile: 'results.xml' }]] : 'list',
};
```

```bash
# Local
npx playwright test

# CI / staging
BASE_URL=https://staging.example.com CI=true npx playwright test
```

---

## Common Patterns

### Local development config

```javascript
export default {
  retries: 0,
  workers: undefined,          // Auto-detect
  use: {
    trace: 'retain-on-failure',
    baseURL: 'http://localhost:3000',
  },
  reporter: 'list',
};
```

### CI config overrides via CLI

```bash
npx playwright test \
  --retries 2 \
  --workers 4 \
  --reporter html \
  --forbid-only \
  --shard 1/3
```

---

## Next Steps

Continue to [10_CI_CD_Integration.md](./10_CI_CD_Integration.md) to see complete CI/CD pipeline configurations.
