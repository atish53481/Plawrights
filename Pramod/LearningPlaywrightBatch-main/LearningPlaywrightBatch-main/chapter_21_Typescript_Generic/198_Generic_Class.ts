class TestDataStorage<T> {
    private items: T[] = [];

    add(item: T): void {
        this.items.push(item);
    }

    getFirst(): T {
        return this.items[0]!;
    }

    getAll(): T[] {
        return this.items;
    }

    count(): number {
        return this.items.length;
    }

}
let codeStore = new TestDataStorage<number>();
let testStore = new TestDataStorage<string>();

codeStore.add(200);
codeStore.add(404);
codeStore.add(500);

testStore.add("Login Test");
testStore.add("Checkout Test");

console.log("Codes:", codeStore.getAll());
console.log("First code:", codeStore.getFirst());
console.log("Tests:", testStore.getAll());
console.log("Test count:", testStore.count());