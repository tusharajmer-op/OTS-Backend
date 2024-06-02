import { NextFunction, Request , Response } from "express";
import { LOG_PRIORITY } from "../utilities/constants";
import {verifyToken} from '../services/jwtService';
import ErrorHandler from "./errorhandler";
import { createErrorResponse } from "../utilities/createResponse";

/**
 * Middleware for handling authentication.
 */
class AuthMiddleware{
    private _extractHeaders(req:Request){
        const authHeader = req.headers.authorization;
        
        if(!authHeader){
            // If no authorization token is found in the headers, return an error response
            return {success : false,message : 'No authorization token found',data:[],status : 400,log : LOG_PRIORITY[5]};
        }
        const _token = authHeader.split('Bearer ')[1];
        // Extract the token from the authorization header
        return {success : true,message : '',data:[_token],status : 200,log : LOG_PRIORITY[6]};
    }
    

    private _checkToken = (token : string)=>{
        // Verify the token using the jwtService
        const _isTokenVerified = verifyToken(token);
        return _isTokenVerified;

    };
    public authMiddleware=(req : Request,res : Response , next : NextFunction)=>{
        try{
            const headers = this._extractHeaders(req);
        
            if(!headers.success){
                // If the headers extraction was not successful, create an error response and pass it to the error handler middleware
                const cerror = createErrorResponse(false,headers.message,[],'alert',headers.status,LOG_PRIORITY[3]);
                const error = ErrorHandler.customError(cerror);
                next(error);
            }
            const tokenValidity = this._checkToken(headers.data[0]);
        
            if(!tokenValidity?.success){
                // If the token is not valid, create an error response and pass it to the error handler middleware
                const cerror = createErrorResponse(false,tokenValidity!.message,[],'alert',tokenValidity!.status,LOG_PRIORITY[3]);
                const error = ErrorHandler.customError(cerror);
                next(error);
            }
            // Attach the token payload to the request body
            req.body.payload = tokenValidity?.data[0];
            next();
        }catch(e){
            // If an error occurs, log it to the console
            console.log(e);
        }
    };
    public checkAdmin(req : Request,res:Response,next : NextFunction){
        
        if(req.body.payload.role_id != 1){
            // If the user is not an admin, create an error response and pass it to the error handler middleware
            const cerror = createErrorResponse(false,'You are not authorized to visit this page',[],'alert',401,LOG_PRIORITY[3]);
            const error = ErrorHandler.customError(cerror);
            next(error);
        }
        next(); 
    }

}
export default AuthMiddleware;