const { test, expect } = require('@playwright/test');

test.describe('TC-010: Hover Elements', () => {
  test('should reveal user info on hover', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/hovers');
    const firstFigure = page.locator('.figure').first();
    await firstFigure.hover();
    await expect(firstFigure.locator('.figcaption')).toBeVisible();
    await expect(firstFigure.locator('.figcaption')).toContainText('name: user1');
    console.log('✅ TC-010: Hover Elements - Passed');
  });
});
