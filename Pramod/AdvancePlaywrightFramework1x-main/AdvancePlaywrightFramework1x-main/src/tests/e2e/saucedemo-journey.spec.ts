/**
 * Recorded journey against https://www.saucedemo.com/, driven fully through
 * Page Objects (see README "Page Object Model" + "Writing Tests — Steps +
 * Logging"): no raw locators or absolute URLs in the spec — navigation goes
 * through LoginPage.open() and the project baseURL.
 *
 * Recording cleaned up:
 *   - creds ("standard_user"/"secret_sauce") -> .env (SAUCE_USERNAME/SAUCE_PASSWORD)
 *   - cart badge "2" click -> add two items first, then assert badge = 2
 *   - "Swag Labs" logo click dropped (recorder noise, navigates nowhere)
 */

import { test, expect } from '@fixtures/test-base';
import { credentials } from '@config/credentials';

test.describe('@p1 @e2e SauceDemo.com Recorded Journey', () => {
    const ITEMS = ['sauce-labs-backpack', 'sauce-labs-bike-light'] as const;

    test('login, two items in cart, checkout, logout @smoke', async ({
        page,
        loginPage,
        inventoryPage,
        cartPage,
        checkoutStepOnePage,
    }) => {
        await test.step('Login as standard user', async () => {
            await loginPage.open();
            await loginPage.assertLoaded();
            await loginPage.loginAs(credentials.sauceUsername, credentials.saucePassword);
            await inventoryPage.assertLoaded();
        });

        await test.step('Add two items -> badge shows 2', async () => {
            for (const id of ITEMS) {
                await inventoryPage.addToCart(id);
            }
            expect(await inventoryPage.cartBadgeCount()).toBe(2);
        });

        await test.step('Cart holds both items -> checkout step one', async () => {
            await inventoryPage.openCart();
            await cartPage.assertLoaded();
            expect(await cartPage.rowCount()).toBe(2);
            await cartPage.checkout();
            await checkoutStepOnePage.assertLoaded();
        });

        await test.step('Logout -> back on the login page', async () => {
            await inventoryPage.logout();
            await loginPage.assertLoaded();
            await expect(page).toHaveURL('/');
        });
    });
});
