"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
// Create a new router instance
const route = (0, express_1.Router)();
// Create an instance of the TestController
const testController = new controllers_1.TestController();
// Create instances of the request validator and authentication middleware
const requestValidator = (0, middlewares_1.validateIncomingRequest)();
const authMiddleware = new middlewares_1.AuthMiddleware();
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
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
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
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
exports.default = route;
