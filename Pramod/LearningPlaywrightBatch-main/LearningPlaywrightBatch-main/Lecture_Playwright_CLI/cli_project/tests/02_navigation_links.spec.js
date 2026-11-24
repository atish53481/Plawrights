const { test, expect } = require('@playwright/test');

test.describe('TC-002: Navigation Links Verification', () => {
  test('should have at least 5 links and include Form Authentication', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com');
    const links = page.locator('#content ul li a');
    await expect(links).not.toHaveCount(0);
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(5);
    await expect(page.getByText('Form Authentication')).toBeVisible();
    console.log('✅ TC-002: Navigation Links Verification - Passed');
  });
});
