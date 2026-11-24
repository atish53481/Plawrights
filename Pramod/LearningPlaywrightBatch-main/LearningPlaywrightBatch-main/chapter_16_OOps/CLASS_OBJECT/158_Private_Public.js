// Private Fields (#) — Hidden Data
// PUBIC Fields 
class Credentials {
    #apiKey;
    user;

    constructor(user, key) {
        this.user = user; // public
        this.#apiKey = key;
    }
    // Custom made fuction by us
    pramodgetAuthHeader() {
        return "Bearer " + this.#apiKey;
    }
}

let cred = new Credentials("admin", "scret_key_1234");
console.log(cred.user);
// console.log(cred.apiKey); undefined
// console.log(cred.#apiKey); //error

console.log(cred.pramodgetAuthHeader());

// cred.apiKey is undefined
// (it doesn't exist). 
// cred.#apiKey would throw a SyntaxError. 
// The ONLY way to access it is through the public method getAuthHeader()

