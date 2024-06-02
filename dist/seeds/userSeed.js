"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../schema");
const hashing_1 = require("../utilities/hashing");
/**
 * Function to seed the database with an admin user
 * @returns void
 * @async
 */
const seed = async () => {
    const password = await (0, hashing_1.encryptData)("password");
    try {
        await schema_1.userModel.findOneAndUpdate({
            email: "admin@admin.com"
        }, {
            name: "admin",
            email: "admin@admin.com",
            password: password,
            role: "admin",
            created_at: new Date(),
            updated_at: new Date(),
            tests: []
        }, {
            upsert: true,
            new: true
        });
        console.log("User created successfully");
    }
    catch (err) {
        console.log(err);
    }
};
exports.default = seed;
