import mongoose from "mongoose"
import { ENV } from "./env.js";

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(ENV.MONGO_URI);
        console.log("MONGO_DB connected: ", connection.connection.host);
    } catch (error) {
        console.error("Connection failed: ", error);
        process.exit(1);    
    }
}