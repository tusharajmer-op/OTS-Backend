import { apiResponse, errorResponse } from "./interfaces";

// Function to create a successful response
/**
 * Creates a successful response object.
 * @param status - The status of the response.
 * @param message - The response message.
 * @param data - The data associated with the response.
 * @param code - The response code.
 * @returns The successful response object.
 */
export const createResponse = (status: true, message: string, data: [] | object | string | number | boolean, code: number): apiResponse => {
    return { status, message, data, code };
};

// Function to create an error response
/**
 * Creates an error response object.
 * @param status - The status of the response.
 * @param message - The error message.
 * @param data - The data associated with the error.
 * @param error - The specific error that occurred.
 * @param code - The error code.
 * @param log - Additional log information.
 * @returns The error response object.
 */
export const createErrorResponse = (status: false, message: string, data: [] | object | string | number | boolean, error: string, code: number, log: string): errorResponse => {
    return { status, message, data, error, code, log };
};