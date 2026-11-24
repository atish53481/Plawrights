import { test, expect } from '@playwright/test';

test.describe('TTA Bank - Funds Transfer Flow', () => {

  test('should create account, transfer $5000, and verify balances', async ({ page }) => {
    // 1. Open the TTA Bank application
    await page.goto('https://tta-bank-digital-973242068062.us-west1.run.app/');

    // 2. Create a Dummy Signup with random email ID, name and details
    await page.getByRole('button', { name: 'Sign Up' }).click();
    
    // Generate a random email to ensure the signup works every time the test runs
    const randomEmail = `jane.random_${Date.now()}@example.com`;
    
    await page.getByRole('textbox', { name: 'John Doe' }).fill('Jane Random');
    await page.getByRole('textbox', { name: 'you@example.com' }).fill(randomEmail);
    await page.getByRole('textbox', { name: '••••••••' }).fill('SecurePass123!');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // 3. Verify that the 50k $ balance is present after successful signup
    const initialBalance = page.getByRole('heading', { name: '$50,000.00' });
    await expect(initialBalance).toBeVisible();

    // 4. Go to the Transfer Funds Tab and transfer $5000 to the default selected account
    await page.getByRole('button', { name: 'Transfer Funds' }).click();
    
    // Fill the amount (placeholder is '0.00')
    await page.getByPlaceholder('0.00').fill('5000');
    
    await page.getByRole('button', { name: 'Continue' }).click();
    // Confirm the transfer on the review screen
    await page.getByRole('button', { name: 'Confirm Transfer' }).click();
    
    // Wait for the success message to ensure the transaction completed
    await expect(page.getByText('Transfer processed successfully.')).toBeVisible();

    // 5. Verify that in the dashboard the balance is updated to $45K
    await page.getByRole('button', { name: 'Dashboard' }).click();
    const updatedBalance = page.getByRole('heading', { name: '$45,000.00' });
    await expect(updatedBalance).toBeVisible();

    // 6. Sign out of the application
    await page.getByRole('button', { name: 'Sign Out' }).click();
    
    // Verify successful signout by checking if we return to the SignIn/SignUp screen
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

});
