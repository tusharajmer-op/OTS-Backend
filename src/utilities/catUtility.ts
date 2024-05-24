import { RedisService } from "../services";

class cat{
    private redis : RedisService;
    constructor(){
        this.redis = new RedisService();
    }
    setInitialRating = async (user_id : string) =>{
        const isSet = await this.redis.set(user_id, 5);
        return isSet;
    };

    
}