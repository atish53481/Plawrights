const { test, expect } = require('@playwright/test');

test.describe('TC-004: Checkbox Toggle', () => {
  test('Verify checkbox can be toggled on', async ({ page }) => {
    // 1. Navigate to the checkboxes page
    await page.goto('/checkboxes');

    // 2. Get all checkbox elements
    const checkboxes = page.locator('input[type="checkbox"]');

    // 3. Click the first checkbox to toggle it
    await checkboxes.first().click();

    // 4. Verify the first checkbox is now checked
    await expect(checkboxes.first()).toBeChecked();

    console.log('✅ TC-004: Checkbox Toggle - Passed');
  });
});
