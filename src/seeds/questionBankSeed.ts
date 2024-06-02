import { IQuestion, questionModel } from "../schema";
import data from '../resources/question_bank.json';
/**
 * Seed the question bank.
 * @returns A promise that resolves to a success message or an error.
 * @async
 * @function
 * @name seed
 **/
const seed = async () => {
    try {
        const convertedData = data.map<IQuestion>((question) => ({
            ...question,
            created_at: new Date(),
            updated_at: new Date(),
        })) as IQuestion[];

        await questionModel.deleteMany({});
        await questionModel.insertMany<IQuestion>(convertedData);
        console.log("Question Bank seeded successfully");
    } catch (err) {
        console.log(err);
    }
};

export default seed;