"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema_1 = require("./../schema");
const createResponse_1 = require("../utilities/createResponse");
const constants_1 = require("../utilities/constants");
/**
 * Represents a Question Model.
 */
class QuestionModel {
    questionModel;
    constructor() {
        this.questionModel = schema_1.questionModel;
    }
    /**
     * Fetches all questions.
     * @returns A promise that resolves to an API response or an error response.
     */
    index = async () => {
        try {
            const response = await this.questionModel.find();
            return (0, createResponse_1.createResponse)(true, "Questions fetched successfully", response, 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "Questions fetch failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Stores a new question.
     * @param data - The question data to be stored.
     * @returns A promise that resolves to an API response or an error response.
     */
    store = async (data) => {
        try {
            const user = new this.questionModel(data);
            const response = await user.save();
            return (0, createResponse_1.createResponse)(true, "Question Added successfully", response, 201);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "User creation failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Updates a question by ID.
     * @param data - The updated question data.
     * @param id - The ID of the question to be updated.
     * @returns A promise that resolves to an API response or an error response.
     */
    update = async (data, id) => {
        try {
            const newQuestion = await this.questionModel.findByIdAndUpdate(id, data, { new: true });
            if (!newQuestion) {
                return (0, createResponse_1.createResponse)(true, "Question not found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "Question Updated Successfully", newQuestion, 200);
        }
        catch (err) {
            return (0, createResponse_1.createErrorResponse)(false, "Question update failed", [], `${err}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Deletes a question by ID.
     * @param id - The ID of the question to be deleted.
     * @returns A promise that resolves to an API response or an error response.
     */
    delete = async (id) => {
        try {
            const deletedQuestion = await this.questionModel.findByIdAndDelete(id, { new: true });
            if (!deletedQuestion)
                return (0, createResponse_1.createResponse)(true, "", [], 200);
            return (0, createResponse_1.createResponse)(true, "Question not found", deletedQuestion, 200);
        }
        catch (err) {
            return (0, createResponse_1.createErrorResponse)(false, "Question Deletion failed", [], `${err}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Gets a unique question by difficulty and excludes already asked questions.
     * @param difficulty - The difficulty level of the question.
     * @param alreadyAskedQuestionList - The list of already asked question IDs.
     * @returns A promise that resolves to an API response or an error response.
     */
    getUniqueQuestionByTag = async (difficulty, alreadyAskedQuestionList) => {
        try {
            const alreadyAskedQuestionIds = alreadyAskedQuestionList.map((question) => new mongoose_1.default.Types.ObjectId(question));
            const question = await this.questionModel.find({ difficulty: difficulty, _id: { $nin: alreadyAskedQuestionIds } }).exec();
            if (question.length === 0) {
                return (0, createResponse_1.createResponse)(true, "No Question Found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "Questions fetched successfully", question, 200);
        }
        catch (err) {
            return (0, createResponse_1.createErrorResponse)(false, "Questions fetch failed", [], `${err}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Gets a question by ID.
     * @param id - The ID of the question to be fetched.
     * @returns A promise that resolves to an API response or an error response.
     */
    getQuestionById = async (id) => {
        try {
            const question = await this.questionModel.findById(id);
            if (!question) {
                return (0, createResponse_1.createResponse)(true, "No Question Found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "Question fetched successfully", question, 200);
        }
        catch (err) {
            return (0, createResponse_1.createErrorResponse)(false, "Question fetch failed", [], `${err}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
}
exports.default = QuestionModel;
