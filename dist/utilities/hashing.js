"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareData = exports.encryptData = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
/**
 * Encrypts the given data using bcrypt hashing algorithm.
 * @param data - The data to be encrypted.
 * @returns A Promise that resolves to the encrypted hash.
 */
const encryptData = async (data) => {
    // Generate a hash using bcrypt with the specified number of salt rounds.
    const hash = await bcrypt_1.default.hash(data, Number(process.env.SALT_ROUNDS) || 10);
    return hash;
};
exports.encryptData = encryptData;
/**
 * Compares the given data with the provided hash using bcrypt.
 * @param data - The data to be compared.
 * @param hash - The hash to compare against.
 * @returns A Promise that resolves to a boolean indicating whether the data matches the hash.
 */
const compareData = async (data, hash) => {
    // Compare the data with the hash using bcrypt.
    const match = await bcrypt_1.default.compare(data, hash);
    return match;
};
exports.compareData = compareData;
