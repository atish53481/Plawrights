class Father {
    home(): void {
        console.log("2BHK");
    }
}

class Pramod extends Father {
    home(): void {
        console.log("3BHK");
    }
}

let pramod = new Pramod();
pramod.home();