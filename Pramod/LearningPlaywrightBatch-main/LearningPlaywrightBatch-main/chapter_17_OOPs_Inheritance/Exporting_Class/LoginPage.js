import { BasePage } from "./Basepage.js";

export class LoginPage extends BasePage {
    constructor() {
        super("Login Page");
    }

    login(user) {
        console.log(user + " logged in");
    }
}