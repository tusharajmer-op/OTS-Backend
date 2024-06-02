import { Redis } from "ioredis";

class RedisService {
    private redis: Redis;

    /**
     * Constructs a new instance of the RedisService class.
     */
    constructor() {
        const redisUrl = process.env.REDIS_URL;
        this.redis = redisUrl ? new Redis(redisUrl) : new Redis();
    }

    /**
     * Stores the asked question IDs for a given test ID.
     * @param testId - The ID of the test.
     * @param questionId - The ID of the question.
     * @returns A boolean indicating whether the operation was successful.
     */
    storeAskedQuestionIds = async (testId: string, questionId: string): Promise<boolean> => {
        try {
            const record = await this.redis.lpush(testId, questionId);
            if (record) {
                return true;
            }
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    /**
     * Retrieves the asked question IDs for a given test ID.
     * @param testId - The ID of the test.
     * @returns An array of question IDs.
     */
    getAskedQuestionIds = async (testId: string): Promise<string[]> => {
        try {
            const questions = await this.redis.lrange(testId, 0, -1);
            return questions;
        } catch (err) {
            console.log(err);
            return [];
        }
    };

    /**
     * Sets a key-value pair in Redis.
     * @param key - The key to set.
     * @param value - The value to set.
     * @param addOnString - An optional string to append to the key.
     * @returns A boolean indicating whether the operation was successful.
     */
    set = async (key: string, value: string | number, addOnString = 'rating'): Promise<boolean> => {
        try {
            const record = await this.redis.set(key + addOnString, value);
            if (record) {
                return true;
            }
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    /**
     * Retrieves the value for a given key from Redis.
     * @param key - The key to retrieve.
     * @param addOnString - An optional string to append to the key.
     * @returns The value associated with the key, or null if not found.
     */
    get = async (key: string, addOnString = 'rating'): Promise<string | number | null> => {
        try {
            const value = await this.redis.get(key + addOnString);
            return value;
        } catch (err) {
            console.log(err);
            return null;
        }
    };
}

export default RedisService;
