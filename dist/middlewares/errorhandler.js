"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loggerService_1 = __importDefault(require("../services/loggerService"));
// Define a class called ErrorHandler that extends the built-in Error class
class ErrorHandler extends Error {
    code; // Property to store the error code
    // Constructor function that takes in a message, code, and logInto parameter
    constructor(message, code = 500, logInto) {
        super(); // Call the constructor of the parent class (Error)
        this.message = message; // Set the error message
        this.code = code; // Set the error code
        // Log the error message using the Logger service
        loggerService_1.default[logInto](message);
    }
    // Static method that creates a new instance of ErrorHandler with custom error properties
    static customError = (error) => {
        return new ErrorHandler(error.message, error.code, error.log);
    };
}
exports.default = ErrorHandler; // Export the ErrorHandler class as the default export
