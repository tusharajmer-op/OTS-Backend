import { Request, NextFunction } from "express";
import { IAskedQuestion, IQuestion, ITest } from "../schema";
import { QuestionModel, TestModel, UserModel } from "../models";
import mongoose from "mongoose";
import { apiResponse } from "../utilities/interfaces";
import { RedisService } from "../services";
import { createErrorResponse, createResponse } from "../utilities/createResponse";
import { LOG_PRIORITY } from "../utilities/constants";
import cat from "../utilities/catUtility";
import { ErrorHandler } from "../middlewares";

class TestController {
    private questionModel;
    private testModel;
    private userModel;
    private redis;
    private Cat;

    constructor() {
        this.questionModel = new QuestionModel();
        this.testModel = new TestModel();
        this.redis = new RedisService();
        this.Cat = new cat();
        this.userModel = new UserModel();
    }

    // Create a new test
    private createTest = async (user_Id: string, askedQuestion: IAskedQuestion): Promise<ITest | void> => {
        try {
            const userId = new mongoose.Types.ObjectId(user_Id);
            const test: ITest = {
                user_id: userId,
                questions: [askedQuestion],
                created_at: new Date(),
                updated_at: new Date(),
                score: 0,
            };
            const response = await this.testModel.store(test);
            console.log(response);
            return response.data as ITest;
        } catch (e) {
            console.log(e);
        }
    };

    // Fetch unique questions with specified tags
    private fetchUniqueQuestionWithTags = async (tags: number, alreadyAskedQuestion: string[]): Promise<IQuestion[] | void> => {
        try {
            const questions = await this.questionModel.getUniqueQuestionByTag(tags, alreadyAskedQuestion);
            return questions.data as IQuestion[];
        } catch (e) {
            console.log(e);
        }
    };

    // Get a random question from the list
    private getRandomQuestions = (questions: IQuestion[]): IQuestion => {
        const randomQuestions = questions[Math.floor(Math.random() * questions.length)];
        return randomQuestions;
    };

    // Store the answer for a question in a test
    private storeAnswer = async (test_id: string, question_id: string, answer: string): Promise<boolean> => {
        const testId = new mongoose.Types.ObjectId(test_id);
        const questionId = new mongoose.Types.ObjectId(question_id);
        const response = await this.testModel.checkAndStoreAnswer(testId, questionId, answer);
        if (response.status && response.code === 200) {
            console.log(response.data);
            if (response.data) {
                this.Cat.increaseRating(testId.toString());
            } else {
                this.Cat.decreaseRating(testId.toString());
            }
            console.log('rating increased or decreased ');
            console.log(await this.Cat.getRating(testId.toString()));
            return true;
        } else {
            return false;
        }
    };

    // Start a test
    startTest = async (req: Request, next: NextFunction): Promise<apiResponse | void> => {
        try {
            const questions = await this.fetchUniqueQuestionWithTags(5, []);
            if (questions) {
                const randomQuestions = this.getRandomQuestions(questions);
                const questionToAsk: IAskedQuestion = {
                    questionId: randomQuestions!._id as unknown as mongoose.Types.ObjectId,
                    question: randomQuestions.question,
                    options: randomQuestions.options,
                    answer: null,
                    correctAnswer: randomQuestions.answer,
                    status: 'Unanswered',
                    difficulty: randomQuestions.difficulty,
                    tag: randomQuestions.tag
                };
                const { user_id } = req.body.payload;
                console.log('user_id');
                console.log(questionToAsk);
                const test = await this.createTest(user_id, questionToAsk);
                if (test) {
                    await this.Cat.setInitialRating(test._id!.toString());
                    const TestId = test._id;
                    this.redis.storeAskedQuestionIds(TestId!.toString(), test.questions[0].questionId.toString());
                    console.log('test');
                    console.log(test);
                    const testResponse = {
                        test_id: test._id,
                        question_id: test.questions[0].questionId,
                        question: test.questions[0].question,
                        options: test.questions[0].options,
                        status: test.questions[0].status,
                        tags: test.questions[0].tag,
                    };
                    console.log('testResponse');
                    console.log(testResponse);
                    return createResponse(true, "Test Started", [testResponse], 200);
                }
                const testError = createErrorResponse(false, "Test Creation Failed", [], "Test Creation Failed", 500, LOG_PRIORITY[3]);
                next(testError);
            }
            const noQuestionError = createErrorResponse(false, "No Questions Found", [], "No Questions Found", 404, LOG_PRIORITY[6]);
            next(noQuestionError);
        } catch (e) {
            console.log(e);
            const err = createErrorResponse(false, 'Internal Server Error', [], `${e}`, 500, LOG_PRIORITY[3]);
            next(err);
        }
    };

