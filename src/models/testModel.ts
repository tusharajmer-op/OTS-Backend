import mongoose, { Model } from "mongoose";
import { testModel, ITest, IAskedQuestion } from "../schema";
import { createErrorResponse, createResponse } from "../utilities/createResponse";
import { apiResponse, errorResponse } from "../utilities/interfaces";
import { LOG_PRIORITY } from "../utilities/constants";

class TestModel {
    testModel: Model<ITest>;

    constructor() {
        this.testModel = testModel;
    }

    /**
     * Store a new test in the database.
     * @param data - The test data to be stored.
     * @returns A promise that resolves to the API response or an error response.
     */
    store = async (data: ITest): Promise<apiResponse | errorResponse> => {
        try {
            console.log(data);
            const test = new this.testModel(data);
            const response = await test.save();
            console.log(response);
            return createResponse(true, "Test created successfully", response, 201);
        } catch (error) {
            return createErrorResponse(false, "Test creation failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Update an existing test in the database.
     * @param id - The ID of the test to be updated.
     * @param data - The updated test data.
     * @returns A promise that resolves to the API response or an error response.
     */
    update = async (id: string, data: ITest): Promise<apiResponse | errorResponse> => {
        try {
            const response = await this.testModel.findByIdAndUpdate(id, data, { new: true });
            if (!response) {
                return createResponse(true, "Test not found", [], 404);
            }
            return createResponse(true, "Test updated successfully", response, 200);
        } catch (error) {
            return createErrorResponse(false, "Test update failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Fetch a test from the database.
     * @param id - The ID of the test to be fetched.
     * @returns A promise that resolves to the API response or an error response.
     */
    showTest = async (id: string): Promise<apiResponse | errorResponse> => {
        try {
            const response = await this.testModel.findById(id);
            if (!response) {
                return createErrorResponse(false, "Test not found", [], "Test not found", 404, LOG_PRIORITY[3]);
            }
            return createResponse(true, "Test fetched successfully", response, 200);
        } catch (error) {
            return createErrorResponse(false, "Test fetch failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Insert a question into a test.
     * @param id - The ID of the test.
     * @param questionId - The ID of the question to be inserted.
     * @returns A promise that resolves to the API response or an error response.
     */
    insertQuestion = async (id: string, questionId: IAskedQuestion): Promise<apiResponse | errorResponse> => {
        try {
            const response = await this.testModel.findByIdAndUpdate(id, { $push: { questions: questionId } }, { new: true });
            if (!response) {
                return createResponse(true, "Test not found", [], 404);
            }
            return createResponse(true, "Question inserted successfully", response, 200);
        } catch (error) {
            return createErrorResponse(false, "Question insertion failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Check and store the answer to a question in a test.
     * @param id - The ID of the test.
     * @param questionId - The ID of the question.
     * @param answer - The answer to be stored.
     * @returns A promise that resolves to the API response or an error response.
     */
    checkAndStoreAnswer = async (id: mongoose.Types.ObjectId, questionId: mongoose.Types.ObjectId, answer: string): Promise<apiResponse | errorResponse> => {
        try {
            const response = await this.testModel.findOne({ _id: id });
            if (!response) {
                return createResponse(true, "Test not found", [], 404);
            }
            let isAnswerCorrect = false;
            const updatedQuestions = response.questions.map((question) => {
                if (question.questionId.toString() === questionId.toString()) {
                    console.log(question.answer);
                    question.answer = answer;
                    if (question.answer === question.correctAnswer) {
                        question.status = "Correct";
                        response.score += question.difficulty;
                        isAnswerCorrect = true;
                    } else if (question.answer === "") {
                        question.status = "Unanswered";
                        isAnswerCorrect = false;
                    } else {
                        question.status = "Incorrect";
                        isAnswerCorrect = false;
                    }
                }
                return question;
            });
            response.questions = updatedQuestions;
            const savedAnswer = await response.save();
            if (!savedAnswer) {
                return createResponse(true, "Answer storage failed", [], 404);
            }
            return createResponse(true, "Answer stored successfully", isAnswerCorrect, 200);
        } catch (error) {
            return createErrorResponse(false, "Answer storage failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Get the score of a test.
     * @param id - The ID of the test.
     * @returns A promise that resolves to the API response or an error response.
     */
    getTestScore = async (id: string): Promise<apiResponse | errorResponse> => {
        try {
            const response = await this.testModel.findById(id);
            if (!response) {
                return createResponse(true, "Test not found", [], 404);
            }
            return createResponse(true, "Test fetched successfully", response.score, 200);
        } catch (error) {
            return createErrorResponse(false, "Test fetch failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };
}

export default TestModel;