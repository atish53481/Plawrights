//object - object contains proerpties and behaviour
//object contains variables and methods
//object is a collection of key-value pairs

//Ex

//employee -- name, design, sal , department, company, work() , getSalary()
//             bonus(), getdetails(), setDetails()

//student -- name, rollno, class, school, study(), getDetails(), setDetails()

//car -- make, model, year, color, start(), stop(), getDetails(), setDetails()  


//Different ways to create an object in TypeScript/ JavaScript

//1. using 'object' type - Directly define the values for variables (JS/TS)
//2. Inline Type Object - We also define the data type of the Keys and values (TS)
//3. Using Type Alias - We can create a custom type for the object and then use it to create objects (TS)
//4. Using Classes - We can define a class and then create objects from that class (JS/TS)

//1. using 'object' type- Directly define the values for variables (JS/TS)
//The TypeScript 'object' type represents any non-primitive type, which includes arrays, functions, and objects. It is a more general type that can be used to define variables that can hold any kind of object. However, it does not provide specific type information about the properties or methods of the object. 


// let employee: object = { name: "Alice", design: "Developer", sal: 50000, department: "IT", company: "TechCorp" };

// console.log(employee);

let employee: object = { name: "Alice", design: "Developer", sal: 50000, department: "IT", company: "TechCorp", getDetails: function() { return `${this.name} is a ${this.design} at ${this.company}`; } };

console.log(employee);

