//Variable: A variable is a named storage location in memory that can hold a value. In TypeScript, you can declare variables using the `let`, `const`, or `var` keywords.       

//var, let, const

//Syntax: keyword variableName: data Type = value
//Ex:   var age: number = 25;
//Ex:   var age=30


//var age=25;
//console.log(age);

//var   vs let vs const
//-----------------------

/*
1) Scope:
2) Declaration and Initialization
3) Re-declaration
4) Re-initialization and Reassignment
5) Hoisting

*/

//var - We do not use var in TypeScript as it has function scope and can lead to unexpected behavior due to hoisting and re-declaration issues. Instead, we prefer using let and const for better scoping and immutability.

//let - We use let when we need a variable that can be reassigned. It has block scope, which means it is only accessible within the block it is defined in.     

//const - We use const when we want to declare a variable that cannot be reassigned after its initial value is set. It also has block scope. This is useful for values that should remain constant throughout the program, such as configuration settings or fixed values.

//1) Scope: Accssible area (Fuctional scope(var) & Block scope(let, const))


//Example2 1: var (function scope)
// function varExample() {
//     if (true) {
//         var x = 10; // x is accessible outside the block
//         console.log("Inside block, x =", x); // Output: Inside block, x = 10

//     }
//     console.log("Outside block, x =", x); // Output: Outside block, x = 10
// }
// varExample();


//Example2 2: let and const (block scope)

/*function blockscope() {
    if (true) {
        let y = 20; // y is only accessible within this block
        const z = 30; // z is only accessible within this block
        console.log("Inside block, y =", y); // Output: Inside block, y = 20
        console.log("Inside block, z =", z); // Output: Inside block, z = 30
    }           
     //console.log("Outside block, y =", y); // Error: y is not defined
    // console.log("Outside block, z =", z); // Error: z is not defined 
}
blockscope();
*/

//Example3:
/*
function scopeDiff() {
    if (true) {
        var a = 10; 
        let b = 20;
        const c = 30;
        console.log("Inside block, a =", a); // Output: Inside block, a = 10
        console.log("Inside block, b =", b); // Output: Inside block, b = 20            
        console.log("Inside block, c =", c); // Output: Inside block, c = 30
    }
    console.log("Outside block, a =", a); // Output: Outside block, a = 10
    // console.log("Outside block, b =", b); // Error: b is not defined
    // console.log("Outside block, c =", c); // Error: c is not defined 
}
scopeDiff();
*/

// 2) Declaration/Value Assignment

//Example1: var can be declared without initialization and can be assigned a value later. It can also be re-declared and re-assigned within the same scope, which can lead to confusion and bugs in larger codebases.

// var x;//declaration
// console.log(x); // Output: undefined

// x = 10;//initialization
// console.log(x); // Output: 10       

// //Example2: let can also be declared without initialization, but it cannot be re-declared within the same scope. It can be re-assigned, which allows for flexibility while maintaining better scoping rules.

// let y;     //declaration
// console.log(y); // Output: undefined    
// y = 20;   //initialization
// console.log(y); // Output: 20    

//Example3: const must be initialized at the time of declaration and cannot be re-assigned or re-declared. This makes it ideal for values that should remain constant throughout the program, such as configuration settings or fixed values.

// const z; // Error: Missing initializer in const declaration
// z = 30; // Error: Assignment to constant variable.       

const pi = 3.14; // Declaration and initialization
console.log(pi); // Output: 3.14        


//3) Re-declaration
//var - allows re-declaration 
//let and const - do not allow re-declaration (making code safer and easier to debug)

//Example1: var allows re-declaration
// var a = 10;
// var a = 20; // No error, re-declaration is allowed
// console.log(a); // Output: 20

//Example2: let does not allow re-declaration
// let b = 30;
// let b = 40; // Error: Identifier 'b' has already been declared
// console.log(b); // Output: 30        

//Example3: const does not allow re-declaration
// const c = 50;
// const c = 60; // Error: Identifier 'c' has already been declared
// console.log(c); // Output: 50        

//4) Re-initialization and Reassignment
//var - allows both re-initialization and reassignment
//let - allows reassignment but not re-initialization
//const - does not allow either re-initialization or reassignment

//Example1: var allows re-initialization and reassignment
// var d = 100;
// d = 200; // Reassignment is allowed
// var d = 300; // Re-initialization is allowed
// console.log(d); // Output: 300   

//Example2: let allows reassignment but not re-initialization
// let e = 400;
// e = 500; // Reassignment is allowed
// let e = 600; // Error: Identifier 'e' has already been declared
// console.log(e); // Output: 500

//example3: const does not allow either re-initialization or reassignment
// const f = 700;
// f = 800; // Error: Assignment to constant variable.
// const f = 900; // Error: Identifier 'f' has already been declared
// console.log(f); // Output: 700

//5) Hoisting
//var - variables declared with var are hoisted to the top of their scope and initialized with undefined, which can lead to unexpected behavior if you try to access them before their declaration.
//let and const - variables declared with let and const are also hoisted but are not initialized until their declaration is evaluated. This means that accessing them before their declaration will result in a ReferenceError, which helps prevent bugs and makes the code easier to debug.    

//Example1: var is hoisted and initialized with undefined
// console.log(g); // Output: undefined (due to hoisting)
// var g = 10;
//console.log(g); // Output: 10

//Example2: let is hoisted but not initialized
// console.log(h); // Error: Cannot access 'h' before initialization    
// let h = 20;  
//Example3: const is hoisted but not initialized
// console.log(i); // Error: Cannot access 'i' before initialization    
// const i = 30;
      

//