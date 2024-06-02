"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const middlewares_1 = require("./middlewares");
const helmet_1 = __importDefault(require("helmet"));
const loggerService_1 = __importDefault(require("./services/loggerService"));
const routes_1 = require("./routes");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
// Define allowed origins for CORS
const allowedOrigins = [process.env.ALLOWED_ORIGINS];
// Configure CORS options
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
// Load environment variables from .env file
// Set the port for the server
const port = process.env.PORT || 3000;
// Create an instance of Express
const app = (0, express_1.default)();
// Parse JSON request bodies
app.use(express_1.default.json());
// Parse URL-encoded request bodies
app.use(express_1.default.urlencoded({ extended: true }));
// Enable helmet for security headers
app.use((0, helmet_1.default)());
// Enable CORS with the configured options
app.use((0, cors_1.default)(corsOptions));
// Define routes
app.use('/user', routes_1.userRoute);
app.use('/test', routes_1.testRoute);
app.use('/result', routes_1.resultRouter);
// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof middlewares_1.ErrorHandler) {
        res.status(err.code).send({ success: false, message: err.message, data: [] });
    }
    next();
};
// Use the global error handler middleware
app.use(globalErrorHandler);
// Start the server
app.listen(port, async () => {
    try {
        // Connect to MongoDB
        await mongoose_1.default.connect(process.env.MONGO_URI);
        // Configure logger
        loggerService_1.default.configure();
        console.log("Server is running on port http://localhost:" + port);
    }
    catch (err) {
        console.log(err);
    }
});
