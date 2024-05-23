import { Model, Schema } from 'mongoose';
import { questionModel, IQuestion } from './../schema';
import { createResponse, createErrorResponse } from '../utilities/createResponse';
import { apiResponse, errorResponse } from '../utilities/interfaces';
import { LOG_PRIORITY } from '../utilities/constants';

class QuestionModel {
    questionModel: Model<IQuestion>;
    constructor() {
        this.questionModel = questionModel;
    }
    index = async () : Promise<apiResponse|errorResponse> => {
        try {
            const response = await this.questionModel.find();
            return createResponse(true, "Questions fetched successfully", response, 200);
        } catch (error) {
            return createErrorResponse(false, "Questions fetch failed", [], `${error}`, 500,LOG_PRIORITY[3]);
        }
    };

    store = async (data: IQuestion) : Promise<apiResponse|errorResponse> => {
        try {
            const user = new this.questionModel(data);
            const response = await user.save();
            return createResponse(true, "Question Added successfully", response, 201);
        } catch (error) {
            return createErrorResponse(false, "User creation failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };
    update = async (data:IQuestion,id: string) : Promise<apiResponse|errorResponse> =>{
        try{
            const newQuestion = await this.questionModel.findByIdAndUpdate(id,data,{new : true});
            if(!newQuestion){
                return createResponse(true, "Question not found", [], 404);
            }
            return createResponse(true,"Question Updated Successfully",newQuestion,200);
        }catch(err){
            console.log(err);
            return createErrorResponse(false, "Question update failed", [], `${err}`, 500, LOG_PRIORITY[3]);
        }
    };
    delete = async(id : string) : Promise<apiResponse|errorResponse> =>{
        try{
            const deltedQuestion = await this.questionModel.findByIdAndDelete<IQuestion>(id,{new : true});
            if(!deltedQuestion)
                return createResponse(true,"",[],200);
            return createResponse(true,"Question not found",deltedQuestion,200);
        }catch(err){
            console.log(err);
            return createErrorResponse(false, "Question Deletion failed", [], `${err}`, 500, LOG_PRIORITY[3]);
        }
    };
    getUniqueQuestionByTag = async (tag : string,alreadyAskedQuestionList:string[]) : Promise<apiResponse|errorResponse> =>{
        try{
            const alreadyAskedQuestionIds = alreadyAskedQuestionList.map((question) =>new Schema.ObjectId(question));
            const question = await this.questionModel.find({tag : tag,_id :{$nin:alreadyAskedQuestionIds}},{_id : 1,});
            if(question.length === 0){
                return createResponse(true, "No Question Found", [], 404);
            }
            return createResponse(true, "Questions fetched successfully", question, 200);
        }catch(err){
            console.log(err);
            return createErrorResponse(false, "Questions fetch failed", [], `${err}`, 500, LOG_PRIORITY[3]);
        }
    };

    getQuestionById = async (id : string) : Promise<apiResponse|errorResponse> =>{
        try{
            const question = await this.questionModel.findById(id);
            if(!question){
                return createResponse(true, "No Question Found", [], 404);
            }
            return createResponse(true, "Question fetched successfully", question, 200);
        }catch(err){
            console.log(err);
            return createErrorResponse(false, "Question fetch failed", [], `${err}`, 500, LOG_PRIORITY[3]);
        }
    };
           
}

export default QuestionModel;