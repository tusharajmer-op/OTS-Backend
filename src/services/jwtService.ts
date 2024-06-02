import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { LOG_PRIORITY } from "../utilities/constants";

// Function to create a JWT token
const createToken = (payload: object) => {
    const secret: string = process.env.JWT_SECRET!; // Secret key for signing the token
    const expiry = process.env.JWT_EXPIRY; // Expiry time for the token
    const jwtToken = jwt.sign(payload, secret, { expiresIn: expiry }); // Sign the payload and generate the token
    return jwtToken;
};

// Function to verify a JWT token
const verifyToken = (token: string) => {
    const secret: string = process.env.JWT_SECRET!; // Secret key for verifying the token
    try {
        const payload = jwt.verify(token, secret); // Verify the token using the secret key
        return {
            success: true,
            message: 'Token Verified',
            data: [payload],
            status: 200,
            log: LOG_PRIORITY[6]
        };
    } catch (e) {
        if (e instanceof JsonWebTokenError) {
            if (e.name === 'TokenExpiredError') {
                return {
                    success: false,
                    message: e.message,
                    data: [],
                    status: 401,
                    log: LOG_PRIORITY[5]
                };
            } else if (e.name === 'JsonWebTokenError') {
                return {
                    success: false,
                    message: e.message,
                    data: [],
                    status: 401,
                    log: LOG_PRIORITY[5]
                };
            } else {
                return {
                    success: false,
                    message: e.message,
                    data: [],
                    status: 401,
                    log: LOG_PRIORITY[5]
                };
            }
        }
    }
};

export {
    createToken,
    verifyToken
};