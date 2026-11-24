const { test, expect } = require('@playwright/test');

/* INTENTIONAL FAILURE: Navigates to 404 page and asserts wrong heading - use trace viewer to debug */

test.describe('TC-007: INTENTIONAL FAIL - Nonexistent Page', () => {
  test('should find heading "Page Found" on 404 page', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/this-page-does-not-exist');
    await expect(page.locator('h1')).toHaveText('Page Found');
    console.log('❌ TC-007: Nonexistent Page - This should not print (test should fail)');
  });
});
