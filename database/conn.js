import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
export async function connectDB()
{
    try {
        
        await mongoose.connect(process.env.MONGO_URL)

        console.log("data base connected");
        
    } catch (error) {
        console.log("connection failed");
        // next(new Error(error))
    }
}