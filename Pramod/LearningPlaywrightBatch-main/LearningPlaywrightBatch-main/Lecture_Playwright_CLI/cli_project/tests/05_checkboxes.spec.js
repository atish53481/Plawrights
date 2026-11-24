const { test, expect } = require('@playwright/test');

test.describe('TC-005: Checkboxes', () => {
  test('should check the first checkbox', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/checkboxes');
    const firstCheckbox = page.locator('#checkboxes input').first();
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
    console.log('✅ TC-005: Checkboxes - Passed');
  });
});
