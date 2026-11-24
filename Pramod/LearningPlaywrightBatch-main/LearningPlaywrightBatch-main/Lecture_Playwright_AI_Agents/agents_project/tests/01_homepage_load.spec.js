const { test, expect } = require('@playwright/test');

test.describe('TC-001: Homepage Load Verification', () => {
  test('Verify homepage loads with correct title and heading', async ({ page }) => {
    // 1. Navigate to the homepage
    await page.goto('/');

    // 2. Verify the page title is "The Internet"
    await expect(page).toHaveTitle('The Internet');

    // 3. Verify the main heading is visible and contains expected text
    const heading = page.locator('h1.heading');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Welcome to the-internet');

    console.log('✅ TC-001: Homepage Load Verification - Passed');
  });
});
