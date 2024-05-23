import { Model } from 'mongoose';
import { userModel, IUser } from './../schema';
import { createResponse, createErrorResponse } from '../utilities/createResponse';
import { apiResponse, errorResponse } from '../utilities/interfaces';
import { LOG_PRIORITY } from '../utilities/constants';
import {DatabaseErrors,MongoError} from '../services';

class UserModel {
    userSchema: Model<IUser>;
    constructor() {
        this.userSchema = userModel;
    }
    store = async (data: IUser) : Promise<apiResponse|errorResponse> => {
        try {
            const user = new this.userSchema(data);
            try{
                await user.validate();
            }catch(err){
                const cerror = DatabaseErrors.handleErrors(err as MongoError);
                return cerror;
            }
            const response = await user.save();
            const {id,role} = response;
            return createResponse(true, "User created successfully", [{"id":id,"role":role}], 201);
        } catch (error) {
            const cerror = DatabaseErrors.handleErrors(error as MongoError);
            return cerror;
        }
    };
    getUserByEmail = async (email: string) : Promise<apiResponse|errorResponse> => {
        try {
            const user = await this.userSchema.findOne({email : email}).exec();
            if(user){
                
                return createResponse(true, "User Found", [user], 200);
            }
            return createResponse(true, "No User Found", [], 400);
        } catch (error) {
            return createErrorResponse(false, "Something went wrong", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };
    getUserById = async (id: string) : Promise<apiResponse|errorResponse> => {
        try {
            const response = await this.userSchema.findById(id);
            if (!response) {
                return createResponse(true, "User not found", [], 404);
            }
            return createResponse(true, "User fetched successfully", response, 200);
        } catch (error) {
            return createErrorResponse(false, "User fetch failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };
    update = async (id: string, data: IUser) : Promise<apiResponse|errorResponse> => {
        try {
            const response = await this.userSchema.findByIdAndUpdate(id, data, { new: true });
            if (!response) {
                return createResponse(true, "User not found", [], 404);
            }
            return createResponse(true, "User updated successfully", response, 200);
        } catch (error) {
            return createErrorResponse(false, "User update failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };
    delete = async (id: string) : Promise<apiResponse|errorResponse> => {
        try {
            const response = await this.userSchema.findByIdAndDelete(id);
            if (!response) {
                return createResponse(true, "User not found", [], 404);
            }
            return createResponse(true, "User deleted successfully", response, 200);
        } catch (error) {
            return createErrorResponse(false, "User delete failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };
}

export default UserModel;