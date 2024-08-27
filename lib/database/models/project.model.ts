import { Schema, model, Document, models, Types } from "mongoose";

// Define the TypeScript interface for Task
export interface IJoinRequest {
  _id: Types.ObjectId;
  senderClerkId: string;
  senderMail: string;
  username: string;
  userImage: string;
  accepted: boolean; // New field to track acceptance status
}
const JoinRequestSchema = new Schema<IJoinRequest>({
  senderClerkId: {
    type: String,
    required: true,
  },
  senderMail: {
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

// Define the TypeScript interface for People
export interface IPerson {
  _id: Types.ObjectId;
  userId: string;
  username: string;
  userEmail: string;
  userImage: string;
}
// Define the Mongoose schema for Person
const PersonSchema = new Schema<IPerson>({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    required: true,
  },
});

export interface ITask {
  _id: Types.ObjectId;
  task: string;
  assignedPeople: IPerson[];
  taskLocation:
    | "requirements"
    | "designing"
    | "pending_designing"
    | "development"
    | "pending_development"
    | "testing"
    | "pending_testing"
    | "deployment"
    | "pending_deployment"
    | "done";
  isComplete: boolean;
}

const TaskSchema = new Schema<ITask>({
  task: {
    type: String,
    required: true,
  },
  assignedPeople: [
    {
      type: PersonSchema,
    },
  ],
  taskLocation: {
    type: String,
    enum: [
      "requirements",
      "designing",
      "pending_designing",
      "development",
      "pending_development",
      "testing",
      "pending_testing",
      "deployment",
      "pending_deployment",
      "done",
    ],
    required: true,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
});

// Define the TypeScript interface for Project

export interface IProject extends Document {
  hostClerkId: string;
  projectName: string;
  projectDescription?: string;
  people: IPerson[]; // Array of Person objects

  designing: ITask[]; // New field: Array of Task objects for designing
  pending_designing: ITask[]; // New field: Array of Task objects for pending designing
  development: ITask[]; // New field: Array of Task objects for development
  pending_development: ITask[]; // New field: Array of Task objects for pending development
  testing: ITask[]; // New field: Array of Task objects for testing
  pending_testing: ITask[]; // New field: Array of Task objects for pending testing
  deployment: ITask[]; // New field: Array of Task objects for deployment
  pending_deployment: ITask[]; // New field: Array of Task objects for pending deployment
  done: ITask[]; // Array of Task objects for done

  joinRequests: IJoinRequest[]; // Array of JoinRequest objects
  timeSlice: number; // Field for time slice
  hasStarted: boolean; // Field to check if the project has started
  requirements: ITask[]; // Array of Task objects for requirements
  createdAt: Date; // Field for project creation date
  updatedAt: Date; // Field for project last updated date
}

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
  designing: [TaskSchema], // Array of Task objects for designing
  pending_designing: [TaskSchema], // Array of Task objects for pending designing
  development: [TaskSchema], // Array of Task objects for development
  pending_development: [TaskSchema], // Array of Task objects for pending development
  testing: [TaskSchema], // Array of Task objects for testing
  pending_testing: [TaskSchema], // Array of Task objects for pending testing
  deployment: [TaskSchema], // Array of Task objects for deployment
  pending_deployment: [TaskSchema], // Array of Task objects for pending deployment
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
