import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * SauceDemo login screen.
 *
 *   const login = new LoginPage(page);
 *   await login.open();
 *   await login.loginAs('standard_user', 'secret_sauce');
 */



export class LoginPage extends BasePage {

    static readonly PATH = '/';

    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    private readonly errorBox: Locator;
    private readonly loginCredentialsHint: Locator;

    constructor(page: Page) {
        super(page, 'LoginPage');
        this.usernameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginButton = page.locator('[data-test="login-button"]');
        this.errorBox = page.locator('[data-test="error"]');
        this.loginCredentialsHint = page.locator('[data-test="login-credentials"]');
    }

    async open(): Promise<void> {
        await this.goto(LoginPage.PATH);
    }

    async loginAs(username: string, password: string): Promise<void> {
        this.log.info(`loginAs ${username}`);
        await this.el.fill(this.usernameInput, username);
        await this.el.fill(this.passwordInput, password);
        await this.el.click(this.loginButton);
    }

    async assertLoaded(): Promise<void> {
        await expect(this.usernameInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

}