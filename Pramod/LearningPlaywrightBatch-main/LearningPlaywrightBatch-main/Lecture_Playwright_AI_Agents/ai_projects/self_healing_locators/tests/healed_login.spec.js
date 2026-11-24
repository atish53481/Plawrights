/**
 * Self-Healing Login Tests
 * Uses INTENTIONALLY WRONG selectors that get auto-healed at runtime
 */
const { test, expect } = require('../healing_fixture');

test.describe('Self-Healing Login Tests', () => {
  test.beforeEach(async ({ healingPage }) => {
    await healingPage.goto('https://the-internet.herokuapp.com/login');
  });

  test('Login with healed username selector', async ({ healingPage }) => {
    // WRONG selector: #wrong-username-field (actual: #username)
    await healingPage.locator('#wrong-username-field').fill('tomsmith');
    await healingPage.locator('#password').fill('SuperSecretPassword!');
    await healingPage.locator('button[type="submit"]').click();

    // Verify login success
    const flash = healingPage.locator('#flash');
    const text = await flash.textContent();
    expect(text).toContain('You logged into a secure area');
  });

  test('Login with healed password selector', async ({ healingPage }) => {
    await healingPage.locator('#username').fill('tomsmith');
    // WRONG selector: #broken-password-input (actual: #password)
    await healingPage.locator('#broken-password-input').fill('SuperSecretPassword!');
    await healingPage.locator('button[type="submit"]').click();

    const flash = healingPage.locator('#flash');
    const text = await flash.textContent();
    expect(text).toContain('You logged into a secure area');
  });

  test('Login with healed submit button selector', async ({ healingPage }) => {
    await healingPage.locator('#username').fill('tomsmith');
    await healingPage.locator('#password').fill('SuperSecretPassword!');
    // WRONG selector: #old-submit-btn (actual: button[type="submit"])
    await healingPage.locator('#old-submit-btn').click();

    const flash = healingPage.locator('#flash');
    const text = await flash.textContent();
    expect(text).toContain('You logged into a secure area');
  });
});
