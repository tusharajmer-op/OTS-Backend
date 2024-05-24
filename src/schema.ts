import mongoose, {Schema, model} from 'mongoose';

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
    difficulty: number;
    tag: string[];
}
export interface IAskedQuestion{
    questionId : mongoose.Types.ObjectId;
    question : string;
    options : string[];
    correctAnswer : string
    answer : string | null;
    status : string;
}
export interface ITest {
    _id ? : mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
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
        type: Number,
        enum: [1,2,3,4,5,6,7,8,9,10],
        default: 5,
    },
    tag :[
        {
            type: String,
            required: true,
        }],
    updated_at: Date,
});

const attemptedQuestion = new Schema<IAskedQuestion>({
    questionId : {
        type : Schema.Types.ObjectId,
        ref : 'Question'
    },
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
        enum : ['Correct','Incorrect','Skipped','Unanswered'],
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
