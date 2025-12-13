import mongoose from "mongoose";
import dotenv from 'dotenv/config'

export async function dbConnect() {
    try {
        await mongoose.connect(process.env.URL)
        console.log('Mongo db connected');

    } catch (error) {
        console.log('Mongo db not connetced', error);

    }
}