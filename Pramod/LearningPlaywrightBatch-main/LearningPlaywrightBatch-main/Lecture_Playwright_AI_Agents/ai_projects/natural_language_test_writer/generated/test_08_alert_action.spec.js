const { test, expect } = require('@playwright/test');

test('Verify JavaScript alerts can be accepted', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    await dialog.accept();
  });
  await page.click('button[onclick="jsAlert()"]');
  await expect(page.locator('#result')).toContainText('You successfully clicked an alert');
});
