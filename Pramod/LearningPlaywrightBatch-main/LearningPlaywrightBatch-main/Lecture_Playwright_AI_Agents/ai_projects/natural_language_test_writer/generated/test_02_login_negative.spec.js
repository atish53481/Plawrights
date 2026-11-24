const { test, expect } = require('@playwright/test');

test('Verify login fails with wrong password', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.fill('#username', 'invalidUser');
  await page.fill('#password', 'wrongPassword');
  await page.click('button[type="submit"]');
  await expect(page.locator('#flash')).toContainText('Your username is invalid');
});
