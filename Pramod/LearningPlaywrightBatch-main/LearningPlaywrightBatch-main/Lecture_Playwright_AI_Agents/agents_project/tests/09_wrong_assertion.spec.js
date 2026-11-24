const { test, expect } = require('@playwright/test');

/*
 * ============================================================
 * INTENTIONAL FAILURE: Simulates an AI agent assuming wrong
 * URL after navigation. After clicking Login without filling
 * in credentials, the page stays on /login (with an error),
 * NOT redirect to '/dashboard'. This test demonstrates what
 * happens when an AI agent assumes an incorrect navigation
 * outcome.
 * ============================================================
 */

test.describe('TC-009: Wrong Assertion After Login (Intentional Failure)', () => {
  test('Click login without credentials and expect wrong URL', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/login');

    // 2. Click the Login button WITHOUT filling in any fields
    await page.locator('button[type="submit"]').click();

    // 3. This assertion WILL FAIL - URL will not be /dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 });

    console.log('❌ TC-009: Wrong Assertion - This line should not be reached');
  });
});
