let value = "5";

switch (value) {
    case 5:
        console.log("Number 5 matched");
        break;
    case "5":
        console.log("String '5' matched");
        break;
}
// Output: "String '5' matched"
// switch uses ===, so "5" !== 5 (different types)


