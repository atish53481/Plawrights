# Codegen - Recording Tests

## What is Codegen?

`npx playwright codegen` opens a browser window and records your interactions (clicks, typing, navigation) to automatically generate Playwright test code. It is the fastest way to scaffold a new test.

```bash
npx playwright codegen https://the-internet.herokuapp.com
```

This opens two windows:
1. **Browser window** -- interact with the site here
2. **Playwright Inspector** -- see the generated code in real time

---

## Codegen CLI Options

| Option | Example | Description |
|--------|---------|-------------|
| URL argument | `codegen https://example.com` | Start recording on this URL |
| `--browser` | `--browser firefox` | Use a specific browser (chromium, firefox, webkit) |
| `--viewport-size` | `--viewport-size 800x600` | Set viewport dimensions |
| `--color-scheme` | `--color-scheme dark` | Emulate dark or light mode |
| `--device` | `--device "iPhone 13"` | Emulate a device (viewport, user agent, touch) |
| `--lang` | `--lang javascript` | Output language (javascript, python, java, csharp) |
| `--save-storage` | `--save-storage auth.json` | Save cookies/localStorage after session |
| `--load-storage` | `--load-storage auth.json` | Load saved auth state before recording |
| `--channel` | `--channel chrome` | Use Chrome or Edge instead of bundled Chromium |
| `--ignore-https-errors` | `--ignore-https-errors` | Ignore SSL certificate errors |
| `--timeout` | `--timeout 60000` | Navigation timeout in ms |

---

## Codegen Toolbar Features

When the Playwright Inspector opens, you will see a toolbar at the top:

| Button | Purpose |
|--------|---------|
| **Record** | Toggle recording on/off |
| **Assert visibility** | Click an element to generate `expect(locator).toBeVisible()` |
| **Assert text** | Click an element to generate `expect(locator).toHaveText()` |
| **Assert value** | Click an input to generate `expect(locator).toHaveValue()` |
| **Pick locator** | Hover over elements to see the recommended locator |

---

## Step-by-Step Walkthrough

### Step 1: Start codegen

```bash
npx playwright codegen https://the-internet.herokuapp.com
```

### Step 2: Interact with the page

- Click "Form Authentication" link
- Type `tomsmith` in the username field
- Type `SuperSecretPassword!` in the password field
- Click the "Login" button

### Step 3: Add assertions

- Click the "Assert text" toolbar button
- Click the success message to assert its content

### Step 4: Copy the generated code

The Inspector window shows code like:

```javascript
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await page.getByRole('link', { name: 'Form Authentication' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');
  await page.getByRole('textbox', { name: 'Password' }).fill('SuperSecretPassword!');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByText('You logged into a secure area')).toBeVisible();
});
```

### Step 5: Save to a file

Copy and paste the code into a `.spec.js` file inside your `tests/` directory.

---

## Device Emulation Examples

```bash
# iPhone 13
npx playwright codegen --device "iPhone 13" https://example.com

# iPad Mini
npx playwright codegen --device "iPad Mini" https://example.com

# Pixel 5
npx playwright codegen --device "Pixel 5" https://example.com
```

---

## Saving and Reusing Auth State

```bash
# Record a login flow and save cookies
npx playwright codegen --save-storage auth.json https://myapp.com

# Use saved auth in a new codegen session (skip login)
npx playwright codegen --load-storage auth.json https://myapp.com/dashboard
```

---

## When Codegen Works Well vs When Manual Coding is Better

| Scenario | Codegen | Manual Coding |
|----------|---------|---------------|
| Simple form fills and clicks | Works great | Overkill |
| Linear navigation flows | Works great | Overkill |
| Dynamic content / waiting logic | May need edits | Better control |
| File uploads / downloads | Limited support | More reliable |
| API mocking / route interception | Not supported | Required |
| Complex assertions (arrays, counts) | Basic only | Full flexibility |
| Page Object Model structure | Generates flat code | Needed for scale |
| Multi-tab / popup scenarios | Limited | Full control |

**Best practice:** Use codegen to get the locators and basic flow, then refactor the generated code into your test structure.

---

## Limitations

- Codegen generates flat, sequential code -- no Page Object Model or helpers.
- It cannot record API calls, mocks, or route handlers.
- Hover-based menus may be tricky to record.
- Generated locators are good but may need refinement for stability.

---

## Next Steps

Continue to [04_HTML_Reports.md](./04_HTML_Reports.md) to learn about viewing and configuring HTML test reports.
