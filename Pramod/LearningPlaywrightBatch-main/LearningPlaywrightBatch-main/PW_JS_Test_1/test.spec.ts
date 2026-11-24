/**
 * Lab 274: Mouse Actions
 * 
 * =====================
 * LEARNING CONCEPT:
 * =====================
 * Advanced mouse interactions:
 * 
 * - hover()
 * - drag and drop
 * - Mouse movement
 * - Scroll
 * 
 * =====================
 * EXERCISE:
 * =====================
 * 1. Perform hover actions
 * 2. Implement drag and drop
 * 3. Control mouse movement
 * 
 * =====================
 * SOLUTION:
 * =====================
 */

import { test, expect } from '@playwright/test';

// Solution 1: Hover
test('hover action', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Hover over element
    const link = page.getByRole('link', { name: 'Docs' });
    await link.hover();
    
    // Element should be hovered
    await expect(link).toBeVisible();
});

// Solution 2: Hover with Options
test('hover with options', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    const element = page.locator('h1');
    
    // Hover at specific position
    await element.hover({ position: { x: 10, y: 10 } });
    
    // Force hover
    await element.hover({ force: true });
    
    // Hover with timeout
    await element.hover({ timeout: 5000 });
    
    await expect(element).toBeVisible();
});

// Solution 3: Drag and Drop
test('drag and drop', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Drag and drop between elements
    // await page.locator('#source').dragTo(page.locator('#target'));
    
    // With options
    // await page.locator('#source').dragTo(page.locator('#target'), {
    //     sourcePosition: { x: 10, y: 10 },
    //     targetPosition: { x: 20, y: 20 }
    // });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 4: Manual Drag and Drop
test('manual drag and drop', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Manual drag using mouse
    // const source = page.locator('#source');
    // const target = page.locator('#target');
    
    // await source.hover();
    // await page.mouse.down();
    // await target.hover();
    // await page.mouse.up();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 5: Mouse Move
test('mouse move', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Move mouse to coordinates
    await page.mouse.move(100, 100);
    
    // Move with steps (smoother movement)
    await page.mouse.move(200, 200, { steps: 10 });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 6: Mouse Click at Coordinates
test('mouse click at coordinates', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Click at specific coordinates
    await page.mouse.click(100, 100);
    
    // Double click at coordinates
    await page.mouse.dblclick(100, 100);
    
    // Right click at coordinates
    await page.mouse.click(100, 100, { button: 'right' });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 7: Mouse Down/Up
test('mouse down and up', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Press mouse button
    await page.mouse.down();
    
    // Move while pressed
    await page.mouse.move(200, 200);
    
    // Release mouse button
    await page.mouse.up();
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 8: Scroll
test('scroll actions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Scroll element into view
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    
    // Mouse wheel scroll
    await page.mouse.wheel(0, 500); // Scroll down 500px
    
    await expect(footer).toBeVisible();
});

// Solution 9: Scroll to Element
test('scroll to element', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Scroll specific element
    // await page.locator('.scrollable').evaluate(el => {
    //     el.scrollTop = 100;
    // });
    
    // Scroll page
    await page.evaluate(() => {
        window.scrollTo(0, 500);
    });
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
});

// Solution 10: Complex Mouse Interactions
test('complex mouse interactions', async ({ page }) => {
    await page.goto('https://playwright.dev');
    
    // Draw a rectangle (example)
    // await page.mouse.move(100, 100);
    // await page.mouse.down();
    // await page.mouse.move(200, 100);
    // await page.mouse.move(200, 200);
    // await page.mouse.move(100, 200);
    // await page.mouse.move(100, 100);
    // await page.mouse.up();
    
    // Hover menu then click submenu
    const nav = page.getByRole('navigation');
    await nav.hover();
    
    const link = page.getByRole('link', { name: 'Docs' });
    await link.click();
    
    await expect(page).toHaveURL(/.*docs/);
});