class BaseTest {
    setup() {
        console.log("Base: open browser");
    }
}

class APITest extends BaseTest {
    setup() {
        console.log("APITest: open browser");
    }
}

let test = new APITest();
test.setup(); // whoever object is present, it will call that. 