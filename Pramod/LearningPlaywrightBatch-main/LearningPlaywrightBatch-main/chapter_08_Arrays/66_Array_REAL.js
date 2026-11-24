const { SourceTextModule } = require("node:vm");

let browser = ['chrome', 'firefox', 'safari', 'opera', 'edge'];
console.log(browser.length);
console.log(browser);

browser.pop();
console.log(browser);

console.log("------------ TTA --------");

let removed = browser.shift();
console.log(browser);
console.log(removed);

console.log("------------ TTA --------");

for (let i = 0; i < browser.length; i++) {
    console.log(browser[i]);
    if (browser[i] === "opera") {
        console.log("Opera is removed from the selenium!");
    }
}
