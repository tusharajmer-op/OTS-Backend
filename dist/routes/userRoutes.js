"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const authMiddleware = new middlewares_1.AuthMiddleware().authMiddleware;
const route = (0, express_1.Router)();
const userController = new controllers_1.UserController();
const requestValidator = (0, middlewares_1.validateIncomingRequest)();
route.post('/log-in', requestValidator, async (req, res, next) => {
    try {
        const response = await userController.loginUser(req, next);
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
route.post('/sign-up', requestValidator, async (req, res, next) => {
    try {
        const response = await userController.createNewUser(req, next);
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
route.post('/google-auth', requestValidator, async (req, res, next) => {
    try {
        const response = await userController.googleAuth(req, next);
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
route.get('/info', authMiddleware, async (req, res, next) => {
    try {
        /**
         * The response object returned from the getUserDetails function.
         *
         * @remarks
         * This object contains the details of the user.
         */
        const response = await userController.getUserDetails(req, next);
        if (response) {
            res.status(response.code).send(response);
        }
    }
    catch (e) {
        res.status(500).send('Internal Server Error');
    }
});
exports.default = route;
