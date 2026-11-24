// A call back function is a function that is passed as an argument to another function and is executed after some operation has been completed.

//Example 1:

function showMessage(message: string)
{    console.log(message);
}   

showMessage("Hello, World!");

greet("Alice", showMessage);    

function greet(name: string, callback: (message: string) => void)
{    const message = `Hello, ${name}!`;
    callback(message);
}   


//Example 2:

function displayResult(result: number):void     
{    console.log(`The result is: ${result}`);
}

Sum(5, 10, displayResult);

function Sum(a: number, b: number, callback: (result: number) => void): void
{    const result = a + b;
    callback(result);
}