import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const MONGOOSE_URI=process.env.MONGOOSE_URI



const connectDB = async()=>{
    try{
        const connection =await mongoose.connect(`${MONGOOSE_URI}`)
        console.log(`mongoDB connected successfully! ${connection.connection.host}`);
        
    }catch(error){
        console.log(`Error conencting to db - ${error}`);
        process.exit(1)
    }
}

export default connectDB