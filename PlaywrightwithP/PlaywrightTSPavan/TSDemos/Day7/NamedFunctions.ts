// //Named Functions: A Function is a reusable block of code that performs a specific task. A named function is a function that has a name, which can be used to call the function later in the code.

// // Syntax of a named function:
// // function functionName(parameters) {
// //     // code to be executed
// // }    

// // function(); // Calling the function


// //Example 1: Named Function with no parameters and no return value
// function greet(): void {
//     console.log("Hello, welcome to TypeScript!");
// }   
// greet(); // Output: Hello, welcome to TypeScript!

// //Example 2: Named Function with parameters and no return value
// function printMessage(message: string): void {
//     console.log(message);
// }
// printMessage("This is a simple message."); // Output: This is a simple message. 

// //Example 3: Named Function with parameters and a return value
// function add(a: number, b: number): number {
//     return a + b;
// }   
// let sum: number = add(5, 10);
// console.log("Sum:", sum); // Output: Sum: 15
// //Example 4: Named Function with default parameters
// function multiply(a: number, b: number = 2): number {
//     return a * b;
// }   
// console.log("Multiply with default parameter:", multiply(5)); // Output: Multiply with default parameter: 10
// console.log("Multiply with both parameters:", multiply(5, 3)); // Output: Multiply with both parameters: 15


// //Example 5: Named Function with rest parameters
// function sumAll(...nums: number[]): number {
    
//     let i;
//     let sum: number = 0;
//     for (i = 0; i < nums.length; i++) {
//         sum += nums[i];
//     }   
// }   
// console.log("Sum of all numbers:", sum); // Output: Sum of all numbers: 15

// sumAll(1, 2, 3, 4, 5); // Output: Sum of all numbers: 15

// sumAll(10, 20, 30); // Output: Sum of all numbers: 60



// //Example 6: Named Function with rest parameters - multiple types
// function findElement(...elements: (string | number)[]): number {
//     let i;
//     for (i = 0; i < elements.length; i++) {
//         if (typeof elements[i] === "number") {
//             return elements[i] as number; // Return the first number found
//         }
//     }
//     return -1; // Return -1 if no number is found
// }


// findElement("Hello", 42, "World", 3.14); // Output: 42

// findElement("Hello", "World"); // Output: -1
// console.log("Find element:", findElement("Hello", 42, "World", 3.14)); // Output: Find element: 42
// console.log("Find element:", findElement("Hello", "World")); // Output: Find element: -1    



// //Example 7: Named Function with Optional Parameters
// function displatDetails(id: number, name: string, mailId?: string): void {
//     console.log(`ID: ${id}`);
//     console.log(`Name: ${name}`);
//     if (mailId) {
//         console.log(`Mail ID: ${mailId}`);
//     }                
// }   
// displatDetails(1, "John Doe", "john.doe@example.com"); // Output: ID: 1, Name: John Doe, Mail ID: john.doe@example.com  

// //Example 8: Named Function with default parameters 

// function calculateDiscount(price: number, rate: number=0.50): void {
//     let discountedPrice: number = price * rate;
//     console.log(`Discounted Price: ${discountedPrice}`);
// }   

// calculateDiscount(100, 0.1); // Output: Discounted Price: 10

// calculateDiscount(100, 0.2); // Output: Discounted Price: 20    
