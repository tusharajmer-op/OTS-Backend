import { Model } from 'mongoose';
import { userModel, IUser } from './../schema';
import { createResponse, createErrorResponse } from '../utilities/createResponse';
import { apiResponse, errorResponse } from '../utilities/interfaces';
import { LOG_PRIORITY } from '../utilities/constants';
import { DatabaseErrors, MongoError } from '../services';

class UserModel {
    userSchema: Model<IUser>;

    /**
     * Constructs a new instance of the UserModel class.
     */
    constructor() {
        this.userSchema = userModel;
    }

    /**
     * Stores a new user in the database.
     * @param data - The user data to be stored.
     * @returns A promise that resolves to an API response or an error response.
     */
    store = async (data: IUser): Promise<apiResponse | errorResponse> => {
        try {
            const user = new this.userSchema(data);
            try {
                await user.validate();
            } catch (err) {
                const cerror = DatabaseErrors.handleErrors(err as MongoError);
                return cerror;
            }
            const response = await user.save();
            return createResponse(true, "User created successfully", [response], 201);
        } catch (error) {
            const cerror = DatabaseErrors.handleErrors(error as MongoError);
            return cerror;
        }
    };

    /**
     * Retrieves a user from the database by email.
     * @param email - The email of the user to be retrieved.
     * @returns A promise that resolves to an API response or an error response.
     */
    getUserByEmail = async (email: string): Promise<apiResponse | errorResponse> => {
        try {
            const user = await this.userSchema.findOne({ email: email }).exec();
            if (user) {
                return createResponse(true, "User Found", [user], 200);
            }
            return createResponse(true, "No User Found", [], 400);
        } catch (error) {
            return createErrorResponse(false, "Something went wrong", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Retrieves a user from the database by ID.
     * @param id - The ID of the user to be retrieved.
     * @returns A promise that resolves to an API response or an error response.
     */
    getUserById = async (id: string): Promise<apiResponse | errorResponse> => {
        try {
            const response = await this.userSchema.findById(id, { tests: 1, _id: 0 });
            console.log(response);
            if (!response) {
                return createResponse(true, "User not found", [], 404);
            }
            return createResponse(true, "User fetched successfully", [{ tests: response.tests }], 200);
        } catch (error) {
            return createErrorResponse(false, "User fetch failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };

    /**
     * Updates a user in the database.
     * @param id - The ID of the user to be updated.
     * @param data - The updated user data.
     * @returns A promise that resolves to an API response or an error response.
     */
    update = async (id: string, data: IUser): Promise<apiResponse | errorResponse> => {
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

    /**
     * Deletes a user from the database.
     * @param id - The ID of the user to be deleted.
     * @returns A promise that resolves to an API response or an error response.
     */
    delete = async (id: string): Promise<apiResponse | errorResponse> => {
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

    /**
     * Updates a user's test and score in the database.
     * @param id - The ID of the user.
     * @param testId - The ID of the test.
     * @param score - The score of the test.
     * @returns A promise that resolves to an API response or an error response.
     */
    updateTestAndScore = async (id: string, testId: string, score: number): Promise<apiResponse | errorResponse> => {
        try {
            const response = await this.userSchema.findByIdAndUpdate(id, { $push: { tests: { test: testId, result: score } } }, { new: true });
            if (!response) {
                return createResponse(true, "User not found", [], 404);
            }
            return createResponse(true, "Test updated successfully", response, 200);
        } catch (error) {
            return createErrorResponse(false, "Test update failed", [], `${error}`, 500, LOG_PRIORITY[3]);
        }
    };
}

export default UserModel;