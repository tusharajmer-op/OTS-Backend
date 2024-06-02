import { NextFunction, Request} from "express";
import {UserModel} from '../models';
import { createToken } from "../services";
import { encryptData, compareData } from "../utilities/hashing";
import { ErrorHandler } from "../middlewares";
import { IUser } from "../schema";
import { apiResponse } from "../utilities/interfaces";
import { createErrorResponse, createResponse } from "../utilities/createResponse";
import { LOG_PRIORITY } from "../utilities/constants";
import { oauth2Client } from "../services";

// Define the structure of the verified user object
interface verifiedUser{
    data : Record<string,unknown>
    token : string
}

class UserController {
    UserModel = new UserModel();

    // Create a new user
    createNewUser = async (req: Request, next: NextFunction) : Promise<apiResponse|void> => {
        try {
            const userDetails = req.body;
            const hashedPassword = await encryptData(req.body.password);
            userDetails['password'] = hashedPassword;
            userDetails['tests'] = [];
            const response = await this.UserModel.store(userDetails);
    
            if (response.status) {
                const [user] = response.data as [Record<string,string>];
                const jwt = createToken({ "user_id": user.id, "role_id": user.role });
                user.token = jwt;
                const userWithoutSensitiveFields = { "id": user.id?.toString(), "role": user.role,"email":user.email,"name":user.name};
                const verifiedUser : verifiedUser = {"data": userWithoutSensitiveFields,"token":jwt};
                
                return createResponse(true, 'User Created Successfully', [verifiedUser], 201);
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

    // Login a user
    loginUser = async (req: Request, next: NextFunction) : Promise<apiResponse|void> => {
        try {
            const { email, password } = req.body;

            const response = await this.UserModel.getUserByEmail(email);
            if (response.code === 200) {
                const [user] = response.data as [IUser];
                if(user.oauthLogin){
                    const error = createErrorResponse(false, 'Invalid Credentials', [], 'Invalid Credentials', 401, LOG_PRIORITY[3]);
                    next(ErrorHandler.customError(error));
                }
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

    // Authenticate with Google
    googleAuth = async (req: Request, next: NextFunction) : Promise<apiResponse|void> => {
        const code = req.body.code;
        if (!code) {
            const error = createErrorResponse(false, 'Invalid Code', [], 'Invalid Code', 400, LOG_PRIORITY[3]);
            next(ErrorHandler.customError(error));
        }
        const googleRes = await oauth2Client().getToken(code as string);
        oauth2Client().setCredentials(googleRes.tokens);
        const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
        const googleUser = await googleResponse.json();
        const email = googleUser.email;
        const response = await this.UserModel.getUserByEmail(email);
        console.log(response);
        if (response.code === 200) {
            const [user] = response.data as [IUser];
            const jwt = createToken({ "user_id": user.id, "role_id": user.role });
            const userWithoutSensitiveFields = { "id": user.id?.toString(), "role": user.role,"email":user.email,"name":user.name};
            const verifiedUser : verifiedUser = {"data": userWithoutSensitiveFields,"token":jwt};
            return createResponse(true, 'User Logged In Successfully', [verifiedUser], 200);
        }
        else {
            const createUser : IUser = {
                name: googleUser.name,
                email: googleUser.email,
                password: '',
                role: 'user',
                tests: [],
                oauthLogin: true,
                created_at: new Date(),
                updated_at: new Date()
            };
            console.log("CREATE USER -> ", createUser);
            const response = await this.UserModel.store(createUser);
            if (response.status) {
                const [user] = response.data as [Record<string,string>];
                const jwt = createToken({ "user_id": user.id, "role_id": user.role });
                user.token = jwt;
                return createResponse(true, 'User Created Successfully', [user], 201);
            }
            else {
                console.log(response);
                const error = ErrorHandler.customError(response);
                next(error);
            }
        }
    };

    // Get user details
    getUserDetails = async(req: Request, next: NextFunction) : Promise<apiResponse|void> => {
        try{
            const user = req.body.payload.user_id ;
            const userDetails = await this.UserModel.getUserById(user);
            if(userDetails.code === 404){
                const error = createErrorResponse(false, 'User Not Found', [], 'User Not Found', 404, LOG_PRIORITY[3]);
                next(ErrorHandler.customError(error));
            }
            
            return userDetails as apiResponse;
        }catch(e){
            console.log(e);
            const err = createErrorResponse(false,'Internal Server Error',[], `${e}` ,500,LOG_PRIORITY[3]);
            next(err);
        }
    };
}

export default UserController;
