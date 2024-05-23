import { Redis } from "ioredis";

class RedisService {
    private redis: Redis;
    constructor() {
        const redisUrl = process.env.REDIS_URL;
        this.redis = redisUrl ? new Redis(redisUrl) : new Redis();
    }
    storeAskedQuestionIds = async (testId: string, questionId: string) => {
        try{
            const record = await this.redis.lpush(testId, questionId);
            if (record) {
                return true;
            }
        }catch(err){
            console.log(err);
        }
    };
    getAskedQuestionIds = async (testId: string) => {
        try {
            const questions = await this.redis.lrange(testId, 0, -1);
            return questions;
        } catch (err) {
            console.log(err);
        }
    };

}

export default RedisService;

