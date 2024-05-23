import { Router } from "express";
import { TestController } from "../controllers";
import { validateIncomingRequest,AuthMiddleware } from "../middlewares";
const route = Router();

export default route;