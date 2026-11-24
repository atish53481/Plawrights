const { test, expect } = require('@playwright/test');

test('Verify Add/Remove Elements button works', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/add_remove_elements/');
  await page.click('button[onclick="addElement()"]');
  await expect(page.locator('.added-manually')).toBeVisible();
  await page.click('.added-manually');
  await expect(page.locator('.added-manually')).toHaveCount(0);
});
