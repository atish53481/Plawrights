import{test,expect}from'@playwright/test';



//syntax:
/*
test("title",()=>{


//step-1
//step-2
//step-3


})
*/


//fixture-global variable:page, browser, context

test("verify the title of the page",async({page})=>{

    await page.goto("https://www.automationpractice.pl/index.php");
    let title:string=await page.title();
    console.log("Title: " + title);
    await expect(page).toHaveTitle("My Shop");

})