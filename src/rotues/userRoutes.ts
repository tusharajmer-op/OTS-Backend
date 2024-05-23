import { Router,Request, Response, NextFunction } from "express";
import { UserController } from "../controllers";
import { validateIncomingRequest } from "../middlewares";

const route = Router();
const userController = new UserController();
const requestValidator = validateIncomingRequest();
route.post('/log-in', requestValidator,async (req : Request, res : Response,next : NextFunction) => {
    try{
        const response = await userController.loginUser(req,next);
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch(e){
        console.log(e);
    }
}); 
route.post('/sign-up', requestValidator, async (req : Request, res : Response,next : NextFunction) => {
    try{
        const response = await userController.createNewUser(req,next);
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch(e){
        console.log(e);
    }
}); 

export default route; 