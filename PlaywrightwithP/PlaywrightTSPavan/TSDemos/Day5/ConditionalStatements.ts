//if condition

/*

if(condition){
    //code to be executed if condition is true
}   
else{
    //code to be executed if condition is false
}   
*/

//Example 1: Check if a number is positive or negative
let number: number = -10;       
if (number > 0) {
    console.log("The number is positive.");
}
else if (number < 0) {
    console.log("The number is negative.");
}   


//Example 2: Check if a person is eligible to vote

let age: number = 18;
if (age >= 18) {
    console.log("You are eligible to vote.");
}
else {
    console.log("You are not eligible to vote.");
}

//Example 3: Check if a number is even or odd

let num1: number = 7;
if (num1 % 2 === 0) {
    console.log("The number is even.");
}
else {
    console.log("The number is odd.");
}   


//Nested if statements

let score: number = 85;
if (score >= 90) {
    console.log("Grade: A");
}
else if (score >= 80) {
    console.log("Grade: B");    
}
else if (score >= 70) {
    console.log("Grade: C");
}
else if (score >= 60) {
    console.log("Grade: D");
}
else {
    console.log("Grade: F");
}   


//Example 4: Depending on marks, determine the grade of a student

let marks: number = 75;     
if (marks >= 90) {
    console.log("Grade: A");
}
else if (marks >= 80) {
    console.log("Grade: B");
}
else if (marks >= 70) {
    console.log("Grade: C");
}
else if (marks >= 60) {
    console.log("Grade: D");
}
else {
    console.log("Grade: F");
}


//Example 5: browser selection using if-else statements

let browser: string = "Chrome"; 
if (browser === "Chrome") {
    console.log("You are using Google Chrome.");
}
else if (browser === "Firefox") {
    console.log("You are using Mozilla Firefox.");
}
else if (browser === "Edge") {
    console.log("You are using Microsoft Edge.");
}
else if (browser === "Safari") {
    console.log("You are using Apple Safari.");
}
else {
    console.log("Browser not recognized.");
}


//switch statement

/*
switch(expression){
    case value1:
        //code to be executed if expression matches value1
        break;
    case value2:
        //code to be executed if expression matches value2
        break;
    ...
    default:
        //code to be executed if expression doesn't match any case
}
*/      

//Example 6: Browser selection using switch statement
let browserType: string = "Firefox";
switch (browserType) {
    case "Chrome":
        console.log("You are using Google Chrome.");
        break;
    case "Firefox":
        console.log("You are using Mozilla Firefox.");
        break;
    case "Edge":
        console.log("You are using Microsoft Edge.");
        break;
    case "Safari":
        console.log("You are using Apple Safari.");
        break;
    default:
        console.log("Browser not recognized.");
}
