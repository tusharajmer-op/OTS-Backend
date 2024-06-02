"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeToSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Define a validation schema for the signup form
const signupForm = () => {
    return joi_1.default.object({
        name: joi_1.default.string().required(), // Name is required
        email: joi_1.default.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(), // Email is required and should match a specific pattern
        password: joi_1.default.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/).required(), // Password is required and should meet certain criteria
    });
};
// Define a validation schema for the login form
const loginForm = () => {
    return joi_1.default.object({
        email: joi_1.default.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).required(), // Email is required and should match a specific pattern
        password: joi_1.default.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/).required(), // Password is required and should meet certain criteria
    });
};
// Define a validation schema for the question form
const questionForm = () => {
    return joi_1.default.object({
        test_id: joi_1.default.string().required(), // Test ID is required
        question_id: joi_1.default.string().required(), // Question ID is required
        answer: joi_1.default.string().allow('').required(), // Answer is required but can be an empty string
        payload: joi_1.default.object(), // Payload is an optional object
    });
};
// Define a validation schema for the Google authentication form
const googleAuthForm = () => {
    return joi_1.default.object({
        code: joi_1.default.string().required(), // Code is required
    });
};
// Map routes to their corresponding validation schemas
exports.routeToSchema = {
    "/sign-up": signupForm, // Validation schema for the signup form
    "/log-in": loginForm, // Validation schema for the login form
    "/question/next": questionForm, // Validation schema for the question form
    "/google-auth": googleAuthForm, // Validation schema for the Google authentication form
};
