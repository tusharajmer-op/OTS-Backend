import { Router } from "express";
import { TestController } from "../controllers";
import { validateIncomingRequest, AuthMiddleware } from "../middlewares";

// Create a new router instance
const route = Router();

// Create an instance of the TestController
const testController = new TestController();

// Create instances of the request validator and authentication middleware
const requestValidator = validateIncomingRequest();
const authMiddleware = new AuthMiddleware();

// Apply the authentication middleware to all routes
route.all('*', authMiddleware.authMiddleware);

/**
 * Route handler for the '/start' endpoint
 * Starts the test and sends the response
 */
route.get('/start', async (req, res, next) => {
    try {
        const response = await testController.startTest(req, next);
        if (response) {
            res.status(response.code).send(response);
        }
    } catch (e) {
        console.log(e);
    }
});

/**
 * Route handler for the '/question/next' endpoint
 * Validates the incoming request, retrieves the next question, and sends the response
 */
route.post('/question/next', requestValidator, async (req, res, next) => {
    try {
        const response = await testController.nextQuestion(req, next);
        if (response) {
            res.status(response.code).send(response);
        }
    } catch (e) {
        console.log(e);
    }
});

export default route;