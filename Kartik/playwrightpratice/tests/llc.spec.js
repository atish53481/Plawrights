
import { test, expect } from  '@playwright/test';

test('Playwright Special locators', async ({page}) =>
{
    await page.goto('https://rahulshettyacademy.com/Angularpractice/');
    await page.getByLabel("Check me out if you Love IceCreams!").click();
    await page.getByLabel("Employed").check();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("abc123");
    await page.getByRole("button", {name : "Submit"}).click();
    await page.getByText("Success! Thr Form been submitted successfully!.").isVisible();

    //5 sec default timeout for expec assertiond
    await expect(page.getByText("Success! The Form has been submitted successfullly!.")).toBeVisible({timeout: 10_000});
    await page.getByRole("link",{name : "Shop"}).click();
    await page.locator("app-card").filter({hastText: 'Nokia Edge'}).getByRole("button").click();

    //locator(css) waitFor()

})