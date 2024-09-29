import mongoose from "mongoose";
import { MONGO_URI } from "../constants/env";


type CallbackFunction = () => Promise<void> | void;

const connectDB = async(callback:CallbackFunction)=>{
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Database has been connected...")
        await callback()
    }catch(error){
        console.log(`Error has occured during db connection:${error}`)
        process.exit(1);
    }
}

export default connectDB;