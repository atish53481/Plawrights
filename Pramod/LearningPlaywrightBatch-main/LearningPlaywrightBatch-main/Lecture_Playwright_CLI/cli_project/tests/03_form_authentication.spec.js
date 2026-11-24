const { test, expect } = require('@playwright/test');

test.describe('TC-003: Form Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.getByRole('button', { name: ' Login' }).click();
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
    console.log('✅ TC-003: Form Authentication - Passed');
  });
});
