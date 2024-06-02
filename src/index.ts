import express, { Errback, NextFunction, Response, Request } from "express";
import env from "dotenv";
import mongoose from "mongoose";
import { ErrorHandler } from './middlewares';
import helmet from 'helmet';
import Logger from "./services/loggerService";
import { userRoute, testRoute, resultRouter } from "./routes";
import cors, { CorsOptions } from 'cors';
env.config();
// Define allowed origins for CORS

const allowedOrigins = [process.env.ALLOWED_ORIGINS];
// Configure CORS options
const corsOptions = {
    origin: (origin: never, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
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
const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Enable helmet for security headers
app.use(helmet());

// Enable CORS with the configured options
app.use(cors(corsOptions as CorsOptions));

// Define routes
app.use('/user', userRoute);
app.use('/test', testRoute);
app.use('/result', resultRouter);

// Global error handler middleware
const globalErrorHandler = (err: Errback, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ErrorHandler) {
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
        await mongoose.connect(process.env.MONGO_URI as string);

        // Configure logger
        Logger.configure();

        console.log("Server is running on port http://localhost:"+port);
    } catch (err) {
        console.log(err);
    }
});