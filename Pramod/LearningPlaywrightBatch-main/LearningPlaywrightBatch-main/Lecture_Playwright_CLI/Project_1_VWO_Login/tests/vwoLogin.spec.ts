import { test, expect } from '@playwright/test';

test.describe('VWO Login Flow', () => {

  test('should display error message on invalid credentials', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('https://app.vwo.com/#/login');

    // Verify the page title to ensure it loaded correctly
    await expect(page).toHaveTitle(/Login - VWO/);

    // 2. Input an invalid email address
    // Using getByPlaceholder or getByRole for reliable targeting
    await page.getByRole('textbox', { name: 'Email address' }).fill('invalid_user@abc.com');

    // 3. Input an invalid password
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword123');

    // 4. Click the 'Sign in' button
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    // 5. Verify that the correct error message appears
    const errorMessage = page.getByText('Your email, password, IP address or location did not match');
    await expect(errorMessage).toBeVisible();
  });

});
