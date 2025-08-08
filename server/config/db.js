import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Exit the process with failure
        
    }
}
export default connectDB;