    // Move to the next question in a test
    nextQuestion = async (req: Request, next: NextFunction): Promise<apiResponse | void> => {
        try {
            const { test_id, question_id, answer } = req.body;
            const isAnswerStored = await this.storeAnswer(test_id, question_id, answer);
            console.log(isAnswerStored);
            if (!isAnswerStored) {
                const answerStoreError = createErrorResponse(false, "Answer Storage Failed", [], "Answer Storage Failed", 500, LOG_PRIORITY[3]);
                next(ErrorHandler.customError(answerStoreError));
                return;
            }

            const alreadyAskedQuestion = await this.redis.getAskedQuestionIds(test_id);

            if (!alreadyAskedQuestion) {
                const noQuestionError = createErrorResponse(false, "No Session Found Please start a new test", [], "No Questions Found", 404, LOG_PRIORITY[6]);
                next(noQuestionError);
                return;
            }
            if (alreadyAskedQuestion.length === 5) {
                const score = await this.testModel.getTestScore(test_id);
                if (!score) {
                    const scoreError = createErrorResponse(false, "No Score Found", [], "No Score Found", 404, LOG_PRIORITY[6]);
                    next(scoreError);
                    return;
                }
                const addedTest = this.userModel.updateTestAndScore(req.body.payload.user_id, test_id, score.data as number);
                if (!addedTest) {
                    const testError = createErrorResponse(false, "Test Update Failed", [], "Test Update Failed", 500, LOG_PRIORITY[3]);
                    next(testError);
                    return;
                }
                const testCompleted = createResponse(true, "Test Completed", [], 200);
                return testCompleted;
            }
            const userRating = await this.Cat.getRating(req.body.test_id);
            console.log(userRating);
            if (!userRating) {
                const ratingError = createErrorResponse(false, "No Rating Found", [], "No Rating Found", 404, LOG_PRIORITY[6]);
                console.log(ratingError);
                next(ratingError);
                return;
            }
            const userRatingInt = parseInt(userRating.toString());
            const questions = await this.fetchUniqueQuestionWithTags(userRatingInt, alreadyAskedQuestion);
            if (questions) {
                const randomQuestions = this.getRandomQuestions(questions);
                await this.redis.storeAskedQuestionIds(test_id, String(randomQuestions!._id));
                console.log(test_id);
                const questionToAsk: IAskedQuestion = {
                    questionId: randomQuestions!._id as unknown as mongoose.Types.ObjectId,
                    question: randomQuestions.question,
                    options: randomQuestions.options,
                    answer: null,
                    correctAnswer: randomQuestions.answer,
                    status: 'Unanswered',
                    difficulty: randomQuestions.difficulty,
                    tag: randomQuestions.tag
                };
                const test = await this.testModel.insertQuestion(test_id, questionToAsk);
                if (!test) {
                    const testError = createErrorResponse(false, "Something went wrong", [], "Test Creation Failed", 500, LOG_PRIORITY[3]);
                    next(testError);
                    return;
                }
                console.log(randomQuestions);
                const testResponse = {
                    test_id: test_id,
                    question_id: randomQuestions._id,
                    question: randomQuestions.question,
                    options: randomQuestions.options,
                    status: 'Unanswered',
                    tags: randomQuestions.tag,
                };

                return createResponse(true, "Next Question", [testResponse], 200);
            }
            const noQuestionError = createErrorResponse(false, "No Questions Found", [], "No Questions Found", 404, LOG_PRIORITY[6]);
            next(noQuestionError);
        } catch (e) {
            console.log(e);
            const err = createErrorResponse(false, 'Internal Server Error', [], `${e}`, 500, LOG_PRIORITY[3]);
            next(err);
            return;
        }
    };
}

export default TestController;
