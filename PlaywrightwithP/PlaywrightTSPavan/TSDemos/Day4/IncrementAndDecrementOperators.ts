// Increment and Decrement Operators in TypeScript
// Increment operator (++)
// Decrement operator (--)

let num: number = 5;
console.log("Initial value of num:", num); // Output: Initial value of num: 5

// Using the increment operator
num++;
console.log("After incrementing num:", num); // Output: After incrementing num: 6       
// Using the decrement operator
num--;
console.log("After decrementing num:", num); // Output: After decrementing num: 5
// Using the increment operator in a more complex expression
let result: number = num++ + 10; // Post-increment: num is used first, then incremented
console.log("Result of num++ + 10:", result); // Output: Result of num++ + 10: 15
console.log("Value of num after post-increment:", num); // Output: Value of num after post-increment: 6
// Using the decrement operator in a more complex expression
result = --num + 10; // Pre-decrement: num is decremented first, then used
console.log("Result of --num + 10:", result);
console.log("Value of num after pre-decrement:", num); // Output: Value of num after pre-decrement: 5

