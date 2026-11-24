/**
 * Prompt Templates for Natural Language Test Writer
 * Maps test types to Playwright code generation patterns
 */

const BASE_URL = 'https://the-internet.herokuapp.com';

const templates = {
  title_check: (desc) => `const { test, expect } = require('@playwright/test');

test('${desc.description}', async ({ page }) => {
  await page.goto('${BASE_URL}${desc.page}');
  await expect(page).toHaveTitle('${desc.expectedTitle || 'The Internet'}');
});
`,

  login_negative: (desc) => `const { test, expect } = require('@playwright/test');

test('${desc.description}', async ({ page }) => {
  await page.goto('${BASE_URL}${desc.page}');
  await page.fill('#username', 'invalidUser');
  await page.fill('#password', 'wrongPassword');
  await page.click('button[type="submit"]');
  await expect(page.locator('#flash')).toContainText('Your username is invalid');
});
`,

  login_positive: (desc) => `const { test, expect } = require('@playwright/test');

test('${desc.description}', async ({ page }) => {
  await page.goto('${BASE_URL}${desc.page}');
  await page.fill('#username', 'tomsmith');
  await page.fill('#password', 'SuperSecretPassword!');
  await page.click('button[type="submit"]');
  await expect(page.locator('#flash')).toContainText('You logged into a secure area');
  await expect(page).toHaveURL(/\\/secure/);
});
`,

  dropdown_select: (desc) => `const { test, expect } = require('@playwright/test');

test('${desc.description}', async ({ page }) => {
  await page.goto('${BASE_URL}${desc.page}');
  await page.selectOption('#dropdown', '1');
  const selected = await page.locator('#dropdown').inputValue();
  expect(selected).toBe('1');
});
`,

  checkbox_toggle: (desc) => `const { test, expect } = require('@playwright/test');

test('${desc.description}', async ({ page }) => {
  await page.goto('${BASE_URL}${desc.page}');
  const checkbox = page.locator('#checkboxes input').first();
  const initialState = await checkbox.isChecked();
  await checkbox.click();
  const newState = await checkbox.isChecked();
  expect(newState).toBe(!initialState);
});
`,

  click_action: (desc) => `const { test, expect } = require('@playwright/test');

test('${desc.description}', async ({ page }) => {
  await page.goto('${BASE_URL}${desc.page}');
  await page.click('button[onclick="addElement()"]');
  await expect(page.locator('.added-manually')).toBeVisible();
  await page.click('.added-manually');
  await expect(page.locator('.added-manually')).toHaveCount(0);
});
`,

  hover_action: (desc) => `const { test, expect } = require('@playwright/test');

test('${desc.description}', async ({ page }) => {
  await page.goto('${BASE_URL}${desc.page}');
  const figure = page.locator('.figure').first();
  await figure.hover();
  await expect(figure.locator('.figcaption')).toBeVisible();
  await expect(figure.locator('h5')).toContainText('user');
});
`,

  alert_action: (desc) => `const { test, expect } = require('@playwright/test');

test('${desc.description}', async ({ page }) => {
  await page.goto('${BASE_URL}${desc.page}');
  page.on('dialog', async (dialog) => {
    expect(dialog.type()).toBe('alert');
    await dialog.accept();
  });
  await page.click('button[onclick="jsAlert()"]');
  await expect(page.locator('#result')).toContainText('You successfully clicked an alert');
});
`,

  element_check: (desc) => `const { test, expect } = require('@playwright/test');

test('${desc.description}', async ({ page }) => {
  await page.goto('${BASE_URL}${desc.page}');
  const content = page.locator('#content');
  await expect(content).toBeVisible();
  const heading = page.locator('h3');
  await expect(heading).toBeVisible();
});
`,
};

/**
 * Get a template function by test type
 */
function getTemplate(type) {
  return templates[type] || templates.element_check;
}

/**
 * List all available template types
 */
function listTemplateTypes() {
  return Object.keys(templates);
}

module.exports = { getTemplate, listTemplateTypes, templates };
