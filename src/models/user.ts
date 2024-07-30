import { Schema, InferSchemaType, model } from "mongoose";

// Schema
const user = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: String,
});

export type User = InferSchemaType<typeof user>;

// `UserModel` will have `name: string`, etc.
export const UserModel = model<User>("User", user);
