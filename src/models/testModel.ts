import { Model } from "mongoose";
import { testModel,ITest } from "../schema";
import { createErrorResponse, createResponse } from "../utilities/createResponse";
import { apiResponse, errorResponse } from "../utilities/interfaces";
import { LOG_PRIORITY } from "../utilities/constants";

class TestModel {
    testModel : Model<ITest>;
    constructor(){
        this.testModel = testModel;
    }

    store = async (data : ITest) : Promise<apiResponse|errorResponse> => {
        try {
            const test = new this.testModel(data);
            const response = await test.save();
            return createResponse(true, "Test created successfully", response, 201);
        } catch (error) {
            return createErrorResponse(false, "Test creation failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };
    update = async (id : string, data : ITest) : Promise<apiResponse|errorResponse> => {
        try {
            const response = await this.testModel.findByIdAndUpdate(id, data, { new: true });
            if (!response) {
                return createResponse(true, "Test not found", [], 404);
            }
            return createResponse(true, "Test updated successfully", response, 200);
        }catch (error) {
            return createErrorResponse(false, "Test update failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };
    insertQuestion = async (id : string, questionId : string) : Promise<apiResponse|errorResponse> => {
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

}

export default TestModel; 