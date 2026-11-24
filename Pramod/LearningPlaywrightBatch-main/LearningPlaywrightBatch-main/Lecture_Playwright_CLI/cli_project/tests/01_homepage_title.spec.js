const { test, expect } = require('@playwright/test');

test.describe('TC-001: Homepage Title Verification', () => {
  test('should have correct title and heading on homepage', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com');
    await expect(page).toHaveTitle('The Internet');
    await expect(page.locator('h1')).toBeVisible();
    console.log('✅ TC-001: Homepage Title Verification - Passed');
  });
});
