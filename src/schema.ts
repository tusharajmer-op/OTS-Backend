import {Schema, model} from 'mongoose';

export interface IUser {
    id? : string
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: Date;
    updated_at: Date;
    tests: {
        test: string;
        result: number;
    }[];
}

export interface IQuestion {
    _id ? : Schema.Types.ObjectId;
    question: string;
    options: string[];
    answer: string;
    created_at: Date;
    updated_at: Date;
    difficulty: string;
    tag: string[];
}
export interface IAskedQuestion{
    question : string;
    options : string[];
    correctAnswer : string
    answer : string;
    status : string;
}
export interface ITest {
    user_id: Schema.Types.ObjectId;
    questions: IAskedQuestion[];
    created_at: Date;
    updated_at: Date;

};

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    },
    created_at: {
        type : Date,
        default: Date.now,
    },
    updated_at: Date,
    tests : [
        {
            test : {
                type: Schema.Types.ObjectId,
                ref: 'Test',
            },
            result : {
                type: Number,
            },

        }

    ],
});

const question = new Schema<IQuestion>({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    created_at: {
        type : Date,
        default: Date.now,
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'easy',
    },
    tag :[
        {
            type: String,
            required: true,
        }],
    updated_at: Date,
});

const attemptedQuestion = new Schema<IAskedQuestion>({
    question : {
        type : String,
        required : true,

    },
    options : {
        type : [String],
        required : true
    },
    correctAnswer : {
        type : String,
        required : true
    },
    answer : {
        type : String
    },
    status : {
        type : String,
        enum : ['Correct','Incorrect','Skipped'],
        required : true
    },

});

const test = new Schema<ITest>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    questions: [attemptedQuestion],
    created_at: {
        type : Date,
        default: Date.now,
    },
    updated_at: Date,
});

const userModel = model<IUser>('User', userSchema);
const questionModel = model<IQuestion>('Question', question);
const testModel = model<ITest>('Test', test);


export {
    userModel,
    questionModel,
    testModel,
};
