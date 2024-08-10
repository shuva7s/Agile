import { Schema, model, Document, models, Types } from "mongoose";

// Define the TypeScript interface for Task
interface ITask {
  task: string;
  assignedPeople: string[]; // Array of Clerk user IDs
}

// Define the Mongoose schema for Log
export interface ILog {
  prefix: string;
  body: string;
  suffix: string;
  logCreationTime: Date;
}

// Define the TypeScript interface for JoinRequest
interface IJoinRequest {
  userId: string;
  username: string;
}

// Define the TypeScript interface for Project
export interface IProject extends Document {
  _id: Types.ObjectId; // Mongoose ObjectId type
  hostClerkId: string;
  projectName: string;
  projectDescription?: string;
  people: string[]; // Array of Clerk IDs (strings)
  logs: ILog[]; // Array of logs
  todo: ITask[]; // Array of tasks for todo
  inProgress: ITask[]; // Array of tasks for in-progress
  testing: ITask[]; // Array of tasks for testing
  done: ITask[]; // Array of tasks for done
  joinRequests: IJoinRequest[]; // Array of join request objects
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Mongoose schema for Log
const LogSchema = new Schema<ILog>({
  prefix: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  suffix: {
    type: String,
    required: true,
  },
  logCreationTime: {
    type: Date,
    default: Date.now, // Automatically sets the creation time
    required: true,
  },
});

// Define the Mongoose schema for Task
const TaskSchema = new Schema<ITask>({
  task: {
    type: String,
    required: true,
  },
  assignedPeople: [
    {
      type: String,
      required: true,
    },
  ],
});

// Define the Mongoose schema for JoinRequest
const JoinRequestSchema = new Schema<IJoinRequest>({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

// Define the Mongoose schema for Project
const ProjectSchema = new Schema<IProject>({
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
  people: [String], // Array of Clerk IDs (strings)
  logs: [LogSchema], // Array of Log objects
  todo: [TaskSchema], // Array of Task objects for todo
  inProgress: [TaskSchema], // Array of Task objects for in-progress
  testing: [TaskSchema], // Array of Task objects for testing
  done: [TaskSchema], // Array of Task objects for done
  joinRequests: [JoinRequestSchema], // Array of JoinRequest objects
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
const Project = models?.Project || model<IProject>("Project", ProjectSchema);

export default Project;
