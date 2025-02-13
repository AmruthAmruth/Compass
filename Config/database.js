// Load environment variables from .env file
import 'dotenv/config';
import mongoose from "mongoose";

const PORT = process.env.PORT || 7000;

export const MongodbConnection = mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
