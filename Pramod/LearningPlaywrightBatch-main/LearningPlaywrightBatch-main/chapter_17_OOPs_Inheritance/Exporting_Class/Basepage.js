export class BasePage {
    constructor(name) {
        this.name = name;
    }

    open() {
        console.log("Opening " + this.name);
    }
}