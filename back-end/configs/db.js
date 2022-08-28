import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URI = process.env.MONGODB_URL;
export const connectDb = () => {
  mongoose.connect(
    URI,

    (err) => {
      if (err) throw err;
      console.log("Connected to mongodb");
    }
  );
};
