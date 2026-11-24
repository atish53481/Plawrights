import {test, expect, Locator} from '@playwright/test';

test("Xpath demo in Playwright", async ({ page }) => {

    await page.goto("https://demowebshop.tricentis.com/");

    //1. Absolute xpath
   const absolatelogo:Locator = page.locator("//html[1]/body[1]/div[4]/div[1]/div[1]/div[1]/a[1]/img[1]");
   
    await expect(absolatelogo).toBeVisible();


    //2. Relative xpath
    const relativelogo:Locator = page.locator("//img[@alt='Tricentis Demo Web Shop']");
    await expect(relativelogo).toBeVisible();

})