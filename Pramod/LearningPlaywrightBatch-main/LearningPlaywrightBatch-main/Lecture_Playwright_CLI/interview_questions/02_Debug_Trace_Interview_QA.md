# Debugging & Tracing - Interview Questions & Answers

---

**Q1: What is the Playwright Inspector and how do you launch it?**

A1: The Playwright Inspector is a GUI debugging tool that lets you step through test execution one action at a time. You launch it by running `npx playwright test --debug` or by setting the environment variable `PWDEBUG=1`. It opens two windows: the browser where the test runs and the Inspector panel showing the test code, current execution step, and locator suggestions. You can step over, resume, or pick locators from the Inspector toolbar.

---

**Q2: What does the `--debug` flag do when running Playwright tests?**

A2: The `--debug` flag starts tests with the Playwright Inspector attached and sets the browser to headed mode automatically. It also sets the test timeout to 0 (no timeout) so the test does not fail while you are stepping through it. Workers are set to 1 so only one test runs at a time. This makes it ideal for interactively debugging a single test by pausing and inspecting each action.

---

**Q3: What is the difference between `PWDEBUG=1` and the `--debug` flag?**

A3: Both open the Playwright Inspector, but they are used in slightly different contexts. The `--debug` flag is a CLI argument that combines Inspector mode with headed browser and no timeout. `PWDEBUG=1` is an environment variable that achieves the same effect but can be set system-wide or in your shell profile. `PWDEBUG=console` is a variant that instead of opening the Inspector, exposes a `playwright` object in the browser DevTools console for manual interaction.

---

**Q4: What happens when you add `await page.pause()` to a test?**

A4: When execution reaches `await page.pause()`, the test pauses and the Playwright Inspector opens, even if you did not use `--debug`. The browser window stays visible with the page in its current state. You can then use the Inspector to step through remaining actions, pick locators, or run commands manually. This is useful for pausing at a specific point rather than stepping from the beginning.

---

**Q5: How does the "Pick Locator" feature work in the Inspector?**

A5: When you click the crosshair "Pick Locator" button in the Inspector toolbar, you can hover over any element on the page and Playwright will suggest the best locator for it. Playwright prioritizes accessible locators like `getByRole`, `getByText`, and `getByLabel` over CSS selectors. Clicking on an element copies the suggested locator. This helps you write robust selectors without manually inspecting the DOM.

---

**Q6: What is a Playwright trace and what does it contain?**

A6: A trace is a ZIP archive that captures a complete recording of a test execution. It contains DOM snapshots before and after each action, screenshots, network requests and responses, console logs, the test source code, and action timing information. Traces provide a time-travel debugging experience where you can inspect the page state at any point during the test without re-running it.

---

**Q7: What are the contents of a trace ZIP file?**

A7: A trace ZIP file contains several internal files: a `trace.trace` file with the action log and metadata, `trace.network` with captured network requests/responses, screenshot PNG files for each action step, DOM snapshots serialized as JSON, and the original test source code. The Trace Viewer parses all of these to reconstruct the full test execution timeline. Trace files are typically 1-10 MB depending on the test complexity.

---

**Q8: How do you open a trace file with the `show-trace` command?**

A8: Run `npx playwright show-trace path/to/trace.zip` to open the Trace Viewer in your default browser. The Trace Viewer displays a timeline of all actions, DOM snapshots, network requests, console output, and source code. You can click on any action in the timeline to see the page state before and after that action. The Trace Viewer runs entirely locally as a web application.

---

**Q9: What is trace.playwright.dev and how does it work?**

A9: trace.playwright.dev is a web-hosted version of the Playwright Trace Viewer. You can drag and drop a trace ZIP file onto the page to view it. Importantly, the trace file is processed entirely in the browser using client-side JavaScript -- the file is never uploaded to any server. This makes it safe for viewing traces that contain sensitive data, and it works as a convenient alternative to running `show-trace` locally.

---

**Q10: What are the different trace configuration options?**

A10: The `trace` option accepts several values: `'off'` disables tracing entirely, `'on'` records traces for every test, `'retain-on-failure'` records all traces but deletes them for passing tests, and `'on-first-retry'` only records a trace when a test is retried. For CI, `'on-first-retry'` is the recommended setting because it captures traces only for flaky/failing tests, minimizing storage and performance overhead.

---

