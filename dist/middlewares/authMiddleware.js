"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utilities/constants");
const jwtService_1 = require("../services/jwtService");
const errorhandler_1 = __importDefault(require("./errorhandler"));
const createResponse_1 = require("../utilities/createResponse");
/**
 * Middleware for handling authentication.
 */
class AuthMiddleware {
    _extractHeaders(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            // If no authorization token is found in the headers, return an error response
            return { success: false, message: 'No authorization token found', data: [], status: 400, log: constants_1.LOG_PRIORITY[5] };
        }
        const _token = authHeader.split('Bearer ')[1];
        // Extract the token from the authorization header
        return { success: true, message: '', data: [_token], status: 200, log: constants_1.LOG_PRIORITY[6] };
    }
    _checkToken = (token) => {
        // Verify the token using the jwtService
        const _isTokenVerified = (0, jwtService_1.verifyToken)(token);
        return _isTokenVerified;
    };
    authMiddleware = (req, res, next) => {
        try {
            const headers = this._extractHeaders(req);
            if (!headers.success) {
                // If the headers extraction was not successful, create an error response and pass it to the error handler middleware
                const cerror = (0, createResponse_1.createErrorResponse)(false, headers.message, [], 'alert', headers.status, constants_1.LOG_PRIORITY[3]);
                const error = errorhandler_1.default.customError(cerror);
                next(error);
            }
            const tokenValidity = this._checkToken(headers.data[0]);
            if (!tokenValidity?.success) {
                // If the token is not valid, create an error response and pass it to the error handler middleware
                const cerror = (0, createResponse_1.createErrorResponse)(false, tokenValidity.message, [], 'alert', tokenValidity.status, constants_1.LOG_PRIORITY[3]);
                const error = errorhandler_1.default.customError(cerror);
                next(error);
            }
            // Attach the token payload to the request body
            req.body.payload = tokenValidity?.data[0];
            next();
        }
        catch (e) {
            // If an error occurs, log it
            const cerror = (0, createResponse_1.createErrorResponse)(false, 'Internal Server Error', [], `${e}`, 500, constants_1.LOG_PRIORITY[3]);
            const error = errorhandler_1.default.customError(cerror);
            next(error);
        }
    };
    checkAdmin(req, res, next) {
        if (req.body.payload.role_id != 1) {
            // If the user is not an admin, create an error response and pass it to the error handler middleware
            const cerror = (0, createResponse_1.createErrorResponse)(false, 'You are not authorized to visit this page', [], 'alert', 401, constants_1.LOG_PRIORITY[3]);
            const error = errorhandler_1.default.customError(cerror);
            next(error);
        }
        next();
    }
}
exports.default = AuthMiddleware;
