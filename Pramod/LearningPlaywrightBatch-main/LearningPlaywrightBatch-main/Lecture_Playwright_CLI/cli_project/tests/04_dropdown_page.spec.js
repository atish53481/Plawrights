const { test, expect } = require('@playwright/test');

test.describe('TC-004: Dropdown Page', () => {
  test('should select option 2 from dropdown', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dropdown');
    await page.locator('#dropdown').selectOption('2');
    await expect(page.locator('#dropdown')).toHaveValue('2');
    console.log('✅ TC-004: Dropdown Page - Passed');
  });
});
