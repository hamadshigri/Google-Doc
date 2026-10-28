import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

export const connectDB = () => {
     mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log('Connected!');
    }).catch((err) => {
    console.log(err);
    })
}