0 == ""             // true   (both convert to 0)
0 == "0"            // true   ("0" → 0)
0 == false // true
null == undefined   // true
" \t\n " == 0   // true 


//Rule breaker (all below are false)

null == 0 // false
null == "" //false
null == false //fasle
undefined == 0 //false
undefined == "" //false
undefined == false //false
NaN == NaN  //false

console.log("" === false); //false
console.log("" == false); // true
console.log(null == undefined); // true
console.log(null === undefined); // false
console.log(0 === false); // false


console.log("0" == false); //true
console.log("" == "0");  //false

let name = null;
let age;

name = "pramod";

// var p = NaN;
// p = p +10;

var a = 0 / 0;
var a1 = 0.0 / 0.0;
console.log(a);


let a2;
console.log(a2);

let a3 = null;
console.log(a3);

let red = "#880808";

let inputAge = "true";


if (inputAge == false) {
    console.log("Age is empty/invalid");  // WRONG! "0" == false is true
}