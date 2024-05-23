import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { LOG_PRIORITY } from "../utilities/constants";

const createToken=(payload : object)=>{
    const secret : string = process.env.JWT_SECRET!;
    const expiry = process.env.JWT_EXPIRY;
    const jwtToken = jwt.sign(payload,secret,{expiresIn:expiry});
    return jwtToken;
};

const verifyToken = (token:string) =>{
    const secret : string = process.env.JWT_SECRET!;
    try{
        const payload = jwt.verify(token,secret);
        return {success:true,message:'Token Verified',data : [payload],status : 200,log : LOG_PRIORITY[6]};
    }
    catch(e){
        if (e instanceof JsonWebTokenError){
            if(e.name === 'TokenExpiredError'){
                return {success:false,message:e.message,data : [],status : 401,log : LOG_PRIORITY[5]};
            }
            else if(e.name === 'JsonWebTokenError'){
                return {success:false,message:e.message,data : [],status : 401,log : LOG_PRIORITY[5]};
            }
            else {
                return {success:false,message:e.message,data : [],status : 401,log : LOG_PRIORITY[5]};
            }
        }
    }
};

export {
    createToken,
    verifyToken 
};