"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const services_1 = require("../services");
const hashing_1 = require("../utilities/hashing");
const middlewares_1 = require("../middlewares");
const createResponse_1 = require("../utilities/createResponse");
const constants_1 = require("../utilities/constants");
const services_2 = require("../services");
class UserController {
    UserModel = new models_1.UserModel();
    // Create a new user
    createNewUser = async (req, next) => {
        try {
            const userDetails = req.body;
            const hashedPassword = await (0, hashing_1.encryptData)(req.body.password);
            userDetails['password'] = hashedPassword;
            userDetails['tests'] = [];
            const response = await this.UserModel.store(userDetails);
            if (response.status) {
                const [user] = response.data;
                const jwt = (0, services_1.createToken)({ "user_id": user.id, "role_id": user.role });
                user.token = jwt;
                const userWithoutSensitiveFields = { "id": user.id?.toString(), "role": user.role, "email": user.email, "name": user.name };
                const verifiedUser = { "data": userWithoutSensitiveFields, "token": jwt };
                return (0, createResponse_1.createResponse)(true, 'User Created Successfully', [verifiedUser], 201);
            }
            else {
                const error = middlewares_1.ErrorHandler.customError(response);
                next(error);
            }
        }
        catch (e) {
            const err = (0, createResponse_1.createErrorResponse)(false, 'Internal Server Error', [], `${e}`, 500, constants_1.LOG_PRIORITY[3]);
            next(err);
        }
    };
    // Login a user
    loginUser = async (req, next) => {
        try {
            const { email, password } = req.body;
            const response = await this.UserModel.getUserByEmail(email);
            if (response.code === 200) {
                const [user] = response.data;
                if (user.oauthLogin) {
                    const error = (0, createResponse_1.createErrorResponse)(false, 'Invalid Credentials', [], 'Invalid Credentials', 401, constants_1.LOG_PRIORITY[3]);
                    next(middlewares_1.ErrorHandler.customError(error));
                }
                const isPasswordValid = await (0, hashing_1.compareData)(password, user.password);
                if (isPasswordValid) {
                    const jwt = (0, services_1.createToken)({ "user_id": user.id, "role_id": user.role });
                    const userWithoutSensitiveFields = { "id": user.id?.toString(), "role": user.role, "email": user.email, "name": user.name };
                    const verifiedUser = { "data": userWithoutSensitiveFields, "token": jwt };
                    return (0, createResponse_1.createResponse)(true, 'User Logged In Successfully', [verifiedUser], 200);
                }
                else {
                    const invalidPasswordError = (0, createResponse_1.createErrorResponse)(false, 'Invalid Credentials', [], 'Invalid Credentials', 401, constants_1.LOG_PRIORITY[3]);
                    next(middlewares_1.ErrorHandler.customError(invalidPasswordError));
                }
            }
            else {
                if (response.status)
                    return response;
                const error = middlewares_1.ErrorHandler.customError(response);
                next(error);
            }
        }
        catch (e) {
            const err = (0, createResponse_1.createErrorResponse)(false, 'Internal Server Error', [], `${e}`, 500, constants_1.LOG_PRIORITY[3]);
            next(err);
        }
    };
    // Authenticate with Google
    googleAuth = async (req, next) => {
        const code = req.body.code;
        if (!code) {
            const error = (0, createResponse_1.createErrorResponse)(false, 'Invalid Code', [], 'Invalid Code', 400, constants_1.LOG_PRIORITY[3]);
            next(middlewares_1.ErrorHandler.customError(error));
        }
        const googleRes = await (0, services_2.oauth2Client)().getToken(code);
        (0, services_2.oauth2Client)().setCredentials(googleRes.tokens);
        const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
        const googleUser = await googleResponse.json();
        const email = googleUser.email;
        const response = await this.UserModel.getUserByEmail(email);
        if (response.code === 200) {
            const [user] = response.data;
            const jwt = (0, services_1.createToken)({ "user_id": user.id, "role_id": user.role });
            const userWithoutSensitiveFields = { "id": user.id?.toString(), "role": user.role, "email": user.email, "name": user.name };
            const verifiedUser = { "data": userWithoutSensitiveFields, "token": jwt };
            return (0, createResponse_1.createResponse)(true, 'User Logged In Successfully', [verifiedUser], 200);
        }
        else {
            const createUser = {
                name: googleUser.name,
                email: googleUser.email,
                password: '',
                role: 'user',
                tests: [],
                oauthLogin: true,
                created_at: new Date(),
                updated_at: new Date()
            };
            const response = await this.UserModel.store(createUser);
            if (response.status) {
                const [user] = response.data;
                const jwt = (0, services_1.createToken)({ "user_id": user.id, "role_id": user.role });
                user.token = jwt;
                const userWithoutSensitiveFields = { "id": user.id?.toString(), "role": user.role, "email": user.email, "name": user.name };
                const verifiedUser = { "data": userWithoutSensitiveFields, "token": jwt };
                return (0, createResponse_1.createResponse)(true, 'User Logged In Successfully', [verifiedUser], 200);
            }
            else {
                const error = middlewares_1.ErrorHandler.customError(response);
                next(error);
            }
        }
    };
    // Get user details
    getUserDetails = async (req, next) => {
        try {
            const user = req.body.payload.user_id;
            const userDetails = await this.UserModel.getUserById(user);
            if (userDetails.code === 404) {
                const error = (0, createResponse_1.createErrorResponse)(false, 'User Not Found', [], 'User Not Found', 404, constants_1.LOG_PRIORITY[3]);
                next(middlewares_1.ErrorHandler.customError(error));
            }
            return userDetails;
        }
        catch (e) {
            const err = (0, createResponse_1.createErrorResponse)(false, 'Internal Server Error', [], `${e}`, 500, constants_1.LOG_PRIORITY[3]);
            next(err);
        }
    };
}
exports.default = UserController;
