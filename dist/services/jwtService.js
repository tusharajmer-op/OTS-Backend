"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const constants_1 = require("../utilities/constants");
// Function to create a JWT token
const createToken = (payload) => {
    const secret = process.env.JWT_SECRET; // Secret key for signing the token
    const expiry = process.env.JWT_EXPIRY; // Expiry time for the token
    const jwtToken = jsonwebtoken_1.default.sign(payload, secret, { expiresIn: expiry }); // Sign the payload and generate the token
    return jwtToken;
};
exports.createToken = createToken;
// Function to verify a JWT token
const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET; // Secret key for verifying the token
    try {
        const payload = jsonwebtoken_1.default.verify(token, secret); // Verify the token using the secret key
        return {
            success: true,
            message: 'Token Verified',
            data: [payload],
            status: 200,
            log: constants_1.LOG_PRIORITY[6]
        };
    }
    catch (e) {
        if (e instanceof jsonwebtoken_1.JsonWebTokenError) {
            if (e.name === 'TokenExpiredError') {
                return {
                    success: false,
                    message: e.message,
                    data: [],
                    status: 401,
                    log: constants_1.LOG_PRIORITY[5]
                };
            }
            else if (e.name === 'JsonWebTokenError') {
                return {
                    success: false,
                    message: e.message,
                    data: [],
                    status: 401,
                    log: constants_1.LOG_PRIORITY[5]
                };
            }
            else {
                return {
                    success: false,
                    message: e.message,
                    data: [],
                    status: 401,
                    log: constants_1.LOG_PRIORITY[5]
                };
            }
        }
    }
};
exports.verifyToken = verifyToken;
