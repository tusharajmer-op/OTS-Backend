import Logger from '../services/loggerService';
import { errorResponse } from '../utilities/interfaces';

// Define a class called ErrorHandler that extends the built-in Error class
class ErrorHandler extends Error {
    code: number; // Property to store the error code

    // Constructor function that takes in a message, code, and logInto parameter
    constructor(message: string, code: number = 500, logInto: string) {
        console.log(logInto); // Log the value of logInto parameter
        super(); // Call the constructor of the parent class (Error)

        this.message = message; // Set the error message
        this.code = code; // Set the error code

        // Log the error message using the Logger service
        (Logger as any)[logInto](message);
    }

    // Static method that creates a new instance of ErrorHandler with custom error properties
    static customError = (error: errorResponse) => {
        return new ErrorHandler(error.message, error.code, error.log);
    };
}

export default ErrorHandler; // Export the ErrorHandler class as the default export