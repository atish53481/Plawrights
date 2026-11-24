const { test, expect } = require('@playwright/test');

/* INTENTIONAL FAILURE: Asserts wrong element count - use debug mode to count actual elements */

test.describe('TC-008: INTENTIONAL FAIL - Wrong Element Count', () => {
  test('should have exactly 100 links on homepage', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com');
    const links = page.locator('#content ul li a');
    await expect(links).toHaveCount(100);
    console.log('❌ TC-008: Wrong Element Count - This should not print (test should fail)');
  });
});
