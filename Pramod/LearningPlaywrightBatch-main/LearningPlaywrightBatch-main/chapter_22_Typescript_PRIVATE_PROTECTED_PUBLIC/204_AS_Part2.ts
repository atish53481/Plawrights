let element: unknown = {
    tagName: "Button",
    textContent: "Submit",
    id: "submit-btn",
    disabled: false
}

interface elementI { tagName: string, textContent: string, id: string, disabled: boolean };


let button = element as elementI


console.log("Tag:", button.tagName);
console.log("Text:", button.textContent);
console.log("ID:", button.id);
console.log("Disabled:", button.disabled);