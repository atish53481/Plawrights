const { test, expect } = require('@playwright/test');

/*
 * ============================================================
 * INTENTIONAL FAILURE: Simulates an AI agent hallucinating
 * the expected text content. The h1 heading on the homepage
 * says "Welcome to the-internet", NOT "AI Agent Dashboard".
 * This test demonstrates what happens when an AI agent
 * assumes incorrect text content for an element.
 * ============================================================
 */

test.describe('TC-008: Stale Element Text (Intentional Failure)', () => {
  test('Expect h1 to have hallucinated text content', async ({ page }) => {
    // 1. Navigate to the homepage
    await page.goto('/');

    // 2. Locate the h1 heading
    const heading = page.locator('h1');

    // 3. This assertion WILL FAIL - the actual text is "Welcome to the-internet"
    await expect(heading).toHaveText('AI Agent Dashboard', { timeout: 5000 });

    console.log('❌ TC-008: Stale Element Text - This line should not be reached');
  });
});
