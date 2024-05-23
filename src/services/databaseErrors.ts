import mongoose from 'mongoose';
import { createErrorResponse } from '../utilities/createResponse';
import { errorResponse } from '../utilities/interfaces';
export interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, mongoose.Error.ValidatorError>;
}

class DatabaseErrors {
    static handleErrors(error: MongoError): errorResponse {
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors!).map(err => err.message);
            return createErrorResponse(false, 'Validation Error', errors, 'Validation Error', 400, 'error');
        } 
        else if (error.code === 11000) {
            const keys = Object.keys(error.keyValue as Record<string, unknown>);
            const message = keys.map(key => `${key} : ${error.keyValue![key]}`);
            return createErrorResponse(false,`${message} alreadt exists`, [error.keyValue], 'Duplicate Key Error', 400, 'error');
        }
        return createErrorResponse(false, 'Database Error', [], 'Database Error', 500, 'error');
    }
}

export {DatabaseErrors};
