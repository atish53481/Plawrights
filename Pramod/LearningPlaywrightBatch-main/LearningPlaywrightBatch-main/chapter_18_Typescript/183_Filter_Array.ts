let responseCodes: number[] = [200, 201, 404, 500, 302, 403];

function getFailedCodes(codes: number[]): number[] {
    return codes.filter(function (code: number): boolean {
        return code >= 400;
    });
}
console.log("All codes:", responseCodes);
console.log("Failed codes:", getFailedCodes(responseCodes));