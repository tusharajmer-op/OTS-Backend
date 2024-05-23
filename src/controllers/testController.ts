import { Request,NextFunction } from "express";
import { IAskedQuestion, IQuestion, ITest } from "../schema";
import { QuestionModel,TestModel } from "../models";
import { Schema } from "mongoose";
import { apiResponse } from "../utilities/interfaces";
import { RedisService } from "../services";
import { createErrorResponse, createResponse } from "../utilities/createResponse";
import { LOG_PRIORITY } from "../utilities/constants";

class TestController {
    private questionModel;
    private testModel;
    private redis;
    constructor() {
        this.questionModel = new QuestionModel();
        this.testModel = new TestModel();
        this.redis = new RedisService();
    }

    private createTest = async (user_Id : string,askedQuestion : IAskedQuestion) : Promise<ITest | void> => {
        try {
            const userId = new Schema.ObjectId(user_Id);
            const test : ITest = {
                user_id: userId,
                questions: [askedQuestion],
                created_at : new Date(),
                updated_at : new Date(),    
            };
            const response = await this.testModel.store(test);
            return response.data as ITest;
        } catch (e) {
            console.log(e);
        }
    };

    private fetchUniqueQuestionWithTags = async (tags : string,alreadyAskedQuestion: string[]) : Promise<IQuestion[]|void> => {
        try {
            const questions = await this.questionModel.getUniqueQuestionByTag(tags,alreadyAskedQuestion);
            return questions.data as IQuestion[];
        } catch (e) {
            console.log(e);
        }
    };
    private getRandomQuestions = (questions : IQuestion[]) : IQuestion=> {
        const randomQuestions = questions[Math.floor(Math.random() * questions.length)];
        return randomQuestions;
        
    };
    private storeAnswer = async (test_id : string,question_id : string, answer : string) : Promise<boolean> => {
        const testId = new Schema.ObjectId(test_id);
        const questionId = new Schema.ObjectId(question_id);
        const response = await this.testModel.storeAnswer(testId,questionId,answer);
        if (response.status && response.code === 200) {
            return true;
        }
        else{
            return false;
        }


    };


    startTest = async (req: Request, next: NextFunction) : Promise<apiResponse|void> => {
        try {
            const questions = await this.fetchUniqueQuestionWithTags('easy',[]);
            if (questions) {
                const randomQuestions = this.getRandomQuestions(questions);
                const questionToAsk : IAskedQuestion = {
                    _id : randomQuestions!._id as Schema.Types.ObjectId,
                    question : randomQuestions.question,
                    options : randomQuestions.options,
                    answer : null,
                    correctAnswer : randomQuestions.answer,
                    status : 'Unanswered'
                };
                const test = await this.createTest(req.body.params.user_id,questionToAsk);
                if(test){
                    const TestId = test._id;
                    this.redis.storeAskedQuestionIds(TestId!.toString(),test.questions[0]._id.toString());
                    const testResponse = {
                        test_id: test._id,
                        question: test.questions[0]._id,
                    };
                    return createResponse(true, "Test Started", [testResponse], 200);
                }
                const testError = createErrorResponse(false, "Test Creation Failed", [], "Test Creation Failed", 500, LOG_PRIORITY[3]);
                next(testError);
            }   
            const noQuestionError = createErrorResponse(false, "No Questions Found", [], "No Questions Found", 404,LOG_PRIORITY[6]);
            next(noQuestionError);
        } catch (e) {
            console.log(e);
            const err = createErrorResponse(false, 'Internal Server Error', [], `${e}`, 500, LOG_PRIORITY[3]);
            next(err);
        }
    };

    nextQuestion = async (req: Request, next: NextFunction) : Promise<apiResponse|void> => {
        try {
            const { test_id,question_id,answer } = req.body.params;
            const isAnswerStored = await this.storeAnswer(test_id,question_id,answer);
            if (!isAnswerStored) {
                const answerStoreError = createErrorResponse(false, "Answer Storage Failed", [], "Answer Storage Failed", 500, LOG_PRIORITY[3]);
                next(answerStoreError);
            }
            const alreadyAskedQuestion = await this.redis.getAskedQuestionIds(test_id);
            if (!alreadyAskedQuestion) {
                const noQuestionError = createErrorResponse(false, "No Session Found Please start a new test", [], "No Questions Found", 404,LOG_PRIORITY[6]);
                next(noQuestionError);
                return;
            }
            const questions = await this.fetchUniqueQuestionWithTags('easy',alreadyAskedQuestion);
            if (questions) {
                const randomQuestions = this.getRandomQuestions(questions);
                const testResponse = {
                    test_id: test_id,
                    question: randomQuestions,
                };
                return createResponse(true, "Next Question", [testResponse], 200);
            }
            const noQuestionError = createErrorResponse(false, "No Questions Found", [], "No Questions Found", 404,LOG_PRIORITY[6]);
            next(noQuestionError);
        } catch (e) {
            console.log(e);
            const err = createErrorResponse(false, 'Internal Server Error', [], `${e}`, 500, LOG_PRIORITY[3]);
            next(err);
        }

    };

}

export default TestController;