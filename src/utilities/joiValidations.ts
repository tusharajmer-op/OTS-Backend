import joi, { ObjectSchema } from 'joi';

// Define an interface to map routes to their corresponding validation schemas
interface IRouteToSchema {
    [key: string]: () => ObjectSchema;
}

// Define a validation schema for the signup form
const signupForm = (): ObjectSchema => {
    return joi.object({
        name: joi.string().required(), // Name is required
        email: joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(), // Email is required and should match a specific pattern
        password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/).required(), // Password is required and should meet certain criteria
    });
};

// Define a validation schema for the login form
const loginForm = (): ObjectSchema => {
    return joi.object({
        email: joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(), // Email is required and should match a specific pattern
        password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/).required(), // Password is required and should meet certain criteria
    });
};

// Define a validation schema for the question form
const questionForm = (): ObjectSchema => {
    return joi.object({
        test_id: joi.string().required(), // Test ID is required
        question_id: joi.string().required(), // Question ID is required
        answer: joi.string().allow('').required(), // Answer is required but can be an empty string
        payload: joi.object(), // Payload is an optional object
    });
};

// Define a validation schema for the Google authentication form
const googleAuthForm = (): ObjectSchema => {
    return joi.object({
        code: joi.string().required(), // Code is required
    });
};

// Map routes to their corresponding validation schemas
export const routeToSchema: IRouteToSchema = {
    "/sign-up": signupForm, // Validation schema for the signup form
    "/log-in": loginForm, // Validation schema for the login form
    "/question/next": questionForm, // Validation schema for the question form
    "/google-auth": googleAuthForm, // Validation schema for the Google authentication form
};