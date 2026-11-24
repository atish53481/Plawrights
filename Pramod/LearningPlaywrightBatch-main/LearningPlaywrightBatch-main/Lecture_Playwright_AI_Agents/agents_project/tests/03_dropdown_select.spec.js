const { test, expect } = require('@playwright/test');

test.describe('TC-003: Dropdown Selection', () => {
  test('Verify dropdown option can be selected', async ({ page }) => {
    // 1. Navigate to the dropdown page
    await page.goto('/dropdown');

    // 2. Select "Option 2" from the dropdown
    await page.locator('#dropdown').selectOption('2');

    // 3. Verify the selected value is "2"
    await expect(page.locator('#dropdown')).toHaveValue('2');

    console.log('✅ TC-003: Dropdown Selection - Passed');
  });
});
