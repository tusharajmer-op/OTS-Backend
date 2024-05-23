import { apiResponse,errorResponse } from "./interfaces";

export const createResponse = (status: true, message: string, data: [] | object | string | number | boolean,code : number): apiResponse => {
    return { status, message, data,code };
};

export const createErrorResponse = (status: false, message: string, data: [] | object | string | number | boolean, error: string, code: number, log: string): errorResponse => {
    return {status, message, data, error, code, log };
};