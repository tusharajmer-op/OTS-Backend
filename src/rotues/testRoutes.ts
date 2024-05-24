import { Router } from "express";
import { TestController } from "../controllers";
import { validateIncomingRequest,AuthMiddleware } from "../middlewares";
const route = Router();
const testController = new TestController();
const requestValidator = validateIncomingRequest();
const authMiddleware = new AuthMiddleware();
route.all('*',authMiddleware.authMiddleware);
route.get('/start',async (req, res,next) => {
    try{
        const response = await testController.startTest(req,next);
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch(e){
        console.log(e);
    }
});

route.post('/question/next',requestValidator,async (req, res,next) => {
    try{
        const response = await testController.nextQuestion(req,next);
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch(e){
        console.log(e);
    }
});

export default route;