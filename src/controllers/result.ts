import { Request, NextFunction } from "express";
import { ITest } from "../schema";
import { TestModel, UserModel } from "../models";
import mongoose from "mongoose";
import { apiResponse } from "../utilities/interfaces";
import { RedisService } from "../services";
import { createErrorResponse, createResponse } from "../utilities/createResponse";
import { LOG_PRIORITY } from "../utilities/constants";
import { ErrorHandler } from "../middlewares";

// Define the interface for result analysis
interface resultAnalysis {
    test_id: mongoose.Types.ObjectId,
    correctToIncorrect: number,
    score: number,
    totalQuestions: number,
    correctAnswers: mongoose.Types.ObjectId[],
    incorrectAnswers: mongoose.Types.ObjectId[],
    skippedQuestions: mongoose.Types.ObjectId[]
    tagsToQuestions: Record<string, string[]>
    difficultyToQuestions: Record<string, string[]>
}

class Result {
    private testModel;
    private userModel;
    private redis;

    constructor() {
        this.testModel = new TestModel();
        this.redis = new RedisService();
        this.userModel = new UserModel();
    }

    // Method to get the test result
    getTestResult = async (req: Request, next: NextFunction): Promise<apiResponse | void> => {
        try {
            // Initialize the analysis object
            const analysis: resultAnalysis = {
                test_id: new mongoose.Types.ObjectId(),
                correctToIncorrect: 0,
                score: 0,
                totalQuestions: 0,
                correctAnswers: [],
                incorrectAnswers: [],
                skippedQuestions: [],
                tagsToQuestions: {},
                difficultyToQuestions: {}
            } as resultAnalysis;

            const testId = req.params.testId;
            console.log(testId);

            // Check if testId is provided
            if (!testId) {
                const error = createErrorResponse(false, '', [], 'Test Id is required', 400, LOG_PRIORITY[3]);
                next(ErrorHandler.customError(error));
            }

            // Fetch the test details from the database
            const response = await this.testModel.showTest(testId);
            if (!response.status) {
                const error = ErrorHandler.customError(response);
                next(error);
            }
            const test = response.data as ITest;
            console.log(test);

            // Update the analysis object with test details
            analysis.totalQuestions = test.questions.length;
            analysis.test_id = new mongoose.Types.ObjectId(testId);
            analysis.correctToIncorrect = 0;
            analysis.score = test.score;

            // Iterate through each question in the test
            test.questions.forEach((question) => {
                console.log(analysis);

                // Update the analysis object based on the question status
                if (question.status === 'Correct') {
                    analysis.correctAnswers.push(question.questionId);
                } else if (question.status === 'Incorrect') {
                    analysis.incorrectAnswers.push(question.questionId);
                } else {
                    analysis.skippedQuestions.push(question.questionId);
                }

                console.log(question.difficulty);

                // Update the analysis object with difficulty-to-questions mapping
                if (analysis.difficultyToQuestions[question.difficulty]) {
                    analysis.difficultyToQuestions[question.difficulty].push(question.questionId.toString());
                } else {
                    analysis.difficultyToQuestions[question.difficulty] = [question.questionId.toString()];
                }

                analysis.correctToIncorrect = analysis.correctAnswers.length / analysis.incorrectAnswers.length;

                // Check if the question has tags
                if (!question.tag) {
                    return createResponse(true, 'Test Result Fetched Successfully', [analysis], 200);
                }

                // Update the analysis object with tag-to-questions mapping
                question.tag.forEach((tag) => {
                    console.log(analysis.tagsToQuestions[tag]);
                    if (analysis.tagsToQuestions[tag]) {
                        analysis.tagsToQuestions[tag].push(question.questionId.toString());
                    } else {
                        analysis.tagsToQuestions[tag] = [question.questionId.toString()];
                    }
                });
            });

            analysis.correctToIncorrect = analysis.correctAnswers.length / analysis.incorrectAnswers.length;

            // Return the test result
            return createResponse(true, 'Test Result Fetched Successfully', [analysis], 200);
        } catch (e) {
            console.log(e);
            const error = createErrorResponse(false, 'Internal Server Error', [], `${e}`, 500, LOG_PRIORITY[3]);
            next(ErrorHandler.customError(error));
        }
    };
}

export default Result;