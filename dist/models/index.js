"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModel = exports.QuestionModel = exports.UserModel = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
exports.UserModel = userModel_1.default;
const questionModel_1 = __importDefault(require("../models/questionModel"));
exports.QuestionModel = questionModel_1.default;
const testModel_1 = __importDefault(require("./testModel"));
exports.TestModel = testModel_1.default;
