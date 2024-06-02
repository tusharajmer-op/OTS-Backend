import { RedisService } from "../services";

class Cat {
    private redis: RedisService;

    constructor() {
        this.redis = new RedisService();
    }

    /**
     * Set the initial rating for a test.
     * @param test_id - The ID of the test.
     * @returns A boolean indicating whether the rating was set successfully.
     */
    setInitialRating = async (test_id: string) => {
        const isSet = await this.redis.set(test_id, 5);
        return isSet;
    };

    /**
     * Get the rating for a test.
     * @param test_id - The ID of the test.
     * @returns The rating of the test.
     */
    getRating = async (test_id: string) => {
        const rating = await this.redis.get(test_id);
        return rating;
    };

    /**
     * Increase the rating for a test by 0.5.
     * @param test_id - The ID of the test.
     * @returns A boolean indicating whether the rating was increased successfully.
     */
    increaseRating = async (test_id: string) => {
        const rating = await this.redis.get(test_id);
        console.log('rating');
        console.log(rating);
        if (rating) {
            if (parseFloat(rating.toString()) === 10) {
                return true;
            }
            console.log('rating');
            const newRating = parseFloat(rating as string) + 0.5;
            console.log(parseInt(rating as string));
            const isSet = await this.redis.set(test_id, newRating);
            console.log(isSet);
            console.log(await this.redis.get(test_id));
            return isSet;
        }
    };

    /**
     * Decrease the rating for a test by 0.5.
     * @param test_id - The ID of the test.
     * @returns A boolean indicating whether the rating was decreased successfully.
     */
    decreaseRating = async (test_id: string) => {
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

export default Cat;