import { IUser, userModel } from "../schema";
import { encryptData } from "../utilities/hashing";
/**
 * Function to seed the database with an admin user
 * @returns void
 * @async
 */
const seed = async () => {
    const password = await encryptData("password");
    try {
        await userModel.findOneAndUpdate<IUser>(
            {
                email: "admin@admin.com"
            },
            {
                name: "admin",
                email: "admin@admin.com",
                password: password,
                role: "admin",
                created_at: new Date(),
                updated_at: new Date(),
                tests: []
            },
            {
                upsert: true,
                new: true
            }
        );
        console.log("User created successfully");
    } catch (err) {
        console.log(err);
    }
};

export default seed;
