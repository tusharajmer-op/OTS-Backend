import mongoose from 'mongoose';
import { createErrorResponse } from '../utilities/createResponse';
import { errorResponse } from '../utilities/interfaces';

// Custom interface to extend the MongoError interface
export interface MongoError extends Error {
    code?: number;
    keyValue?: Record<string, unknown>;
    errors?: Record<string, mongoose.Error.ValidatorError>;
}

// Class to handle database errors
class DatabaseErrors {
    /**
         * Handles database errors and returns an error response.
         * @param error - The database error to handle.
         * @returns An error response object.
         */
    static handleErrors(error: MongoError): errorResponse {
        if (error instanceof mongoose.Error.ValidationError) {
            // If the error is a validation error, extract the error messages and return a validation error response
            const errors = Object.values(error.errors!).map(err => err.message);
            return createErrorResponse(false, 'Validation Error', errors, 'Validation Error', 400, 'error');
        } 
        else if (error.code === 11000) {
            // If the error is a duplicate key error, extract the duplicate key values and return a duplicate key error response
            const keys = Object.keys(error.keyValue as Record<string, unknown>);
            const message = keys.map(key => `${key} : ${error.keyValue![key]}`);
            return createErrorResponse(false,`${message} already exists`, [error.keyValue], 'Duplicate Key Error', 400, 'error');
        }
        // If the error is not a validation error or a duplicate key error, return a generic database error response
        return createErrorResponse(false, 'Database Error', [], 'Database Error', 500, 'error');
    }
}

export {DatabaseErrors};
