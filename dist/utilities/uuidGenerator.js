"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuidGenerator = void 0;
const uuid_1 = require("uuid");
const uuidGenerator = () => {
    return (0, uuid_1.v4)();
};
exports.uuidGenerator = uuidGenerator;
