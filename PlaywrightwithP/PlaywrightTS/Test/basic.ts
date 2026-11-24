let userName = 'Atishay';
console.log(`Hello, ${userName}`);

let a = 10;
a = 20


let x =10
x.toString


let num1: number =1;

let myName: string = 'Atishay';

let isLoggedIn: boolean = true;

let u: undefined = undefined;
let n: null = null;

let y;
console.log(y); // Output: undefined

//array

let list1 : number[] = [1, 2, 3];   
let list2 : Array<string> = ['a', 'b', 'c'];    
console.log(list1[1]);

//tuple
let person: [string, number] = ['Atishay', 25];
console.log(person[0].substring(1)); // Output: Atishay

//enum
enum Color {
    Red=5,
    Green,
    Blue
}
let c: Color = Color.Green;
console.log(c); // Output: 1


//unknown
let notSure: unknown = 4;
console.log(notSure); // Output: 4


//notSure()
//notSure.toUpperCase();


//any
let anyValue: any;
anyValue = 4;   
anyValue = 'Hello';
anyValue = true;

//anyValue()
//anyValue.toUpperCase();


//void
function myFunction(): void {
    console.log('This function does not return anything.');
} 


//union
let people: number | string;
people = 123;
people = 'Atishay';

//function 

function hello(){
    console.log('Hello, World!');
}

hello();

function sum(num1: number, num2: number) {
    return num1 + num2;
}

 
console.log(sum(5, 10)); // Output: 15






//interface
interface Employee {
    firstName: string;
    lastName: string;
    ID: number;
}

function getEmployee(empDetails: Employee) {
    console.log(empDetails.firstName);
    console.log(empDetails.lastName);
    console.log(empDetails.ID);
}

getEmployee({ firstName: 'Atishay', lastName: 'Singh', ID: 123 });


//Classes
class Person {
    name: string;
    constructor(a: string) {
        this.name = a;
    }
    hello(n: string) {  
        console.log(`Hello, ${n}!`);
    }

   hello1() {
    console.log('Hello, World!');
   }
    }

    let emp1 = new Person('Atishay');
    console.log(emp1.name); // Output: Atishay
    emp1.hello1(); // Output: Hello, Atishay!

    

    class Employee1 extends Person {
        
        constructor(name: string) {
            super(name);
        }  
        
        hello1(){
            console.log(`Hello, ${this.name}! Welcome to the company.`);
        }
            
        }

    

    let emp2 = new Employee1('JOhn Singh');
    console.log(emp2.hello1())  


