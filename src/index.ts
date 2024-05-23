import express, { Errback, NextFunction,Response,Request } from "express";
import env from "dotenv";
import mongoose from "mongoose";
import { ErrorHandler } from './middlewares';
import helmet from 'helmet';
import Logger from "./services/loggerService";
import { userRoute } from "./rotues";
env.config();
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use('/user',userRoute);
const globalErrorHandler = (err : Errback,req : Request,res : Response,next :NextFunction)=>{
    if(err instanceof ErrorHandler){
        res.status(err.code).send({success : false, message : err.message,data: []});
    }
    next();
};
app.use(globalErrorHandler);
app.listen(port, async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI as string); 
        Logger.configure();
        console.log("Server is running on port http://localhost:3000");
    }
    catch(err){
        console.log(err);
    }
    
});