"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
class Cat {
    redis;
    constructor() {
        this.redis = new services_1.RedisService();
    }
    /**
     * Set the initial rating for a test.
     * @param test_id - The ID of the test.
     * @returns A boolean indicating whether the rating was set successfully.
     */
    setInitialRating = async (test_id) => {
        const isSet = await this.redis.set(test_id, 5);
        return isSet;
    };
    /**
     * Get the rating for a test.
     * @param test_id - The ID of the test.
     * @returns The rating of the test.
     */
    getRating = async (test_id) => {
        const rating = await this.redis.get(test_id);
        return rating;
    };
    /**
     * Increase the rating for a test by 0.5.
     * @param test_id - The ID of the test.
     * @returns A boolean indicating whether the rating was increased successfully.
     */
    increaseRating = async (test_id) => {
        const rating = await this.redis.get(test_id);
        if (rating) {
            if (parseFloat(rating.toString()) === 10) {
                return true;
            }
            const newRating = parseFloat(rating) + 0.5;
            const isSet = await this.redis.set(test_id, newRating);
            return isSet;
        }
    };
    /**
     * Decrease the rating for a test by 0.5.
     * @param test_id - The ID of the test.
     * @returns A boolean indicating whether the rating was decreased successfully.
     */
    decreaseRating = async (test_id) => {
        const rating = await this.redis.get(test_id);
        if (rating) {
            if (parseFloat(rating.toString()) === 1) {
                return true;
            }
            const newRating = parseFloat(rating.toString()) - 0.5;
            const isSet = await this.redis.set(test_id, newRating);
            return isSet;
        }
    };
}
exports.default = Cat;
