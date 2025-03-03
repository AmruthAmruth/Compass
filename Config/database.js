
import 'dotenv/config';
import mongoose from "mongoose";



export const MongodbConnection = mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
