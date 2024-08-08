import { Schema, model, models, Document } from "mongoose";

// Define the Mongoose schema
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
});

// Create the TypeScript interface
export interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
}

// Create the Mongoose model
// const User = models?.User || model("User", UserSchema);
const User = models?.User || model<IUser>("User", UserSchema);

export default User;
