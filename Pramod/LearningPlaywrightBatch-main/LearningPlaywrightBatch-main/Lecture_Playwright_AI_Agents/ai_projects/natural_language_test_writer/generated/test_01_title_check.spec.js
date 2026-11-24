const { test, expect } = require('@playwright/test');

test('Verify the homepage title is 'The Internet'', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/');
  await expect(page).toHaveTitle('The Internet');
});
