import { Schema, model, Document, models, Types } from "mongoose";
import { string } from "zod";

// Define the TypeScript interface for Task
export interface ITask {
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

// Define the TypeScript interface for People
export interface IPerson {
  _id: Types.ObjectId;
  userImage: string;
  userId: string;
  username: string;
}

// Define the TypeScript interface for Project
export interface IProject extends Document {
  _id: Types.ObjectId; // Mongoose ObjectId type
  hostClerkId: string;
  projectName: string;
  projectDescription?: string;
  people: IPerson[]; // Array of objects storing both userId and username
  logs: ILog[]; // Array of logs
  todo: ITask[]; // Array of tasks for todo
  inProgress: ITask[]; // Array of tasks for in-progress
  testing: ITask[]; // Array of tasks for testing
  done: ITask[]; // Array of tasks for done
  joinRequests: IJoinRequest[]; // Array of join request objects
  timeSlice: number; // New field for time slices
  hasStarted: boolean; // New field to track if the project has started
  requirements: ITask[]; // Array of tasks as requirements
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

export interface IJoinRequest {
  _id: Types.ObjectId;
  userId: string;
  username: string;
  userImage: string;
  accepted: boolean; // New field to track acceptance status
}
const JoinRequestSchema = new Schema<IJoinRequest>({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    required: true,
  },
  accepted: {
    type: Boolean,
    default: false, // Default to false until the request is accepted
    required: true,
  },
});

// Define the Mongoose schema for Person
const PersonSchema = new Schema<IPerson>({
  userImage: {
    type: String,
    required: true,
  },
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
  people: [PersonSchema], // Array of Person objects
  logs: [LogSchema], // Array of Log objects
  todo: [TaskSchema], // Array of Task objects for todo
  inProgress: [TaskSchema], // Array of Task objects for in-progress
  testing: [TaskSchema], // Array of Task objects for testing
  done: [TaskSchema], // Array of Task objects for done
  joinRequests: [JoinRequestSchema], // Array of JoinRequest objects
  timeSlice: {
    type: Number,
    default: 0,
  },
  hasStarted: {
    type: Boolean,
    default: false,
  },
  requirements: [TaskSchema], // Array of Task objects for requirements
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
