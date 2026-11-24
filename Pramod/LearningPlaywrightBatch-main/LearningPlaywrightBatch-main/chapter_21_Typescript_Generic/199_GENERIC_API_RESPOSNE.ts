function wrapResponse<T>(statusCode: number, data: T): { statusCode: number; data: T } {
    return { statusCode: statusCode, data: data };
}

let userResp = wrapResponse<string>(200, "admin");
console.log(userResp);

let flagResp = wrapResponse<boolean>(200, true);
console.log(flagResp);

let countResp = wrapResponse<number>(200, 42);
console.log(countResp);