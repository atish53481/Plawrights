// ////Anonumous Function (Unnamed Function/Nameless Function)


// /*
// An anonymous function is a function that does not have a name. It is often used as a callback function or as an argument to another function. Anonymous functions can be defined using the function expression syntax or the arrow function syntax.

// Syntax of an anonymous function using function expression:
// let variableName = function(parameters) {
//     // code to be executed
// };

// variableName(); // Calling the function
// */  

// //example 1: Anonymous function 

// let msg = function():string {
//     return "Hello, this is an anonymous function!";
// }
// console.log(msg()); // Output: Hello, this is an anonymous function!    

// //example 2: Anonymous function with parameters

// let add = function(a: number, b: number): number {
//     return a + b;
// }   
// console.log("Sum:", add(5, 10)); // Output: Sum: 15

// //example 3: Anonymous function as a callback       
// function performOperation(a: number, b: number, operation: (x: number, y: number) => number): number {