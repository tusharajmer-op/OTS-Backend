"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../schema");
const createResponse_1 = require("../utilities/createResponse");
const constants_1 = require("../utilities/constants");
class TestModel {
    testModel;
    constructor() {
        this.testModel = schema_1.testModel;
    }
    /**
     * Store a new test in the database.
     * @param data - The test data to be stored.
     * @returns A promise that resolves to the API response or an error response.
     */
    store = async (data) => {
        try {
            const test = new this.testModel(data);
            const response = await test.save();
            return (0, createResponse_1.createResponse)(true, "Test created successfully", response, 201);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "Test creation failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Update an existing test in the database.
     * @param id - The ID of the test to be updated.
     * @param data - The updated test data.
     * @returns A promise that resolves to the API response or an error response.
     */
    update = async (id, data) => {
        try {
            const response = await this.testModel.findByIdAndUpdate(id, data, { new: true });
            if (!response) {
                return (0, createResponse_1.createResponse)(true, "Test not found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "Test updated successfully", response, 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "Test update failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Fetch a test from the database.
     * @param id - The ID of the test to be fetched.
     * @returns A promise that resolves to the API response or an error response.
     */
    showTest = async (id) => {
        try {
            const response = await this.testModel.findById(id);
            if (!response) {
                return (0, createResponse_1.createErrorResponse)(false, "Test not found", [], "Test not found", 404, constants_1.LOG_PRIORITY[3]);
            }
            return (0, createResponse_1.createResponse)(true, "Test fetched successfully", response, 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "Test fetch failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Insert a question into a test.
     * @param id - The ID of the test.
     * @param questionId - The ID of the question to be inserted.
     * @returns A promise that resolves to the API response or an error response.
     */
    insertQuestion = async (id, questionId) => {
        try {
            const response = await this.testModel.findByIdAndUpdate(id, { $push: { questions: questionId } }, { new: true });
            if (!response) {
                return (0, createResponse_1.createResponse)(true, "Test not found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "Question inserted successfully", response, 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "Question insertion failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Check and store the answer to a question in a test.
     * @param id - The ID of the test.
     * @param questionId - The ID of the question.
     * @param answer - The answer to be stored.
     * @returns A promise that resolves to the API response or an error response.
     */
    checkAndStoreAnswer = async (id, questionId, answer) => {
        try {
            const response = await this.testModel.findOne({ _id: id });
            if (!response) {
                return (0, createResponse_1.createResponse)(true, "Test not found", [], 404);
            }
            let isAnswerCorrect = false;
            const updatedQuestions = response.questions.map((question) => {
                if (question.questionId.toString() === questionId.toString()) {
                    question.answer = answer;
                    if (question.answer === question.correctAnswer) {
                        question.status = "Correct";
                        response.score += question.difficulty;
                        isAnswerCorrect = true;
                    }
                    else if (question.answer === "") {
                        question.status = "Unanswered";
                        isAnswerCorrect = false;
                    }
                    else {
                        question.status = "Incorrect";
                        isAnswerCorrect = false;
                    }
                }
                return question;
            });
            response.questions = updatedQuestions;
            const savedAnswer = await response.save();
            if (!savedAnswer) {
                return (0, createResponse_1.createResponse)(true, "Answer storage failed", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "Answer stored successfully", isAnswerCorrect, 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "Answer storage failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Get the score of a test.
     * @param id - The ID of the test.
     * @returns A promise that resolves to the API response or an error response.
     */
    getTestScore = async (id) => {
        try {
            const response = await this.testModel.findById(id);
            if (!response) {
                return (0, createResponse_1.createResponse)(true, "Test not found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "Test fetched successfully", response.score, 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "Test fetch failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
}
exports.default = TestModel;
