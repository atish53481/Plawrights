const { test, expect } = require('@playwright/test');

test('Verify hover reveals user info', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/hovers');
  const figure = page.locator('.figure').first();
  await figure.hover();
  await expect(figure.locator('.figcaption')).toBeVisible();
  await expect(figure.locator('h5')).toContainText('user');
});
