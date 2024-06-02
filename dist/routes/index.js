"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultRouter = exports.testRoute = exports.userRoute = void 0;
const userRoutes_1 = __importDefault(require("./userRoutes"));
exports.userRoute = userRoutes_1.default;
const testRoutes_1 = __importDefault(require("./testRoutes"));
exports.testRoute = testRoutes_1.default;
const resultRoutes_1 = __importDefault(require("./resultRoutes"));
exports.resultRouter = resultRoutes_1.default;
