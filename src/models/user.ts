import { Schema, InferSchemaType, model } from "mongoose";

// Schema
const user = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        avatar: String,
    },
    {
        timestamps: true, // This will add `createdAt` and `updatedAt` fields
    },
);

export type User = InferSchemaType<typeof user> & {
    createdAt: Date;
    updatedAt: Date;
};

// `UserModel` will have `name: string`, etc.
export const UserModel = model<User>("User", user);
