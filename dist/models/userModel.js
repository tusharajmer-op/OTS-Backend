"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./../schema");
const createResponse_1 = require("../utilities/createResponse");
const constants_1 = require("../utilities/constants");
const services_1 = require("../services");
class UserModel {
    userSchema;
    /**
     * Constructs a new instance of the UserModel class.
     */
    constructor() {
        this.userSchema = schema_1.userModel;
    }
    /**
     * Stores a new user in the database.
     * @param data - The user data to be stored.
     * @returns A promise that resolves to an API response or an error response.
     */
    store = async (data) => {
        try {
            const user = new this.userSchema(data);
            try {
                await user.validate();
            }
            catch (err) {
                const cerror = services_1.DatabaseErrors.handleErrors(err);
                return cerror;
            }
            const response = await user.save();
            return (0, createResponse_1.createResponse)(true, "User created successfully", [response], 201);
        }
        catch (error) {
            const cerror = services_1.DatabaseErrors.handleErrors(error);
            return cerror;
        }
    };
    /**
     * Retrieves a user from the database by email.
     * @param email - The email of the user to be retrieved.
     * @returns A promise that resolves to an API response or an error response.
     */
    getUserByEmail = async (email) => {
        try {
            const user = await this.userSchema.findOne({ email: email }).exec();
            if (user) {
                return (0, createResponse_1.createResponse)(true, "User Found", [user], 200);
            }
            return (0, createResponse_1.createResponse)(true, "No User Found", [], 400);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "Something went wrong", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Retrieves a user from the database by ID.
     * @param id - The ID of the user to be retrieved.
     * @returns A promise that resolves to an API response or an error response.
     */
    getUserById = async (id) => {
        try {
            const response = await this.userSchema.findById(id, { tests: 1, _id: 0 });
            if (!response) {
                return (0, createResponse_1.createResponse)(true, "User not found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "User fetched successfully", [{ tests: response.tests }], 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "User fetch failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Updates a user in the database.
     * @param id - The ID of the user to be updated.
     * @param data - The updated user data.
     * @returns A promise that resolves to an API response or an error response.
     */
    update = async (id, data) => {
        try {
            const response = await this.userSchema.findByIdAndUpdate(id, data, { new: true });
            if (!response) {
                return (0, createResponse_1.createResponse)(true, "User not found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "User updated successfully", response, 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "User update failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Deletes a user from the database.
     * @param id - The ID of the user to be deleted.
     * @returns A promise that resolves to an API response or an error response.
     */
    delete = async (id) => {
        try {
            const response = await this.userSchema.findByIdAndDelete(id);
            if (!response) {
                return (0, createResponse_1.createResponse)(true, "User not found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "User deleted successfully", response, 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "User delete failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
    /**
     * Updates a user's test and score in the database.
     * @param id - The ID of the user.
     * @param testId - The ID of the test.
     * @param score - The score of the test.
     * @returns A promise that resolves to an API response or an error response.
     */
    updateTestAndScore = async (id, testId, score) => {
        try {
            const response = await this.userSchema.findByIdAndUpdate(id, { $push: { tests: { test: testId, result: score } } }, { new: true });
            if (!response) {
                return (0, createResponse_1.createResponse)(true, "User not found", [], 404);
            }
            return (0, createResponse_1.createResponse)(true, "Test updated successfully", response, 200);
        }
        catch (error) {
            return (0, createResponse_1.createErrorResponse)(false, "Test update failed", [], `${error}`, 500, constants_1.LOG_PRIORITY[3]);
        }
    };
}
exports.default = UserModel;
