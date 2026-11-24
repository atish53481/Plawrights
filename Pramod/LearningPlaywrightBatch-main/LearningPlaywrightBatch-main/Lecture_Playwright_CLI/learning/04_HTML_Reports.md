# HTML Reports - show-report

## Default HTML Reporter

When you configure the `html` reporter, Playwright generates a complete HTML report after each test run. The report is saved to the `playwright-report/` directory by default.

```javascript
// playwright.config.js
export default {
  reporter: 'html',
};
```

```bash
# Run tests (report is auto-generated)
npx playwright test

# Open the report in your default browser
npx playwright show-report
```

---

## How the HTML Report is Generated

1. Tests run and produce results (pass, fail, skip, flaky).
2. Playwright writes the report to `playwright-report/index.html`.
3. On failure (by default), the report opens automatically.
4. You can always open it manually with `npx playwright show-report`.

---

## Configuring the Report Output Directory

```javascript
// playwright.config.js
export default {
  reporter: [['html', { outputFolder: 'my-custom-report' }]],
};
```

Then open it:

```bash
npx playwright show-report my-custom-report
```

---

## Opening Reports from Different Paths

```bash
# Default path
npx playwright show-report

# Custom path
npx playwright show-report ./reports/sprint-42

# Specify port
npx playwright show-report --port 9323
```

---

## HTML Report Features

| Feature | Description |
|---------|-------------|
| **Summary** | Total passed, failed, flaky, skipped counts |
| **Test list** | Every test grouped by file, searchable and filterable |
| **Failure details** | Error message, stack trace, code snippet |
| **Screenshots** | Attached screenshots on failure (if configured) |
| **Videos** | Embedded video playback (if configured) |
| **Traces** | Clickable trace link that opens in Trace Viewer |
| **Timing** | Duration per test and overall run time |
| **Retry info** | Shows each retry attempt for flaky tests |
| **Tags/annotations** | Displays `@tag` annotations and test descriptions |
| **Filter bar** | Filter by status: passed, failed, flaky, skipped |

---

## Reporter Comparison Table

| Reporter | Output | Best For | CLI Flag |
|----------|--------|----------|----------|
| `html` | Interactive HTML page | Post-run analysis, sharing | `--reporter html` |
| `list` | Line-by-line in terminal | Local development | `--reporter list` |
| `dot` | Dots in terminal | CI (minimal output) | `--reporter dot` |
| `line` | One line per test | Compact terminal output | `--reporter line` |
| `json` | JSON file | Custom tooling, dashboards | `--reporter json` |
| `junit` | XML file | CI systems (Jenkins, etc.) | `--reporter junit` |
| `blob` | Binary blob | Merging sharded results | `--reporter blob` |
| Custom | Varies | Organization-specific needs | Config only |

---

## Multiple Reporters

You can use multiple reporters simultaneously in the config:

```javascript
// playwright.config.js
export default {
  reporter: [
    ['list'],                                    // Terminal output
    ['html', { open: 'never' }],                 // HTML report (don't auto-open)
    ['junit', { outputFile: 'results.xml' }],    // JUnit for CI
  ],
};
```

---

## Controlling Auto-Open Behavior

The `open` option controls when the HTML report opens automatically:

| Value | Behavior |
|-------|----------|
| `'on-failure'` | Open automatically only when tests fail (default) |
| `'always'` | Always open after test run |
| `'never'` | Never auto-open (manual `show-report` only) |

```javascript
reporter: [['html', { open: 'never' }]],
```

In CI, set `open: 'never'` or rely on the `CI` environment variable (Playwright auto-detects CI and disables auto-open).

---

## Attaching Extra Information to Reports

```javascript
test('example', async ({ page }, testInfo) => {
  // Attach a screenshot
  const screenshot = await page.screenshot();
  await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });

  // Attach arbitrary text
  await testInfo.attach('log', { body: 'Custom log data', contentType: 'text/plain' });
});
```

These attachments appear in the HTML report under each test.

---

## CI Artifact Upload (GitHub Actions)

```yaml
- name: Upload HTML Report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
    retention-days: 14
```

---

## Key Takeaways

- The HTML reporter produces a rich, interactive report with filtering, search, screenshots, and traces.
- Use `npx playwright show-report` to open it, optionally passing a custom path or port.
- Combine multiple reporters (e.g., `list` + `html` + `junit`) for both terminal output and persistent reports.
- In CI, upload the `playwright-report/` directory as an artifact.

---

## Next Steps

Continue to [05_UI_Mode.md](./05_UI_Mode.md) to learn about the interactive UI mode test runner.
