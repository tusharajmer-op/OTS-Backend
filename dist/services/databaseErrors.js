"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseErrors = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const createResponse_1 = require("../utilities/createResponse");
// Class to handle database errors
class DatabaseErrors {
    /**
         * Handles database errors and returns an error response.
         * @param error - The database error to handle.
         * @returns An error response object.
         */
    static handleErrors(error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            // If the error is a validation error, extract the error messages and return a validation error response
            const errors = Object.values(error.errors).map(err => err.message);
            return (0, createResponse_1.createErrorResponse)(false, 'Validation Error', errors, 'Validation Error', 400, 'error');
        }
        else if (error.code === 11000) {
            // If the error is a duplicate key error, extract the duplicate key values and return a duplicate key error response
            const keys = Object.keys(error.keyValue);
            const message = keys.map(key => `${key} : ${error.keyValue[key]}`);
            return (0, createResponse_1.createErrorResponse)(false, `${message} already exists`, [error.keyValue], 'Duplicate Key Error', 400, 'error');
        }
        // If the error is not a validation error or a duplicate key error, return a generic database error response
        return (0, createResponse_1.createErrorResponse)(false, 'Database Error', [], 'Database Error', 500, 'error');
    }
}
exports.DatabaseErrors = DatabaseErrors;
