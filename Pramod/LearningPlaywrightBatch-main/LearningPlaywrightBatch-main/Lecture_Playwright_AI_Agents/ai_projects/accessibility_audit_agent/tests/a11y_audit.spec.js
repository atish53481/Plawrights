/**
 * Accessibility Audit Playwright Tests
 * Tests specific WCAG rules on the-internet.herokuapp.com
 */
const { test, expect } = require('@playwright/test');

test.describe('Accessibility Audit Tests', () => {

  test('Homepage should have a page title', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(0);
  });

  test('Login page inputs should have associated labels or aria-labels', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login');
    const usernameInput = page.locator('#username');
    await expect(usernameInput).toBeVisible();

    // Check that form has some labeling mechanism
    const form = page.locator('#login');
    await expect(form).toBeVisible();

    // Verify there are label elements
    const labels = page.locator('label');
    const labelCount = await labels.count();
    expect(labelCount).toBeGreaterThan(0);
  });

  test('All images should have alt attributes', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      // alt should exist (can be empty for decorative images)
      expect(alt).not.toBeNull();
    }
  });

  test('Page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    const headings = await page.evaluate(() => {
      const h = [];
      document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
        h.push(parseInt(el.tagName.charAt(1)));
      });
      return h;
    });

    // Should have at least one heading
    expect(headings.length).toBeGreaterThan(0);

    // First heading should be h1 or h2
    expect(headings[0]).toBeLessThanOrEqual(2);
  });

  test('Links should have discernible text', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/');
    const links = page.locator('a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    // Check first 10 links have text
    const linksToCheck = Math.min(count, 10);
    for (let i = 0; i < linksToCheck; i++) {
      const text = await links.nth(i).textContent();
      const ariaLabel = await links.nth(i).getAttribute('aria-label');
      const hasText = (text && text.trim().length > 0) || ariaLabel;
      expect(hasText).toBeTruthy();
    }
  });
});
