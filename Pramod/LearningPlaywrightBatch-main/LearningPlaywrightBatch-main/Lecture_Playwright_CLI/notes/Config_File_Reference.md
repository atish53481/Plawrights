# playwright.config.js - Complete Reference

All configuration options for Playwright Test, organized by section.

---

## TestConfig (Top-Level)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `testDir` | `string` | `"."` | Directory to scan for test files |
| `testMatch` | `string \| RegExp \| Array` | `**/*.spec.{js,ts}` | Pattern to match test files |
| `testIgnore` | `string \| RegExp \| Array` | `**/node_modules/**` | Pattern to ignore test files |
| `timeout` | `number` | `30000` | Per-test timeout in milliseconds |
| `globalTimeout` | `number` | `0` | Total timeout for the entire test run |
| `fullyParallel` | `boolean` | `false` | Run all tests in parallel across files |
| `forbidOnly` | `boolean` | `false` | Fail if `test.only` is present (useful in CI) |
| `retries` | `number` | `0` | Number of retries for failed tests |
| `workers` | `number \| string` | `"50%"` | Number of parallel workers |
| `maxFailures` | `number` | `0` | Stop after N failures (0 = unlimited) |
| `reporter` | `string \| Array` | `"list"` | Reporter(s) to use |
| `outputDir` | `string` | `"test-results"` | Directory for test artifacts |
| `globalSetup` | `string` | `undefined` | Path to global setup script |
| `globalTeardown` | `string` | `undefined` | Path to global teardown script |
| `preserveOutput` | `string` | `"always"` | When to keep output: `always`, `never`, `failures-only` |
| `snapshotDir` | `string` | `auto` | Directory for snapshot files |
| `snapshotPathTemplate` | `string` | `auto` | Template for snapshot file paths |
| `updateSnapshots` | `string` | `"missing"` | When to update snapshots: `all`, `none`, `missing` |
| `metadata` | `object` | `{}` | Custom metadata for reports |

---

## Use (Shared Browser Options)

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseURL` | `string` | `undefined` | Base URL for `page.goto()` relative paths |
| `headless` | `boolean` | `true` | Run browsers in headless mode |
| `browserName` | `string` | `"chromium"` | Browser to use: `chromium`, `firefox`, `webkit` |
| `viewport` | `object` | `{width:1280, height:720}` | Browser viewport size |
| `ignoreHTTPSErrors` | `boolean` | `false` | Ignore HTTPS certificate errors |
| `screenshot` | `string` | `"off"` | `off`, `on`, `only-on-failure` |
| `video` | `string` | `"off"` | `off`, `on`, `retain-on-failure`, `on-first-retry` |
| `trace` | `string` | `"off"` | `off`, `on`, `retain-on-failure`, `on-first-retry` |
| `actionTimeout` | `number` | `0` | Timeout for each action (click, fill, etc.) |
| `navigationTimeout` | `number` | `0` | Timeout for navigation actions |
| `locale` | `string` | `system` | Browser locale (e.g., `"en-US"`) |
| `timezoneId` | `string` | `system` | Timezone (e.g., `"America/New_York"`) |
| `geolocation` | `object` | `undefined` | `{latitude, longitude, accuracy}` |
| `permissions` | `string[]` | `[]` | Browser permissions to grant |
| `colorScheme` | `string` | `"light"` | `light`, `dark`, `no-preference` |
| `storageState` | `string \| object` | `undefined` | Path to saved auth/storage state |
| `userAgent` | `string` | `browser default` | Custom user agent string |
| `extraHTTPHeaders` | `object` | `{}` | Extra headers for every request |
| `httpCredentials` | `object` | `undefined` | `{username, password}` for HTTP auth |
| `proxy` | `object` | `undefined` | `{server, bypass, username, password}` |
| `deviceScaleFactor` | `number` | `1` | Device pixel ratio |
| `isMobile` | `boolean` | `false` | Enable mobile emulation |
| `hasTouch` | `boolean` | `false` | Enable touch events |
| `javaScriptEnabled` | `boolean` | `true` | Enable/disable JavaScript |
| `bypassCSP` | `boolean` | `false` | Bypass Content Security Policy |
| `offline` | `boolean` | `false` | Emulate offline mode |
| `launchOptions` | `object` | `{}` | Options passed to `browser.launch()` |
| `contextOptions` | `object` | `{}` | Options passed to `browser.newContext()` |
| `connectOptions` | `object` | `undefined` | Options for connecting to remote browser |

---

## Projects

```javascript
projects: [
  {
    name: 'chromium',           // Project identifier
    use: { browserName: 'chromium' },
    testDir: './tests',         // Override testDir per project
    testMatch: '**/*.spec.js',  // Override testMatch per project
    timeout: 60000,             // Override timeout per project
    retries: 1,                 // Override retries per project
    dependencies: ['setup'],    // Projects that must run first
    teardown: 'cleanup',        // Project to run after this one
    grep: /@chromium/,          // Filter tests by tag
    grepInvert: /@skip/,        // Exclude tests by tag
  },
]
```

---

## Reporter Configuration

```javascript
reporter: [
  ['list'],                                          // Console output
  ['html', { open: 'never', outputFolder: 'report' }], // HTML report
  ['json', { outputFile: 'results.json' }],          // JSON results
  ['junit', { outputFile: 'results.xml' }],          // JUnit XML
  ['dot'],                                           // Minimal dots
  ['line'],                                          // Single line updates
]
```

---

## Expect

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `expect.timeout` | `number` | `5000` | Default assertion timeout |
| `expect.toHaveScreenshot.maxDiffPixels` | `number` | `0` | Allowed pixel difference |
| `expect.toHaveScreenshot.maxDiffPixelRatio` | `number` | `0` | Allowed pixel ratio difference |
| `expect.toHaveScreenshot.threshold` | `number` | `0.2` | Color difference threshold |
| `expect.toHaveScreenshot.animations` | `string` | `"disabled"` | `disabled` or `allow` |
| `expect.toMatchSnapshot.maxDiffPixelRatio` | `number` | `0` | For non-screenshot snapshots |

---

## WebServer

```javascript
webServer: {
  command: 'npm run start',     // Command to start the server
  port: 3000,                   // Port to wait for
  url: 'http://localhost:3000', // Alternative: URL to wait for
  timeout: 120000,              // Startup timeout
  reuseExistingServer: !process.env.CI,  // Reuse if already running
  cwd: './app',                 // Working directory for command
  env: { NODE_ENV: 'test' },   // Environment variables
  stdout: 'pipe',              // How to handle stdout
  stderr: 'pipe',              // How to handle stderr
}
```
