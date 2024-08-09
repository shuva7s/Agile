import { Schema, model, Document, models } from "mongoose";
import { IUser } from "./user.model"; // Adjust the path to your User model

// Define the TypeScript interface for Project
export interface IProject extends Document {
  hostClerkId: string;
  projectName: string;
  projectDescription?: string;
  people: string[]; // Array of clerk IDs (strings)
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema for Project
const ProjectSchema = new Schema({
  hostClerkId: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
  },
  people: [String], // Array of clerk IDs (strings)
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Project model
const Project = models.Project || model<IProject>("Project", ProjectSchema);

export default Project;
