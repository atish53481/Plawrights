const { test, expect } = require('@playwright/test');

test.describe('TC-002: Login Form Authentication', () => {
  test('Verify successful login with valid credentials', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/login');

    // 2. Fill in the username
    await page.locator('#username').fill('tomsmith');

    // 3. Fill in the password
    await page.locator('#password').fill('SuperSecretPassword!');

    // 4. Click the Login button
    await page.locator('button[type="submit"]').click();

    // 5. Verify URL contains /secure
    await expect(page).toHaveURL(/\/secure/);

    // 6. Verify flash message contains success text
    const flashMessage = page.locator('#flash');
    await expect(flashMessage).toContainText('You logged into a secure area!');

    console.log('✅ TC-002: Login Form Authentication - Passed');
  });
});
