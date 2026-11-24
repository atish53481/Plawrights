# Project 1: Natural Language Test Writer

## Overview
Converts plain English test descriptions into runnable Playwright spec files using template-based AI code generation.

## How It Works
1. Define tests in `test_descriptions.json` using natural language
2. `prompt_templates.js` maps test types to Playwright code patterns
3. `generate_tests.js` reads descriptions and generates `.spec.js` files

## Quick Start
```bash
node generate_tests.js
```

## Files
| File | Purpose |
|------|---------|
| `test_descriptions.json` | 10 test descriptions in plain English |
| `prompt_templates.js` | Template engine mapping types to Playwright code |
| `generate_tests.js` | Main generator script |
| `generated/` | Output folder for generated spec files |

## Supported Test Types
- `title_check` — Verify page title
- `login_negative` — Test failed login
- `login_positive` — Test successful login
- `dropdown_select` — Select dropdown options
- `checkbox_toggle` — Toggle checkboxes
- `click_action` — Click and verify actions
- `hover_action` — Hover and verify tooltips
- `alert_action` — Handle JavaScript alerts
- `element_check` — Verify elements exist

## Adding New Templates
Add a new entry to `prompt_templates.js`:
```javascript
my_new_type: (desc) => `const { test, expect } = require('@playwright/test');
test('${desc.description}', async ({ page }) => {
  // Your test code here
});`
```
