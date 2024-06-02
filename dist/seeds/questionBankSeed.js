"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../schema");
const question_bank_json_1 = __importDefault(require("../resources/question_bank.json"));
/**
 * Seed the question bank.
 * @returns A promise that resolves to a success message or an error.
 * @async
 * @function
 * @name seed
 **/
const seed = async () => {
    try {
        const convertedData = question_bank_json_1.default.map((question) => ({
            ...question,
            created_at: new Date(),
            updated_at: new Date(),
        }));
        await schema_1.questionModel.deleteMany({});
        await schema_1.questionModel.insertMany(convertedData);
        console.log("Question Bank seeded successfully");
    }
    catch (err) {
        console.log(err);
    }
};
exports.default = seed;
