const { test, expect } = require('@playwright/test');

test('Verify checkboxes can be toggled', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/checkboxes');
  const checkbox = page.locator('#checkboxes input').first();
  const initialState = await checkbox.isChecked();
  await checkbox.click();
  const newState = await checkbox.isChecked();
  expect(newState).toBe(!initialState);
});
