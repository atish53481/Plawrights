import {test,expect, Locator} from '@playwright/test';

test("Text Input Actions", async ({ page }) => {
    await page.goto("https://testautomationpractice.blogspot.com/");
    const textbox: Locator = page.locator("#name");
    await expect(textbox).toBeVisible();
    await expect(textbox).toBeEnabled();

    const maxLength: string | null = await textbox.getAttribute("maxlength");// to get the value of maxlength attribute
    expect(maxLength).toBe('15');

    await textbox.fill("John Doe");

    //console.log("Text entered in the textbox", await textbox.textContent()); //returns empty 
    console.log("Value entered in the textbox", await textbox.inputValue()); //returns the value entered in the textbox
    

})  