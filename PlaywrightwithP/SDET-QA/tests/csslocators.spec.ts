/*
CSS (Cascading Style Sheets) 

html + js+ css

2 types of css locators:

1) absolute CSS locator
2) relative CSS locators


tag with id         tag#id    or      #id
tag with class      tag.class   or    .class
tag with any other attribute  tag[attribute=value]  or    [attribute=value]
tag with class and attribute  tag.class[attribute=value]  or  .class[attribute=value]

page.locator(css/xpath)

*/

import { test, expect, Locator } from "@playwright/test"


test("Verify CSS Locators", async ({ page }) => {

    await page.goto("https://demowebshop.tricentis.com/");

    // tag#id

    //const searchbox:Locator= page.locator("input#small-searchterms");
    //await searchbox.fill("T-Shirts");

    //await expect(page.locator("input#small-searchterms")).toBeVisible();
    //await page.locator("input#small-searchterms").fill("T-Shirts");
    //await page.locator("#small-searchterms").fill("T-Shirts");


    //tag.class

    //await page.locator("input.search-box-text").fill("T-Shirts");
    //await page.locator(".search-box-text").fill("T-Shirts");


    //tag[attribute=value]
    //await page.locator("input[name=q]").fill("T-Shirts");
    //await page.locator("[name=q]").fill("T-Shirts");


    //tag.class[attribute=value]
    //await page.locator("input.search-box-text[value='Search store']").fill("T-Shirts");
    await page.locator(".search-box-text[value='Search store']").fill("T-Shirts");


    await page.waitForTimeout(5000);

})








