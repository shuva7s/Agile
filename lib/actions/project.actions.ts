"use server";
import Project from "../database/models/project.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export async function createProject(projectData: CreateProjectParams) {
  try {
    await connectToDatabase();

    const project = await Project.create(projectData);

    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    handleError(error);
  }
}

// Search by id
export async function getProjectById(projectId: string) {
  try {
    await connectToDatabase();

    // Find the project by ID
    const project = await Project.findById(projectId).exec();

    // Return the project data or null if not found
    return project ? JSON.parse(JSON.stringify(project)) : null;
  } catch (error) {
    // Return null in case of error
    return null;
  }
}
export async function getHostedProjectsByClerkUserId(
  currentClerkUser: string | null
) {
  try {
    await connectToDatabase();

    // Find all projects where hostClerkId matches the userId
    const projects = await Project.find({
      hostClerkId: currentClerkUser,
    }).exec();

    // Return the list of projects
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    return [];
  }
}

export async function getWorkingOnProjectsByClerkId(clerkId: string | null) {
  try {
    await connectToDatabase();

    // Find all projects where the people array contains the clerkId
    const projects = await Project.find({ people: clerkId }).exec();

    // Return the list of projects
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    return [];
  }
}
