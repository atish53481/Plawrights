const { test, expect } = require('@playwright/test');

test.describe('TC-010: Drag and Drop Elements', () => {
  test('Verify drag and drop page has both columns with headers', async ({ page }) => {
    // 1. Navigate to the drag and drop page
    await page.goto('/drag_and_drop');

    // 2. Verify #column-a exists
    const columnA = page.locator('#column-a');
    await expect(columnA).toBeVisible();

    // 3. Verify #column-b exists
    const columnB = page.locator('#column-b');
    await expect(columnB).toBeVisible();

    // 4. Verify both columns contain header text
    await expect(columnA.locator('header')).toHaveText('A');
    await expect(columnB.locator('header')).toHaveText('B');

    console.log('✅ TC-010: Drag and Drop Elements - Passed');
  });
});
