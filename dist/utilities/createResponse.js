"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorResponse = exports.createResponse = void 0;
// Function to create a successful response
/**
 * Creates a successful response object.
 * @param status - The status of the response.
 * @param message - The response message.
 * @param data - The data associated with the response.
 * @param code - The response code.
 * @returns The successful response object.
 */
const createResponse = (status, message, data, code) => {
    return { status, message, data, code };
};
exports.createResponse = createResponse;
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
const createErrorResponse = (status, message, data, error, code, log) => {
    return { status, message, data, error, code, log };
};
exports.createErrorResponse = createErrorResponse;
