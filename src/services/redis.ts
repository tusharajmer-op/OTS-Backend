import { Redis } from "ioredis";

class RedisService {
    private redis: Redis;
    constructor() {
        const redisUrl = process.env.REDIS_URL;
        this.redis = redisUrl ? new Redis(redisUrl) : new Redis();
    }


}

