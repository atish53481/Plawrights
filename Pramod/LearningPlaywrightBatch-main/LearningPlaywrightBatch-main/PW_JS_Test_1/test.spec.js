const { test, expect } = require('@playwright/test');

test('Hello World - Basic Playwright Test', async ({ page }) => {
    // Navigate to a website
    await page.goto('https://example.com');

    // Verify the page loaded by checking the title
    const title = await page.title();
    console.log('Page title:', title);

    // Verify the page contains expected content
    await expect(page).toHaveTitle('Example Domain');

    // Simple assertion
    expect(title).toBeTruthy();

    console.log('Hello World! Playwright test passed!');
});