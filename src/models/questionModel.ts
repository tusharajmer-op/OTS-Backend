import mongoose, { Model } from 'mongoose';
import { questionModel, IQuestion } from './../schema';
import { createResponse, createErrorResponse } from '../utilities/createResponse';
import { apiResponse, errorResponse } from '../utilities/interfaces';
import { LOG_PRIORITY } from '../utilities/constants';
/**
 * Represents a Question Model.
 */
class QuestionModel {
    questionModel: Model<IQuestion>;

    constructor() {
        this.questionModel = questionModel;
    }

    /**
     * Fetches all questions.
     * @returns A promise that resolves to an API response or an error response.
     */
    index = async (): Promise<apiResponse | errorResponse> => {
        try {
            const response = await this.questionModel.find();
            return createResponse(true, "Questions fetched successfully", response, 200);
        } catch (error) {
            return createErrorResponse(false, "Questions fetch failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Stores a new question.
     * @param data - The question data to be stored.
     * @returns A promise that resolves to an API response or an error response.
     */
    store = async (data: IQuestion): Promise<apiResponse | errorResponse> => {
        try {
            const user = new this.questionModel(data);
            const response = await user.save();
            return createResponse(true, "Question Added successfully", response, 201);
        } catch (error) {
            return createErrorResponse(false, "User creation failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Updates a question by ID.
     * @param data - The updated question data.
     * @param id - The ID of the question to be updated.
     * @returns A promise that resolves to an API response or an error response.
     */
    update = async (data: IQuestion, id: string): Promise<apiResponse | errorResponse> => {
        try {
            const newQuestion = await this.questionModel.findByIdAndUpdate(id, data, { new: true });
            if (!newQuestion) {
                return createResponse(true, "Question not found", [], 404);
            }
            return createResponse(true, "Question Updated Successfully", newQuestion, 200);
        } catch (err) {
            
            return createErrorResponse(false, "Question update failed", [], `${err}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Deletes a question by ID.
     * @param id - The ID of the question to be deleted.
     * @returns A promise that resolves to an API response or an error response.
     */
    delete = async (id: string): Promise<apiResponse | errorResponse> => {
        try {
            const deletedQuestion = await this.questionModel.findByIdAndDelete<IQuestion>(id, { new: true });
            if (!deletedQuestion)
                return createResponse(true, "", [], 200);
            return createResponse(true, "Question not found", deletedQuestion, 200);
        } catch (err) {
            
            return createErrorResponse(false, "Question Deletion failed", [], `${err}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Gets a unique question by difficulty and excludes already asked questions.
     * @param difficulty - The difficulty level of the question.
     * @param alreadyAskedQuestionList - The list of already asked question IDs.
     * @returns A promise that resolves to an API response or an error response.
     */
    getUniqueQuestionByTag = async (difficulty: number, alreadyAskedQuestionList: string[]): Promise<apiResponse | errorResponse> => {
        try {
            const alreadyAskedQuestionIds = alreadyAskedQuestionList.map((question) => new mongoose.Types.ObjectId(question));

            const question = await this.questionModel.find({ difficulty: difficulty, _id: { $nin: alreadyAskedQuestionIds } }).exec();
            if (question.length === 0) {
                return createResponse(true, "No Question Found", [], 404);
            }
            return createResponse(true, "Questions fetched successfully", question, 200);
        } catch (err) {
            
            return createErrorResponse(false, "Questions fetch failed", [], `${err}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Gets a question by ID.
     * @param id - The ID of the question to be fetched.
     * @returns A promise that resolves to an API response or an error response.
     */
    getQuestionById = async (id: string): Promise<apiResponse | errorResponse> => {
        try {
            const question = await this.questionModel.findById(id);
            if (!question) {
                return createResponse(true, "No Question Found", [], 404);
            }
            return createResponse(true, "Question fetched successfully", question, 200);
        } catch (err) {
            
            return createErrorResponse(false, "Question fetch failed", [], `${err}`, 500, LOG_PRIORITY[3]);
        }
    };
}

export default QuestionModel;