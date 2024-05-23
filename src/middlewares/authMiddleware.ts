import { NextFunction, Request , Response } from "express";
import { LOG_PRIORITY } from "../utilities/constants";
import {verifyToken} from '../services/jwtService';
import ErrorHandler from "./errorhandler";
import { createErrorResponse } from "../utilities/createResponse";

class AuthMiddleware{
    private _extractHeaders(req:Request){
        const authHeader = req.headers.authorization;
        
        if(!authHeader){
            return {success : false,message : 'No authorization token found',data:[],status : 400,log : LOG_PRIORITY[5]};
        }
        const _token = authHeader.split('Bearer ')[1];
        return {success : true,message : '',data:[_token],status : 200,log : LOG_PRIORITY[6]};
    }
    

    private _checkToken = (token : string)=>{
        const _isTokenVerified = verifyToken(token);
        return _isTokenVerified;

    };
    public authMiddleware=(req : Request,res : Response , next : NextFunction)=>{
        try{
            const headers = this._extractHeaders(req);
        
            if(!headers.success){
                const cerror = createErrorResponse(false,headers.message,[],'alert',headers.status,LOG_PRIORITY[3]);
                const error = ErrorHandler.customError(cerror);
                next(error);
            }
            const tokenValidity = this._checkToken(headers.data[0]);
        
            if(!tokenValidity?.success){
                const cerror = createErrorResponse(false,tokenValidity!.message,[],'alert',tokenValidity!.status,LOG_PRIORITY[3]);
                const error = ErrorHandler.customError(cerror);
                next(error);
            }
            req.body.payload = tokenValidity?.data[0];
            next();
        }catch(e){
            
            console.log(e);
        }
    };
    public checkAdmin(req : Request,res:Response,next : NextFunction){
        
        if(req.body.payload.role_id != 1){
            const cerror = createErrorResponse(false,'You are not authorized to visit this page',[],'alert',401,LOG_PRIORITY[3]);
            const error = ErrorHandler.customError(cerror);
            next(error);
        }
        next(); 
    }

}
export default AuthMiddleware;