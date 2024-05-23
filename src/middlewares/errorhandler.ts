import Logger from '../services/loggerService';
import { errorResponse } from '../utilities/interfaces';
class ErrorHandler extends Error{
    code: number; 
    constructor(message : string, code : number = 500, logInto : string){
        console.log(logInto);
        super();
        this.message = message;
        this.code = code;
        // console.log(global);
        (Logger as any)[logInto](message);
    }
    static customError=(error: errorResponse)=>{
        return new ErrorHandler(error.message,error.code,error.log);
    };
}
export default ErrorHandler;