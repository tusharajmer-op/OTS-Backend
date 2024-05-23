import {connect, disconnect} from "mongoose";
import {config} from "dotenv";
import userSeed from "./userSeed";
import questionBandSeed from "./questionBankSeed";
config();
const uri = process.env.MONGO_URI as string;


connect(uri).then(async()=>{
    console.log("Connected to database");
    await userSeed();
    await questionBandSeed();
}).catch((err)=>{
    console.log("Error connecting to database");
    console.log(err);
}).finally(()=>{
    disconnect();
    process.exit(1);
});