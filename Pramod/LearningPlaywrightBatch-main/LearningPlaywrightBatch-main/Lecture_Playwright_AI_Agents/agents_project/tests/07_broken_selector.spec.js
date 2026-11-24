const { test, expect } = require('@playwright/test');

/*
 * ============================================================
 * INTENTIONAL FAILURE: Simulates an AI agent using a wrong/
 * hallucinated CSS selector. The selector '#ai-generated-element'
 * does not exist on the homepage. This test demonstrates what
 * happens when an AI agent generates a selector that does not
 * match any element in the DOM.
 * ============================================================
 */

test.describe('TC-007: Broken Selector (Intentional Failure)', () => {
  test('Attempt to find a non-existent element with hallucinated selector', async ({ page }) => {
    // 1. Navigate to the homepage
    await page.goto('/');

    // 2. Try to find an element that does not exist
    const brokenElement = page.locator('#ai-generated-element');

    // 3. This assertion WILL FAIL - the element does not exist
    await expect(brokenElement).toBeVisible({ timeout: 5000 });

    console.log('❌ TC-007: Broken Selector - This line should not be reached');
  });
});
