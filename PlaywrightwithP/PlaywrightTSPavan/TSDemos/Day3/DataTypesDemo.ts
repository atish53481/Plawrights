/*1) Premitive Data Types
Number
String
Boolean
Null
Undefined
Any
Union Types
void


//2) Non Premitive Data Types
Array
Class
Function
Interface
Touple etc




*/

//1. Number Type
//Represents both integer and floating-point numbers. TypeScript uses the same number type for all numeric values, which is based on the JavaScript number type. It supports various numeric literals, including decimal, hexadecimal, binary, and octal.

//Example1: Number Type
// // let age: number = 25; // Declaring a variable of type number and initializing it with a value
// let price: number = 19.99; // Declaring a variable of type number and initializing it with a floating-point value
// let big=  12345678901234567890n; // BigInt literal for very large integers

// console.log(age); // Output: 25
// console.log(price); // Output: 19.99
// console.log(big); // Output: 12345678901234567890n  
// console.log(age); // Output: 25

//2. String Type
//Represents a sequence of characters. Strings in TypeScript are enclosed in single quotes (' '), double quotes (" "), or backticks (` `) for template literals. Template literals allow for embedding expressions and multi-line strings.

//1. Single Quotes ('')
//2. Double Quotes ("")
//3. Backtick (``)
/*
1. Single Quotes: 'Hello, World!'
2. Double Quotes: "Hello, World!"
3. Template Literals: `Hello, ${name}!` (allows for embedding expressions and multi-line strings)

*/

// let firstName: string = "John"; // Declaring a variable of type string and initializing it with a value
// let lastName: string = 'Doe'; // Declaring a variable of type string and initializing it with a value

// console.log("Hello",firstName,lastName); // Output: John Doe

// let greeting: string = `Hello, ${firstName} ${lastName}!`; // Using template literals to create a greeting message

//3. Boolean Type
//Represents a logical value that can be either true or false. It is commonly used for conditional statements and control flow in programming.
// let isStudent: boolean = true; // Declaring a variable of type boolean and initializing it with a value
// let isEmployed: boolean = false; // Declaring a variable of type boolean and initializing it with a value    
// console.log("Is student:", isStudent); // Output: true
// console.log(isEmployed); // Output: false

//4. Null and Undefined Types
//Null represents the intentional absence of any object value, while undefined represents a variable that has been declared but has not been assigned a value. Both null and undefined are considered falsy values in TypeScript.
// let myVariable:null = null; // Declaring a variable that can be either a string or null
// console.log(myVariable); // Output: null 
// let emptyVariable:undefined; // Declaring a variable that can be either a number or undefined
// console.log(emptyVariable); // Output: undefined

// let price: number;
// console.log(price); // Output: undefined (since price is declared but not initialized)

//5. ANY Type   
//The any type is a special type in TypeScript that allows a variable to hold any type of value. It is often used when the type of a variable cannot be determined at compile time or when you want to opt out of type checking for a specific variable. However, using any can lead to potential runtime errors, so it should be used with caution.
// let randomValue: any = 10; // Declaring a variable of type any and initializing it with a number
// console.log(randomValue); // Output: 10  

// let randomValue: any = "Hello"; // Reassigning the variable to a string
// console.log(typeof(randomValue)); // Output: string 

// randomValue = true; // Reassigning the variable to a boolean
// console.log(typeof(randomValue)); // Output: boolean    

// randomValue = { name: "John", age: 30 }; // Reassigning the variable to an object
// console.log(typeof(randomValue)); // Output: object     

//6 . Union Types - Combines multiple types into one. A variable declared with a union type can hold a value that is of any of the specified types. This is useful when you want to allow for multiple types of values for a variable while still maintaining type safety.

// let id: number | string | boolean; // Declaring a variable that can be either a number or a string
// id = 123; // Assigning a number value to the variable
// console.log("ID as number:", id); // Output: ID as number: 123      

// id = "ABC123"; // Assigning a string value to the variable
// console.log("ID as string:", id); // Output: ID as string: ABC123

// id = true; // Assigning a boolean value to the variable
// console.log("ID as boolean:", id); // Output: ID as boolean: true


//7. Void Type
//The void type is used to indicate that a function does not return a value. It is commonly used for functions that perform an action but do not produce a result that needs to be returned to the caller.

/* 
frunction show(): void {
    console.log("This function does not return a value.");
}
show(); // Output: This function does not return a value.
*/      

function sum1(x: number, y: number): void {
    let result: number = x + y;
    console.log("The sum1 is:", result); // Output: The sum is: 15
}

sum1(5, 10); // Calling the function with two number arguments

function sum2(x: number, y: number): number {
    let result: number = x + y;
    return result; // Returning the sum of x and y
}   

let total: number = sum2(5, 10); // Calling the function and storing the result in a variable
console.log("The total is:", total); // Output: The total is: 15    