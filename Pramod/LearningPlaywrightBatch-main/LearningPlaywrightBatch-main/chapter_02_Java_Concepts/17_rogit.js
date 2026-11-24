let a = 10
console.log(a)
if (true){ 
    console.log(a); //TDZ
    let a = 20;
}