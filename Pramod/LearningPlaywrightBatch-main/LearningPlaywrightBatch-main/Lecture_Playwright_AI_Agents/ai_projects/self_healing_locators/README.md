# Project 2: Self-Healing Locators

## Overview
Automatically fixes broken CSS selectors at runtime using a fallback chain of locator strategies. Tests with wrong selectors still pass because the healing fixture finds the correct element.

## How It Works
1. Test uses an intentionally wrong selector (e.g., `#wrong-username-field`)
2. Healing fixture detects the selector fails
3. Tries fallback strategies in order: Role → Text → Label → Placeholder → CSS variations → Attributes → XPath
4. Finds the correct element and continues the test
5. Logs the healing action for review

## Quick Start
```bash
npx playwright test tests/ --config=../../playwright.config.js
```

## Files
| File | Purpose |
|------|---------|
| `locator_strategies.js` | 7 fallback strategies for finding elements |
| `healing_fixture.js` | Custom Playwright fixture with self-healing |
| `healing_log.json` | Records all healing actions |
| `tests/healed_login.spec.js` | Login tests with wrong selectors |
| `tests/healed_form.spec.js` | Form tests with wrong selectors |

## Healing Strategies (Priority Order)
1. **Role-based** — `getByRole('textbox', { name: 'Username' })`
2. **Text-based** — `getByText('Login')`
3. **Label-based** — `getByLabel('Username')`
4. **Placeholder** — `getByPlaceholder('Enter username')`
5. **CSS variations** — Remove prefixes like `wrong-`, `broken-`, `old-`
6. **Attribute** — `[name="username"]`, `input[type="text"]`
7. **XPath fallback** — `//input[@name="username"]`

## Reading the Healing Log
After running tests, check `healing_log.json`:
```json
{
  "test": "Login with healed username selector",
  "originalSelector": "#wrong-username-field",
  "healedSelector": "[name=\"username\"]",
  "strategy": "css_attribute",
  "action": "fill",
  "timestamp": "2026-03-26T..."
}
```
