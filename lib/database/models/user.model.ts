import { Schema, model, models, Document, Types } from "mongoose";

// Create the TypeScript interface for User
export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  hostedProjects: Types.ObjectId[];
  workingOnProjects: Types.ObjectId[];
}

// Define the Mongoose schema for User
const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  hostedProjects: [
    {
      type: Types.ObjectId,
      ref: "Project",
    },
  ],
  workingOnProjects: [
    {
      type: Types.ObjectId,
      ref: "Project",
    },
  ],
});

// Create the Mongoose model for User
const User = models?.User || model<IUser>("User", UserSchema);

export default User;
