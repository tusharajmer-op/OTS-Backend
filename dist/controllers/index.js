"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultController = exports.TestController = exports.UserController = void 0;
const user_1 = __importDefault(require("./user"));
exports.UserController = user_1.default;
const testController_1 = __importDefault(require("./testController"));
exports.TestController = testController_1.default;
const result_1 = __importDefault(require("./result"));
exports.ResultController = result_1.default;
