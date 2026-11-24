const { test, expect } = require('@playwright/test');

test('Verify dropdown option 1 can be selected', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dropdown');
  await page.selectOption('#dropdown', '1');
  const selected = await page.locator('#dropdown').inputValue();
  expect(selected).toBe('1');
});
