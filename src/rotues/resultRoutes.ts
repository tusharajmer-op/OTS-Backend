import { ResultController } from "../controllers";
import { NextFunction, Router,Request, Response } from "express";
import { validateIncomingRequest } from "../middlewares";
const resultController = new ResultController();
const validator = validateIncomingRequest();
const router = Router();
router.get("/test/:testId", validator, async(req : Request,res:Response,next: NextFunction) => {
    try{
        /**
         * Represents the response received from the resultController.getTestResult method.
         * 
         * @remarks
         * This variable holds the result of the test obtained from the resultController.
         */
        const response = await resultController.getTestResult(req,next);
        if(response){
            res.status(response.code).send(response);
        }
        else{
            res.status(500).send('Internal Server Error');
        }
    }catch(e){
        console.log(e);
    }
});


export default router;