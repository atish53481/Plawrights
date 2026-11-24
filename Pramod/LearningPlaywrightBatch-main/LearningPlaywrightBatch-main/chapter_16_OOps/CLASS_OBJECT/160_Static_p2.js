class Student {
    static collegeName = "PW AT Batch";

    constructor(name) {
        this.name = name;
    }
    static display() {
        console.log(this.name + " are part of the ", Student.collegeName)
    }
}

let amit = new Student("amit");
let miti_jha = new Student("miti_jha");
let sumu = new Student("sumu");
let padmini = new Student("padmini");

console.log(Student.collegeName);
console.log(amit.name);
console.log(miti_jha.name);
