const { test, expect } = require('@playwright/test');

test('Verify file upload page has choose file button', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/upload');
  const content = page.locator('#content');
  await expect(content).toBeVisible();
  const heading = page.locator('h3');
  await expect(heading).toBeVisible();
});
