import mongoose from "mongoose";

import dotenv from "dotenv";

dotenv.config();

const connectDb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI as string ,);
        console.log(`data base connected successfully to ${conn.connection.host}`);
        
    }catch(e){
        console.error("Database connection failed due to:",e);
        process.exit(1);
    }
}

export default connectDb;