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
const catUtility_1 = __importDefault(require("../utilities/catUtility"));
const middlewares_1 = require("../middlewares");
class TestController {
    questionModel;
    testModel;
    userModel;
    redis;
    Cat;
    constructor() {
        this.questionModel = new models_1.QuestionModel();
        this.testModel = new models_1.TestModel();
        this.redis = new services_1.RedisService();
        this.Cat = new catUtility_1.default();
        this.userModel = new models_1.UserModel();
    }
    // Create a new test
    createTest = async (user_Id, askedQuestion) => {
        try {
            const userId = new mongoose_1.default.Types.ObjectId(user_Id);
            const test = {
                user_id: userId,
                questions: [askedQuestion],
                created_at: new Date(),
                updated_at: new Date(),
                score: 0,
            };
            const response = await this.testModel.store(test);
            return response.data;
        }
        catch (e) {
            return;
        }
    };
    // Fetch unique questions with specified tags
    fetchUniqueQuestionWithTags = async (tags, alreadyAskedQuestion) => {
        try {
            const questions = await this.questionModel.getUniqueQuestionByTag(tags, alreadyAskedQuestion);
            return questions.data;
        }
        catch (e) {
            return;
        }
    };
    // Get a random question from the list
    getRandomQuestions = (questions) => {
        const randomQuestions = questions[Math.floor(Math.random() * questions.length)];
        return randomQuestions;
    };
    // Store the answer for a question in a test
    storeAnswer = async (test_id, question_id, answer) => {
        const testId = new mongoose_1.default.Types.ObjectId(test_id);
        const questionId = new mongoose_1.default.Types.ObjectId(question_id);
        const response = await this.testModel.checkAndStoreAnswer(testId, questionId, answer);
        if (response.status && response.code === 200) {
            if (response.data) {
                this.Cat.increaseRating(testId.toString());
            }
            else {
                this.Cat.decreaseRating(testId.toString());
            }
            return true;
        }
        else {
            return false;
        }
    };
    // Start a test
    startTest = async (req, next) => {
        try {
            const questions = await this.fetchUniqueQuestionWithTags(5, []);
            if (questions) {
                const randomQuestions = this.getRandomQuestions(questions);
                const questionToAsk = {
                    questionId: randomQuestions._id,
                    question: randomQuestions.question,
                    options: randomQuestions.options,
                    answer: null,
                    correctAnswer: randomQuestions.answer,
                    status: 'Unanswered',
                    difficulty: randomQuestions.difficulty,
                    tag: randomQuestions.tag
                };
                const { user_id } = req.body.payload;
                const test = await this.createTest(user_id, questionToAsk);
                if (test) {
                    await this.Cat.setInitialRating(test._id.toString());
                    const TestId = test._id;
                    this.redis.storeAskedQuestionIds(TestId.toString(), test.questions[0].questionId.toString());
                    const testResponse = {
                        test_id: test._id,
                        question_id: test.questions[0].questionId,
                        question: test.questions[0].question,
                        options: test.questions[0].options,
                        status: test.questions[0].status,
                        tags: test.questions[0].tag,
                    };
                    return (0, createResponse_1.createResponse)(true, "Test Started", [testResponse], 200);
                }
                const testError = (0, createResponse_1.createErrorResponse)(false, "Test Creation Failed", [], "Test Creation Failed", 500, constants_1.LOG_PRIORITY[3]);
                next(testError);
            }
            const noQuestionError = (0, createResponse_1.createErrorResponse)(false, "No Questions Found", [], "No Questions Found", 404, constants_1.LOG_PRIORITY[6]);
            next(noQuestionError);
        }
        catch (e) {
            const err = (0, createResponse_1.createErrorResponse)(false, 'Internal Server Error', [], `${e}`, 500, constants_1.LOG_PRIORITY[3]);
            next(err);
        }
    };
    // Move to the next question in a test
    nextQuestion = async (req, next) => {
        try {
            const { test_id, question_id, answer } = req.body;
            const isAnswerStored = await this.storeAnswer(test_id, question_id, answer);
            if (!isAnswerStored) {
                const answerStoreError = (0, createResponse_1.createErrorResponse)(false, "Answer Storage Failed", [], "Answer Storage Failed", 500, constants_1.LOG_PRIORITY[3]);
                next(middlewares_1.ErrorHandler.customError(answerStoreError));
                return;
            }
            const alreadyAskedQuestion = await this.redis.getAskedQuestionIds(test_id);
            if (!alreadyAskedQuestion) {
                const noQuestionError = (0, createResponse_1.createErrorResponse)(false, "No Session Found Please start a new test", [], "No Questions Found", 404, constants_1.LOG_PRIORITY[6]);
                next(noQuestionError);
                return;
            }
            if (alreadyAskedQuestion.length === Number(process.env.MAX_QUESTIONS)) {
                const score = await this.testModel.getTestScore(test_id);
                if (!score) {
                    const scoreError = (0, createResponse_1.createErrorResponse)(false, "No Score Found", [], "No Score Found", 404, constants_1.LOG_PRIORITY[6]);
                    next(scoreError);
                    return;
                }
                const addedTest = this.userModel.updateTestAndScore(req.body.payload.user_id, test_id, score.data);
                if (!addedTest) {
                    const testError = (0, createResponse_1.createErrorResponse)(false, "Test Update Failed", [], "Test Update Failed", 500, constants_1.LOG_PRIORITY[3]);
                    next(testError);
                    return;
                }
                const testCompleted = (0, createResponse_1.createResponse)(true, "Test Completed", [], 200);
                return testCompleted;
            }
            const userRating = await this.Cat.getRating(req.body.test_id);
            if (!userRating) {
                const ratingError = (0, createResponse_1.createErrorResponse)(false, "No Rating Found", [], "No Rating Found", 404, constants_1.LOG_PRIORITY[6]);
                next(ratingError);
                return;
            }
            const userRatingInt = parseInt(userRating.toString());
            const questions = await this.fetchUniqueQuestionWithTags(userRatingInt, alreadyAskedQuestion);
            if (questions) {
                const randomQuestions = this.getRandomQuestions(questions);
                await this.redis.storeAskedQuestionIds(test_id, String(randomQuestions._id));
                const questionToAsk = {
                    questionId: randomQuestions._id,
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
                    const testError = (0, createResponse_1.createErrorResponse)(false, "Something went wrong", [], "Test Creation Failed", 500, constants_1.LOG_PRIORITY[3]);
                    next(testError);
                    return;
                }
                const testResponse = {
                    test_id: test_id,
                    question_id: randomQuestions._id,
                    question: randomQuestions.question,
                    options: randomQuestions.options,
                    status: 'Unanswered',
                    tags: randomQuestions.tag,
                };
                return (0, createResponse_1.createResponse)(true, "Next Question", [testResponse], 200);
            }
            const noQuestionError = (0, createResponse_1.createErrorResponse)(false, "No Questions Found", [], "No Questions Found", 404, constants_1.LOG_PRIORITY[6]);
            next(noQuestionError);
        }
        catch (e) {
            const err = (0, createResponse_1.createErrorResponse)(false, 'Internal Server Error', [], `${e}`, 500, constants_1.LOG_PRIORITY[3]);
            next(err);
            return;
        }
    };
}
exports.default = TestController;
