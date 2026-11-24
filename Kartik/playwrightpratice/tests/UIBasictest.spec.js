const {test,expect} = require('@playwright/test');


test('Browser Context Playwright test', async ({browser}) =>
{

    //chrome - plugins /cookies
    const context = await browser.newContext();
    const page = await context.newPage();
    const username = page.locator('#username');
    const password = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const cardTitles = page.locator('.card-body a');
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.title());
    //css,xpath
    await username.fill('rahulshetty');
    await password.fill('Learning@830$3mK2');
    await signIn.click();
    //wait until this locator shown up page
    console.log(await page.locator("[style*='block']").textContent());
    await expect(page.locator("[style*='block']")).toContainText('Incorrect');   
    //type - fill
    await username.fill('');
    await username.fill('rahulshettyacademy');
    await signIn.click();
    console.log(await cardTitles.first().textContent());
    console.log(await cardTitles.nth(1).textContent());
    const allTitles = await cardTitles.allTextContents();
    console.log(allTitles);
    
});


test('Page Playwright Test', async ({page}) =>
{

    await page.goto('https://google.com');
    //get the title of the page
    console.log(await page.title());
    await expect(page).toHaveTitle('Google');

});


test('UI Controls Playwright Test', async ({page}) =>
{

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');       
    const username = page.locator('#username');
    const password = page.locator("[type='password']");
    const signIn = page.locator('#signInBtn');
    const dropdown = page.locator("select.form-control");  
    const radioButtons = page.locator("[type='radio']");
    const documentLink = page.locator("[href*='documents-request']"); 
    await username.fill('rahulshettyacademy');
    await password.fill('Learning@830$3mK2');
    await radioButtons.last().click();
    await dropdown.selectOption('consult');
    await page.locator(".radiotextsty").last().waitFor();
    await page.locator("#okayBtn").click();
    console.log
    await expect(await page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").click();
    await expect(await page.locator("#terms")).toBeChecked();
    await page.locator("#terms").uncheck();
    expect(await page.locator("#terms")).isChecked().toBeFalsy();
    await expect(documentLink).toHaveAttribute('class','blinkingText');

});

test('@Child Windows handler', async ({browser}) =>
{
    const context = await browser.newContext();
    const page = await context.newPage();
    const username = page.locator('#username');
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*='documents-request']");

    const [newPage]=Promise.all(
    [context.waitForEvent('page'), //listen for new page penning, rejected, fulfilled
    documentLink.click(), //new page is opnened
    ])
    const text =await newPage.locator(".red").textContent();
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    console.log(domain);
    await page.locator("#username").fill(domain);
    console.log(await page.locator("#username").inputValue());

    
});