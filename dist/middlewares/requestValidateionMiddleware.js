"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joiValidations_1 = require("../utilities/joiValidations");
const errorhandler_1 = __importDefault(require("./errorhandler"));
const createResponse_1 = require("../utilities/createResponse");
const constants_1 = require("../utilities/constants");
/**
 * Middleware function to validate incoming requests
 */
const validateIncomingRequest = () => {
    // Space which could be used for later logic
    const _allowedMethod = ['POST', 'PUT'];
    return (req, res, next) => {
        try {
            const _route = req.route.path;
            const _method = req.method;
            if (_allowedMethod.includes(_method)) {
                const _schema = joiValidations_1.routeToSchema[_route];
                if (!_schema) {
                    // If no schema found for the route, create an error response and pass it to the error handler
                    const cerror = (0, createResponse_1.createErrorResponse)(false, 'Something went wrong', [], 'alert', 500, constants_1.LOG_PRIORITY[3]);
                    const er = errorhandler_1.default.customError(cerror);
                    next(er);
                }
                const { error } = _schema().validate(req.body);
                if (error) {
                    // If request validation fails, create an error response and pass it to the error handler
                    let message = '';
                    message += error.details.map((item) => `${item.message}`);
                    const cerror = (0, createResponse_1.createErrorResponse)(false, 'Invalid Request', [], message, 400, constants_1.LOG_PRIORITY[5]);
                    const er = errorhandler_1.default.customError(cerror);
                    next(er);
                }
            }
            next();
        }
        catch (e) {
            // If an error occurs, log it
            const cerror = (0, createResponse_1.createErrorResponse)(false, 'Internal Server Error', [], `${e}`, 500, constants_1.LOG_PRIORITY[3]);
            const er = errorhandler_1.default.customError(cerror);
            next(er);
        }
    };
};
exports.default = validateIncomingRequest;
