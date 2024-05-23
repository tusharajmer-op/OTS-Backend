import { Request,NextFunction } from "express";
import { IQuestion, ITest } from "../schema";
import { QuestionModel,TestModel } from "../models";
import { ErrorHandler } from "../middlewares";

class TestController {
    private questionModel;
    private testModel;
    constructor() {
        this.questionModel = new QuestionModel();
        this.testModel = new TestModel();
    }

    private createTest = async (userId : string, Question : IQuestion) : Promise<void> => {
        try {
            const test : ITest = {
                user: userId,
                questions: [Question],
                
            };
            const response = await this.testModel.store(test);
            if (!response.status) {
                const error = ErrorHandler.customError(response);
                throw error;
            }
        } catch (e) {
            console.log(e);
        }
    };

    private fetchQuestionWithTags = async (tags : string) : Promise<IQuestion[]|void> => {
        try {
            const questions = await this.questionModel.getQuestionByTag(tags);
            return questions.data as IQuestion[];
        } catch (e) {
            console.log(e);
        }
    };
    private getRandomQuestions = (questions : IQuestion[]) : IQuestion=> {
        const randomQuestions = questions[Math.floor(Math.random() * questions.length)];
        return randomQuestions;
        
    };
    startTest = async (req: Request, next: NextFunction) : Promise<void> => {
        try {
            const questions = await this.fetchQuestionWithTags('easy');
            if (questions) {
                const randomQuestions = this.getRandomQuestions(questions);
                this.createTest(req.body.userId, randomQuestions);
            }
            
        } catch (e) {
            console.log(e);
        }
    };


}