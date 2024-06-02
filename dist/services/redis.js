"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = require("ioredis");
class RedisService {
    redis;
    /**
     * Constructs a new instance of the RedisService class.
     */
    constructor() {
        const redisUrl = process.env.REDIS_URL;
        try {
            this.redis = redisUrl ? new ioredis_1.Redis(redisUrl) : new ioredis_1.Redis();
        }
        catch (err) {
            console.log(err);
        }
        this.redis = redisUrl ? new ioredis_1.Redis(redisUrl) : new ioredis_1.Redis();
    }
    /**
     * Stores the asked question IDs for a given test ID.
     * @param testId - The ID of the test.
     * @param questionId - The ID of the question.
     * @returns A boolean indicating whether the operation was successful.
     */
    storeAskedQuestionIds = async (testId, questionId) => {
        try {
            const record = await this.redis.lpush(testId, questionId);
            if (record) {
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    };
    /**
     * Retrieves the asked question IDs for a given test ID.
     * @param testId - The ID of the test.
     * @returns An array of question IDs.
     */
    getAskedQuestionIds = async (testId) => {
        try {
            const questions = await this.redis.lrange(testId, 0, -1);
            return questions;
        }
        catch (err) {
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
    set = async (key, value, addOnString = 'rating') => {
        try {
            const record = await this.redis.set(key + addOnString, value);
            if (record) {
                return true;
            }
            return false;
        }
        catch (err) {
            return false;
        }
    };
    /**
     * Retrieves the value for a given key from Redis.
     * @param key - The key to retrieve.
     * @param addOnString - An optional string to append to the key.
     * @returns The value associated with the key, or null if not found.
     */
    get = async (key, addOnString = 'rating') => {
        try {
            const value = await this.redis.get(key + addOnString);
            return value;
        }
        catch (err) {
            return null;
        }
    };
}
exports.default = RedisService;
