const { test, expect } = require('@playwright/test');

/* INTENTIONAL FAILURE: Uses impossibly short timeout - use trace viewer to see timing */

test.describe('TC-009: INTENTIONAL FAIL - Impossible Timeout', () => {
  test('should load dynamic content with 1ms timeout', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');
    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.locator('#finish')).toBeVisible({ timeout: 1 });
    console.log('❌ TC-009: Impossible Timeout - This should not print (test should fail)');
  });
});
