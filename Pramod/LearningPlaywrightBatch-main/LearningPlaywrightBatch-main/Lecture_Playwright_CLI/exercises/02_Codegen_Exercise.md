# Exercise 2: Recording Tests with Codegen

## Objective
Learn to use `npx playwright codegen` to record browser interactions, generate test code, and critically evaluate the output for production readiness.

---

## Prerequisites
- Playwright installed with browsers
- Access to https://the-internet.herokuapp.com
- A text editor for saving generated code

---

## Tasks

### Task 1: Launch Codegen
```bash
npx playwright codegen https://the-internet.herokuapp.com/checkboxes
```
- Two windows should open: the browser and the Playwright Inspector
- Observe the Inspector panel -- it shows generated code in real time
- Try switching the target language dropdown (JavaScript, Python, Java, C#)

### Task 2: Record Checkbox Interactions
In the codegen browser window:
1. Click the first checkbox to check it
2. Click the second checkbox to uncheck it
3. In the Inspector toolbar, click "Assert visibility" and click on checkbox 1
4. Click "Assert checked" and verify checkbox states
5. Watch the generated code update in real time

### Task 3: Save the Generated Code
- Copy the generated code from the Inspector
- Save it to `tests/codegen_checkboxes.spec.js`
- Review the generated imports and test structure

### Task 4: Run the Generated Test
```bash
npx playwright test tests/codegen_checkboxes.spec.js
```
- Does the test pass on the first run?
- If it fails, what is the error? How would you fix it?
- Run it with `--headed` to watch the execution

### Task 5: Record Add/Remove Elements
```bash
npx playwright codegen https://the-internet.herokuapp.com/add_remove_elements/
```
Record the following sequence:
1. Click "Add Element" three times
2. Verify three "Delete" buttons appear
3. Click each "Delete" button to remove all three elements
4. Verify no "Delete" buttons remain
- Save as `tests/codegen_add_remove.spec.js`

### Task 6: Compare Codegen vs Hand-Written
Take one of your previously hand-written tests and compare it with the codegen version:

| Aspect | Codegen Output | Hand-Written |
|--------|---------------|--------------|
| Locator strategy | | |
| Assertion quality | | |
| Readability | | |
| Maintainability | | |
| Page Object usage | | |
| Error handling | | |

### Task 7: Identify Improvements
List 3 specific ways you would improve the codegen output:
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

Consider:
- Are the locators robust or brittle?
- Are there missing assertions?
- Would you add waits or retries?
- Could you extract it into a Page Object?

---

## Deliverable
- `tests/codegen_checkboxes.spec.js` -- recorded and verified passing
- `tests/codegen_add_remove.spec.js` -- recorded and verified passing
- Improvement notes (at least 3 items) written as comments in the test files

---

## Bonus: Advanced Codegen Flags
Try these variations and note the differences:
```bash
npx playwright codegen --browser firefox https://example.com
npx playwright codegen --viewport-size "800,600" https://example.com
npx playwright codegen --device "iPhone 13" https://example.com
npx playwright codegen --color-scheme dark https://example.com
npx playwright codegen --save-storage auth.json https://example.com
```
