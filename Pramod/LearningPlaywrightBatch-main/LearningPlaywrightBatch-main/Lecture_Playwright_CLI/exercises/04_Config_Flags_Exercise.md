# Exercise 4: Config File vs CLI Flags

## Objective
Understand the relationship between `playwright.config.js` settings and CLI flags, learn when each takes precedence, and create a CI-specific configuration.

---

## Prerequisites
- An existing `playwright.config.js` in your project
- Multiple test files across different features

---

## Tasks

### Task 1: Create a CI Config
Create `playwright.ci.config.js` with CI-optimized settings:
```javascript
// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: true,
  retries: 2,
  workers: 4,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
});
```

### Task 2: Run with Custom Config
```bash
npx playwright test --config playwright.ci.config.js
```
- Verify retries are set to 2 (intentionally fail a test to confirm)
- Verify all three browsers run
- Check that HTML report is generated but not auto-opened

### Task 3: CLI Overrides Config
```bash
npx playwright test --config playwright.ci.config.js --timeout 10000
```
Your CI config has no explicit timeout (defaults to 30000). The CLI sets 10000.
- Which value wins? Verify by adding a `console.log` with timing
- Try: `--workers 1` when config says `workers: 4` -- which wins?
- Try: `--retries 0` when config says `retries: 2` -- which wins?

**Rule**: CLI flags always override config file values.

### Task 4: Config-Only Options (No CLI Equivalent)
Identify and document 5 options that can ONLY be set in the config file:

| Config Option | Purpose | Example Value |
|--------------|---------|---------------|
| 1. | | |
| 2. | | |
| 3. | | |
| 4. | | |
| 5. | | |

Hints: `fullyParallel`, `forbidOnly`, `use.baseURL`, `use.storageState`, `webServer`, `expect.timeout`, `testMatch`, `globalSetup`, `globalTeardown`, `snapshotPathTemplate`

### Task 5: CLI-Only Options (No Config Equivalent)
Identify and document 5 options that can ONLY be passed via CLI:

| CLI Flag | Purpose | Example |
|----------|---------|---------|
| 1. | | |
| 2. | | |
| 3. | | |
| 4. | | |
| 5. | | |

Hints: `--debug`, `--ui`, `--pass-with-no-tests`, `--shard`, `--list`, `--last-failed`, `--update-snapshots`, `--headed` (partially)

### Task 6: Multi-Browser Projects
Run tests for a single project:
```bash
npx playwright test --project chromium
npx playwright test --project firefox
npx playwright test --project "chromium" --project "firefox"
```
- How do you run only chromium and firefox but skip webkit?
- What happens if you specify a project name that doesn't exist?
- Can you define project-specific timeouts?

---

## Deliverable
1. `playwright.ci.config.js` -- complete and working
2. Comparison table showing config vs CLI precedence for 5 settings
3. Lists of config-only and CLI-only options (5 each)
4. Output showing `--project` filtering in action

---

## Bonus: Multiple Config Strategy
Create three config files for different environments:
```
playwright.config.js        # Default/local development
playwright.ci.config.js     # CI pipeline
playwright.staging.config.js # Staging environment tests
```
Document when and why you would use each.
