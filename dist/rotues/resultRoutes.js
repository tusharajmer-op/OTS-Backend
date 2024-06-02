"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const controllers_1 = require("../controllers");
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const resultController = new controllers_1.ResultController();
const validator = (0, middlewares_1.validateIncomingRequest)();
const authMiddleware = new middlewares_1.AuthMiddleware();
const router = (0, express_1.Router)();
router.all('*', authMiddleware.authMiddleware);
// Apply the authentication middleware to all routes
router.get("/test/:testId", validator, async (req, res, next) => {
    try {
        /**
         * Represents the response received from the resultController.getTestResult method.
         *
         * @remarks
         * This variable holds the result of the test obtained from the resultController.
         */
        const response = await resultController.getTestResult(req, next);
        if (response) {
            res.status(response.code).send(response);
        }
        else {
            res.status(500).send('Internal Server Error');
        }
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
exports.default = router;
