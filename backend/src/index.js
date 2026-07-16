import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5001;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log("Server is running on port: ", PORT);
console.log(process.env.MONGODB_URI.replace(/:(.*?)@/, ":****@"));
    connectDB();
})

// node -e "require('dns').promises.resolveSrv('_mongodb._tcp.chat-app.et37ujl.mongodb.net').then(console.log).catch(console.error)"