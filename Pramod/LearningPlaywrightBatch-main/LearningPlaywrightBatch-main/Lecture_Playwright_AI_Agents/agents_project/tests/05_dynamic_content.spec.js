const { test, expect } = require('@playwright/test');

test.describe('TC-005: Dynamic Content Verification', () => {
  test('Verify dynamic content area loads with rows', async ({ page }) => {
    // 1. Navigate to the dynamic content page
    await page.goto('/dynamic_content');

    // 2. Verify the page heading
    const heading = page.locator('h3');
    await expect(heading).toHaveText('Dynamic Content');

    // 3. Verify content rows exist (3 rows of dynamic content)
    const rows = page.locator('.example .row .large-2');
    const count = await rows.count();
    expect(count).toBe(3);

    console.log('✅ TC-005: Dynamic Content Verification - Passed');
  });
});
