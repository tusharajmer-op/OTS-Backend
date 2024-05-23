import joi,{ObjectSchema} from 'joi';

interface IRouteToSchema{
    [key : string] : ()=> ObjectSchema
}

const signupForm = (): ObjectSchema =>{
    return joi.object({
        name : joi.string().required(),
        email : joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,).required(),
        password : joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/).required(),

    });
};

const loginForm = (): ObjectSchema =>{
    return joi.object({
        email : joi.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,).required(),
        password : joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/).required(),

    });
};
const questionForm = (): ObjectSchema =>{
    return joi.object({
        test_id : joi.string().required(),
        question_id : joi.string().required(),
        answer : joi.string().required()

    });
};


export const routeToSchema : IRouteToSchema = {
    "/sign-up" :  signupForm,
    "/log-in" : loginForm,
    "/test/question": questionForm
};