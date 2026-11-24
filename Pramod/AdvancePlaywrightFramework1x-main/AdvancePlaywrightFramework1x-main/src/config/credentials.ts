/**
 * credentials — SauceDemo login creds, sourced from `.env`.
 *
 * `dotenv.config()` runs in playwright.config.ts before any spec loads, so
 * `process.env` is already populated by the time this module is imported.
 *
 *   import { credentials } from '@config/credentials';
 *   await loginPage.loginAs(credentials.sauceUsername, credentials.saucePassword);
 */

export const credentials = {
    // Real saucedemo.com creds — sourced from .env, never hardcoded in specs.
    sauceUsername: process.env.SAUCE_USERNAME ?? '',
    saucePassword: process.env.SAUCE_PASSWORD ?? '',
} as const;
