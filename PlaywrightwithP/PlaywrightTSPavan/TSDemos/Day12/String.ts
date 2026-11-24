//String - Text Value  or a combination of characters

/*
1. Single Quotes: 'Hello, World!'
2. Double Quotes: "Hello, World!"
3. backtick or Template Literals: `Hello, World!`
*/

//index in string starts from 0

//'' or "" or `` - empty string

//String Methods

// let str: string = "Hello, World!";
// console.log(str.length); //length of the string

// //When to use backticks (Template Literals):
// //1. When you want to include variables or expressions in the string using ${} syntax.
// let name: string = "Alice";
// console.log("Number is ", name"); //10 // valid
// console.log(`Number is ${name}"); //not valid
// console.log('Number is ${name}'); //not valid
// console.log(`Number is ${name}`); //valid


//String Methods

let str: string = "Hello, World!";

console.log(str.length); //length of the string
console.log(str.toUpperCase()); //Output: "HELLO, WORLD!"
console.log(str.toLowerCase()); //Output: "hello, world!"
console.log(str.includes("World")); //Output: true              
console.log(str.indexOf("o")); //Output: 4 (index of first occurrence of "o")
console.log(str.slice(0, 5)); //Output: "Hello" (substring from index 0 to 5)
console.log(str.replace("World", "TypeScript")); //Output: "Hello, TypeScript!" (replaces "World" with "TypeScript")
console.log(str.split(", ")); //Output: ["Hello", "World!"] (splits the string into an array using ", " as the separator)
console.log(str.trim()); //Output: "Hello, World!" (removes whitespace from both ends of the string)
console.log(str.charAt(0)); //Output: "H" (character at index 0)
console.log(str[0]); //Output: "H" (character at index 0 using bracket notation)
console.log(str.endsWith("!")); //Output: true (checks if the string ends with "!")
console.log(str.startsWith("Hello")); //Output: true (checks if the string starts with "Hello") 
console.log(str.repeat(2)); //Output: "Hello, World!Hello, World!" (repeats the string 2 times) 
console.log(str.substring(0, 5)); //Output: "Hello" (substring from index 0 to 5)
console.log(str.toLowerCase().includes("hello")); //Output: true (converts to lowercase and checks if it includes "hello")

