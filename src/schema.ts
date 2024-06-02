import mongoose, { Schema, model } from 'mongoose';

// Define the IUser interface for user data
export interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: Date;
    updated_at: Date;
    oauthLogin?: boolean;
    tests: {
        test: string;
        result: number;
    }[];
}

// Define the IQuestion interface for question data
export interface IQuestion {
    _id?: Schema.Types.ObjectId;
    question: string;
    options: string[];
    answer: string;
    created_at: Date;
    updated_at: Date;
    difficulty: number;
    tag: string[];
}

// Define the IAskedQuestion interface for asked question data
export interface IAskedQuestion {
    questionId: mongoose.Types.ObjectId;
    question: string;
    options: string[];
    correctAnswer: string;
    answer: string | null;
    status: string;
    difficulty: number;
    tag: string[];
}

// Define the ITest interface for test data
export interface ITest {
    _id?: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    questions: IAskedQuestion[];
    created_at: Date;
    updated_at: Date;
    score: number;
}

// Define the userSchema for the User model
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
    },
    oauthLogin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: Date,
    tests: [
        {
            test: {
                type: mongoose.Types.ObjectId,
                ref: 'Test',
            },
            result: {
                type: Number,
            },
        },
    ],
});

// Define the question schema for the Question model
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
        type: Date,
        default: Date.now,
    },
    difficulty: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        default: 5,
    },
    tag: [
        {
            type: String,
            required: true,
        },
    ],
    updated_at: Date,
});

// Define the attemptedQuestion schema for the AskedQuestion model
const attemptedQuestion = new Schema<IAskedQuestion>({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
    },
    question: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
    correctAnswer: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Correct', 'Incorrect', 'Unanswered'],
        required: true,
    },
    difficulty: {
        type: Number,
        required: true,
    },
    tag: [
        {
            type: String,
            required: true,
        },
    ],
});

// Define the test schema for the Test model
const test = new Schema<ITest>({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    questions: [attemptedQuestion],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: Date,
    score: {
        type: Number,
        required: true,
    },
});

// Create the User model
const userModel = model<IUser>('User', userSchema);

// Create the Question model
const questionModel = model<IQuestion>('Question', question);

// Create the Test model
const testModel = model<ITest>('Test', test);

// Export the models
export {
    userModel,
    questionModel,
    testModel,
};
