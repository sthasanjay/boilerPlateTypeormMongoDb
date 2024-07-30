import mongoose from "mongoose";

// const database = process.env.DATABASE ?? "";
// const databasePassword = process.env.DATABASE_PASSWORD ?? "";

// const DB = database.replace("<password>", databasePassword);

// const DB = `mongodb+srv://admin:wf1yXLNHJgGbax90@cluster0.awp97.mongodb.net/customerCare?retryWrites=true&w=majority`;

const DB = `mongodb+srv://sanjay:SrLEGJI9gu0eiZzs@cluster0.gqsepqv.mongodb.net/customerCareTypescript?retryWrites=true&w=majority&appName=Cluster0`;

// Use an async function to properly await the promise
export async function connectToDatabase() {
    try {
        await mongoose.connect(DB, {});
        console.log("DB connection successful!");
    } catch (error: any) {
        console.error("DB connection error:", error.message);
        // Optionally, handle the error here
        // process.exit(1); // You might choose to exit the process on connection error
    }
}
