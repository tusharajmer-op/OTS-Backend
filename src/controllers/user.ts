import { NextFunction, Request} from "express";
import {UserModel} from '../models';
import { createToken } from "../services";
import { encryptDate, compareData } from "../utilities/hashing";
import { ErrorHandler } from "../middlewares";
import { IUser } from "../schema";
import { apiResponse } from "../utilities/interfaces";
import { createErrorResponse, createResponse } from "../utilities/createResponse";
import { LOG_PRIORITY } from "../utilities/constants";
interface verifiedUser{
    data : Record<string,unknown>
    token : string
}
class UserController {
    UserModel = new UserModel();

    createNewUser = async (req: Request, next: NextFunction) : Promise<apiResponse|void> => {
        try {
            const userDetails = req.body;
            const hashedPassword = await encryptDate(req.body.password);
            userDetails['password'] = hashedPassword;
            userDetails['tests'] = [];
            const response = await this.UserModel.store(userDetails);
    
            if (response.status) {
                const [user] = response.data as [Record<string,string>];
                const jwt = createToken({ "user_id": user.id, "role_id": user.role });
                user.token = jwt;
                return createResponse(true, 'User Created Successfully', [user], 201);
            }
            else {
                const error = ErrorHandler.customError(response);
                next(error);

            }
        } catch (e) {
            console.log(e);
            const err = createErrorResponse(false,'Internal Server Error',[], `${e}` ,500,LOG_PRIORITY[3]);
            next(err);
           
        }
    };

    loginUser = async (req: Request, next: NextFunction) : Promise<apiResponse|void> => {
        try {
            const { email, password } = req.body;

            const response = await this.UserModel.getUserByEmail(email);
            if (response.code === 200) {
                const [user] = response.data as [IUser];
                const isPasswordValid = await compareData(password, user.password);
                
                if (isPasswordValid) {
                    
                    const jwt = createToken({ "user_id": user.id, "role_id": user.role });
                    const userWithoutSensitiveFields = { "id": user.id?.toString(), "role": user.role,"email":user.email,"name":user.name};
                    const verifiedUser : verifiedUser = {"data": userWithoutSensitiveFields,"token":jwt};
                    
                    return createResponse(true, 'User Logged In Successfully', [verifiedUser], 200);
                }
                else {
                    const invalidPasswordError = createErrorResponse(false, 'Invalid Credentials', [], 'Invalid Credentials', 401, LOG_PRIORITY[3]);
                    next(ErrorHandler.customError(invalidPasswordError));
                }
            }
            else {
                if(response.status)
                    return response;
                const error = ErrorHandler.customError(response);
                next(error);
            }
        } catch (e) {
            console.log(e);
            
        }
    };
}

export default UserController;