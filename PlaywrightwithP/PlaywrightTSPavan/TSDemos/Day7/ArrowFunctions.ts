///Arrow Functions/Lambda Functions: An arrow function is a concise way to write a function expression in TypeScript. It uses the "=>" syntax and does not have its own "this" context, making it useful for certain scenarios like callbacks and functional programming.

// Lambda refers to anonymous function in programming
// Lamda functions are a consise mechanism to represent anonymous functions.
//These functions are also known as arrow functions in TypeScript and JavaScript, and they provide a shorter syntax for writing functions compared to traditional function expressions.

//There are 3 parts to a Lamda function:

//1. Parameters: The parameters are the input values that the function takes. They are enclosed in parentheses and separated by commas if there are multiple parameters. If there is only one parameter, the parentheses can be omitted.
//2. Arrow (=>): The arrow is used to separate the parameters from the function body. It indicates that the function is an arrow function.
//3. Function Body: The function body contains the code that defines what the function does. It can be a single expression or a block of code enclosed in curly braces. If the function body is a single expression, it is implicitly returned without needing the "return" keyword.        

//Syntax of an arrow function:
// let variableName = (parameters) => {
//     // code to be executed
// };   
// variableName(); // Calling the function

//Example 1: Arrow function with no parameters and no return value

let greet = (): void => {
    console.log("Hello, welcome to TypeScript!");
}   
greet(); // Output: Hello, welcome to TypeScript!

//Example 2: Arrow function with parameters and no return value

let printMessage = (message: string): void => {
    console.log(message);
}
printMessage("This is a simple message."); // Output: This is a simple message.

//Example 3: Arrow function with parameters and a return value

let add = (a: number, b: number): number => {
    return a + b;
}       
let sum: number = add(5, 10);
console.log("Sum:", sum); // Output: Sum: 15

//Example 4: Arrow function with Implicit return value
let multiply = (a: number, b: number): number => a * b; // Implicit return
console.log("Multiply:", multiply(5, 3)); // Output: Multiply: 15

//Example 5: Arrow function with rest parameters
let sumAll = (...nums: number[]): number => {
    let sum: number = 0;
    for (let i = 0; i < nums.length; i++) {
        sum += nums[i];
    }
    return sum;
}
console.log("Sum of all numbers:", sumAll(1, 2, 3, 4, 5)); // Output: Sum of all numbers: 15
console.log("Sum of all numbers:", sumAll(10, 20, 30)); // Output: Sum of all numbers: 60

//Example 6: Arrow function with rest parameters - multiple types
let findElement = (...elements: (string | number)[]): number => {
    for (let i = 0; i < elements.length; i++) {
        if (typeof elements[i] === "number") {
            return elements[i] as number; // Return the first number found
        }
    }
    return -1; // Return -1 if no number is found


}
console.log("First number found:", findElement("a", "b", 5, "c", 10)); // Output: First number found: 5
console.log("First number found:", findElement("x", "y", "z")); // Output: First number found: -1


