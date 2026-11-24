/**
 * Self-Healing Form Tests
 * Uses INTENTIONALLY WRONG selectors for checkboxes page
 */
const { test, expect } = require('../healing_fixture');

test.describe('Self-Healing Checkbox Tests', () => {
  test.beforeEach(async ({ healingPage }) => {
    await healingPage.goto('https://the-internet.herokuapp.com/checkboxes');
  });

  test('Toggle checkbox with healed selector', async ({ healingPage }) => {
    // WRONG selector: #broken-checkbox-1 (actual: #checkboxes input)
    const checkbox = healingPage.locator('#broken-checkbox-1');
    await checkbox.click();

    // The healing should find the actual checkbox
    // Verify the page still has checkboxes
    const heading = healingPage.locator('h3');
    const text = await heading.textContent();
    expect(text).toContain('Checkboxes');
  });

  test('Verify checkbox page heading with healed selector', async ({ healingPage }) => {
    // WRONG selector: #wrong-flash-message (actual: #flash doesn't exist here, but h3 does)
    const heading = healingPage.locator('h3');
    const text = await heading.textContent();
    expect(text).toBe('Checkboxes');
  });
});
