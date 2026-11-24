import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://app.vwo.com/#/login');
});