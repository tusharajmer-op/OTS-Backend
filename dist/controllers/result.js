"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const mongoose_1 = __importDefault(require("mongoose"));
const services_1 = require("../services");
const createResponse_1 = require("../utilities/createResponse");
const constants_1 = require("../utilities/constants");
const middlewares_1 = require("../middlewares");
class Result {
    testModel;
    userModel;
    redis;
    constructor() {
        this.testModel = new models_1.TestModel();
        this.redis = new services_1.RedisService();
        this.userModel = new models_1.UserModel();
    }
    // Method to get the test result
    getTestResult = async (req, next) => {
        try {
            // Initialize the analysis object
            const analysis = {
                test_id: new mongoose_1.default.Types.ObjectId(),
                correctToIncorrect: 0,
                score: 0,
                totalQuestions: 0,
                correctAnswers: [],
                incorrectAnswers: [],
                skippedQuestions: [],
                tagsToQuestions: {},
                difficultyToQuestions: {}
            };
            const testId = req.params.testId;
            // Check if testId is provided
            if (!testId) {
                const error = (0, createResponse_1.createErrorResponse)(false, '', [], 'Test Id is required', 400, constants_1.LOG_PRIORITY[3]);
                next(middlewares_1.ErrorHandler.customError(error));
            }
            // Fetch the test details from the database
            const response = await this.testModel.showTest(testId);
            if (!response.status) {
                const error = middlewares_1.ErrorHandler.customError(response);
                next(error);
            }
            const test = response.data;
            // Update the analysis object with test details
            analysis.totalQuestions = test.questions.length;
            analysis.test_id = new mongoose_1.default.Types.ObjectId(testId);
            analysis.correctToIncorrect = 0;
            analysis.score = test.score;
            // Iterate through each question in the test
            test.questions.forEach((question) => {
                // Update the analysis object based on the question status
                if (question.status === 'Correct') {
                    analysis.correctAnswers.push(question.questionId);
                }
                else if (question.status === 'Incorrect') {
                    analysis.incorrectAnswers.push(question.questionId);
                }
                else {
                    analysis.skippedQuestions.push(question.questionId);
                }
                // Update the analysis object with difficulty-to-questions mapping
                if (analysis.difficultyToQuestions[question.difficulty]) {
                    analysis.difficultyToQuestions[question.difficulty].push(question.questionId.toString());
                }
                else {
                    analysis.difficultyToQuestions[question.difficulty] = [question.questionId.toString()];
                }
                analysis.correctToIncorrect = analysis.correctAnswers.length / analysis.incorrectAnswers.length;
                // Check if the question has tags
                if (!question.tag) {
                    return (0, createResponse_1.createResponse)(true, 'Test Result Fetched Successfully', [analysis], 200);
                }
                // Update the analysis object with tag-to-questions mapping
                question.tag.forEach((tag) => {
                    if (analysis.tagsToQuestions[tag]) {
                        analysis.tagsToQuestions[tag].push(question.questionId.toString());
                    }
                    else {
                        analysis.tagsToQuestions[tag] = [question.questionId.toString()];
                    }
                });
            });
            analysis.correctToIncorrect = analysis.correctAnswers.length / analysis.incorrectAnswers.length;
            // Return the test result
            return (0, createResponse_1.createResponse)(true, 'Test Result Fetched Successfully', [analysis], 200);
        }
        catch (e) {
            const error = (0, createResponse_1.createErrorResponse)(false, 'Internal Server Error', [], `${e}`, 500, constants_1.LOG_PRIORITY[3]);
            next(middlewares_1.ErrorHandler.customError(error));
        }
    };
}
exports.default = Result;
