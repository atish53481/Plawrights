function Log(target: any, methodName: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`Called ${methodName} with args:`, args);
        return original.apply(this, args);
    };
}

class Calculator {
    @Log
    add(a: number, b: number) {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(2, 3);