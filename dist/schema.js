"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testModel = exports.questionModel = exports.userModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Define the userSchema for the User model
const userSchema = new mongoose_1.Schema({
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
                type: mongoose_1.default.Types.ObjectId,
                ref: 'Test',
            },
            result: {
                type: Number,
            },
        },
    ],
});
// Define the question schema for the Question model
const question = new mongoose_1.Schema({
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
        indexes: true,
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
const attemptedQuestion = new mongoose_1.Schema({
    questionId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const test = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        indexes: true,
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
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.userModel = userModel;
// Create the Question model
const questionModel = (0, mongoose_1.model)('Question', question);
exports.questionModel = questionModel;
// Create the Test model
const testModel = (0, mongoose_1.model)('Test', test);
exports.testModel = testModel;
