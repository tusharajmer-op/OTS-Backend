"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
const userSeed_1 = __importDefault(require("./userSeed"));
const questionBankSeed_1 = __importDefault(require("./questionBankSeed"));
dotenv_1.default.config();
/**
 * The MongoDB connection URI.
 */
const uri = process.env.MONGO_URI;
/**
 * function to seed the database
 * @returns void
 * @async
 *
 */
const connectAndSeed = async (retryCount = 3) => {
    try {
        await (0, mongoose_1.connect)(uri);
        console.log("Connected to database");
        await (0, userSeed_1.default)();
        await (0, questionBankSeed_1.default)();
        (0, mongoose_1.disconnect)();
        process.exit(1);
    }
    catch (error) {
        if (retryCount > 0) {
            console.log(`Connection failed. Retrying ${retryCount} more times...`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
            connectAndSeed(retryCount - 1);
        }
        else {
            console.error("Failed to connect to database after multiple retries.");
            process.exit(1);
        }
    }
};
connectAndSeed();
