const { test, expect } = require('@playwright/test');

test.describe('TC-006: File Upload Page Structure', () => {
  test('Verify file upload page has required elements', async ({ page }) => {
    // 1. Navigate to the upload page
    await page.goto('/upload');

    // 2. Verify the file-upload input exists
    const fileInput = page.locator('#file-upload');
    await expect(fileInput).toBeAttached();

    // 3. Verify the file-submit button exists
    const submitButton = page.locator('#file-submit');
    await expect(submitButton).toBeVisible();

    console.log('✅ TC-006: File Upload Page Structure - Passed');
  });
});
