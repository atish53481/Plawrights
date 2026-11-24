const { test, expect } = require('@playwright/test');

test.describe('TC-006: Input Fields', () => {
  test('should type a number into the input field', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/inputs');
    const input = page.locator('input[type="number"]');
    await input.fill('12345');
    await expect(input).toHaveValue('12345');
    console.log('✅ TC-006: Input Fields - Passed');
  });
});
