import { Router,Request, Response, NextFunction } from "express";
import { UserController } from "../controllers";
import { AuthMiddleware, validateIncomingRequest } from "../middlewares";
const authMiddleware = new AuthMiddleware().authMiddleware;
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
        res.status(500).send('Internal Server Error');
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
        res.status(500).send('Internal Server Error');
    }
}); 
route.post('/google-auth', requestValidator, async (req : Request, res : Response,next : NextFunction) => {
    try{
        console.log('google-auth');
        const response = await userController.googleAuth(req,next);
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch(e){
        res.status(500).send('Internal Server Error');
    }
});

route.get('/info', authMiddleware, async (req : Request, res : Response,next : NextFunction) => {
    try{
        /**
         * The response object returned from the getUserDetails function.
         *
         * @remarks
         * This object contains the details of the user.
         */
        const response = await userController.getUserDetails(req,next);
        
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch(e){
        res.status(500).send('Internal Server Error');
    }
});

export default route; 