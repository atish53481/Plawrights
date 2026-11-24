const { test, expect } = require('@playwright/test');

test('Verify drag and drop columns exist', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/drag_and_drop');
  const content = page.locator('#content');
  await expect(content).toBeVisible();
  const heading = page.locator('h3');
  await expect(heading).toBeVisible();
});
