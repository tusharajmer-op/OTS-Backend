export interface apiResponse {
    status: true;
    message: string;
    data: unknown[] | Record<string ,unknown> | string | number | boolean | unknown;
    code : number;
}

export interface errorResponse {
    status : false
    message: string;
    data: unknown[] | Record<string ,unknown> | string | number | boolean | unknown;
    error: string;
    log : string;
    code : number;
}
export interface responseCodes {
    [code : string] : string;
}
