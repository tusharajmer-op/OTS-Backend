import {connect, disconnect} from "mongoose";
import env from "dotenv";
import userSeed from "./userSeed";
import questionBandSeed from "./questionBankSeed";
env.config();
/**
 * The MongoDB connection URI.
 */
const uri = process.env.MONGO_URI as string;

/**
 * function to seed the database
 * @returns void
 * @async
 * 
 */
const connectAndSeed = async (retryCount: number = 3) => {
    try {
        await connect(uri);
        console.log("Connected to database");
        await userSeed();
        await questionBandSeed();
        disconnect();
        process.exit(1);
    } catch (error) {
        if (retryCount > 0) {
            console.log(`Connection failed. Retrying ${retryCount} more times...`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
            connectAndSeed(retryCount - 1);
        } else {
            console.error("Failed to connect to database after multiple retries.");
            process.exit(1);
        }
    }
};

connectAndSeed();