**Q11: What is the difference between `trace: 'on'`, `'on-first-retry'`, and `'retain-on-failure'`?**

A11: `'on'` records traces for every test run regardless of outcome, consuming the most resources. `'retain-on-failure'` records traces for all tests but automatically deletes trace files for tests that pass, keeping only the failures. `'on-first-retry'` only begins recording when a test is being retried, so passing tests on the first attempt generate no trace at all. For CI, `'on-first-retry'` is most efficient because it only captures data when something goes wrong.

---

**Q12: What features does Playwright UI mode offer?**

A12: UI mode (`npx playwright test --ui`) provides an interactive browser-based interface for running and debugging tests. It shows a test explorer sidebar, lets you run individual tests with a click, displays a timeline view similar to the Trace Viewer, shows DOM snapshots with time-travel capability, and provides watch mode that re-runs tests on file changes. It combines the best of the Inspector and Trace Viewer into a single development tool.

---

**Q13: How does UI mode differ from the HTML report?**

A13: UI mode is a live development tool for running and debugging tests interactively, with watch mode and real-time execution. The HTML report is a static post-execution artifact that summarizes test results, showing pass/fail status, error messages, screenshots, and traces. UI mode is used during development for writing and debugging tests, while the HTML report is used after a test run (especially in CI) to review results and investigate failures.

---

**Q14: What is time-travel debugging in Playwright traces?**

A14: Time-travel debugging refers to the ability to navigate to any point in a completed test execution and inspect the page state at that moment. In the Trace Viewer, you click on any action in the timeline and see the exact DOM snapshot, network state, and console output from that instant. You can move forward and backward through actions, comparing "before" and "after" states. This eliminates the need to re-run failing tests repeatedly to understand what happened.

---

**Q15: What information is available in the DOM snapshot tab of the Trace Viewer?**

A15: The DOM snapshot tab shows the complete page state captured at each action step. It provides two views: "Before" shows the page state just before the action executed, and "After" shows the state immediately after. You can inspect individual elements, see their attributes, computed styles, and text content. This is particularly valuable for debugging selector issues where the DOM might not have been in the expected state when a locator tried to find an element.

---

**Q16: What does the network tab in the Trace Viewer show?**

A16: The network tab displays every HTTP request and response that occurred during the test, including URLs, methods, status codes, headers, request/response bodies, timing, and sizes. You can filter by request type (XHR, fetch, images, etc.) and search for specific URLs. This is essential for debugging API-related test failures, verifying that the correct endpoints were called, and identifying slow network responses that might cause timeouts.

---

**Q17: What information is available in the console tab of the Trace Viewer?**

A17: The console tab captures all browser console output during the test, including `console.log`, `console.error`, `console.warn`, and unhandled JavaScript errors. Each message is timestamped and associated with the action during which it occurred. This helps identify JavaScript errors on the page that might be causing test failures, especially when the error is not directly related to the Playwright action but affects the page state.

---

**Q18: How do you debug flaky tests using Playwright tools?**

A18: First, use `--repeat-each 10` to reproduce the flakiness consistently. Then enable tracing with `trace: 'on'` to capture every run. Compare trace files from passing and failing runs to spot differences in timing, network responses, or DOM state. Use the Trace Viewer's network tab to check for slow or failed API calls. Check the console tab for intermittent JavaScript errors. Finally, look at the DOM snapshots at the failing action to see if the page was in an unexpected state.

---

**Q19: How do you debug timeout errors in Playwright?**

A19: Start by identifying which action timed out from the error message -- it will show the locator that was not found or the navigation that did not complete. Run the test with `--debug` to step through and observe the page state at the timeout point. Check if the element exists but has a different attribute than expected. Use the Trace Viewer network tab to see if a slow API call delayed page rendering. Increase `actionTimeout` for specific slow operations rather than increasing the global timeout.

---

**Q20: How do you debug selector/locator issues in Playwright?**

A20: Use the Inspector's "Pick Locator" feature to see what Playwright suggests for the target element. Compare this with your test's locator. Run `await page.pause()` just before the failing action to inspect the live page. In the Trace Viewer, check the DOM snapshot at the failing step to verify the element exists and has the expected attributes. Use `page.locator('your-selector').count()` in the Inspector console to verify matches. Consider switching to more robust locators like `getByRole` or `getByTestId` if CSS selectors are brittle.
