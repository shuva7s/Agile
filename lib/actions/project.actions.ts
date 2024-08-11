"use server";
import Project from "../database/models/project.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE
export async function createProject(projectData: CreateProjectParams) {
  try {
    await connectToDatabase();

    // Create the project
    const project = await Project.create(projectData);

    // Find the user by hostClerkId and add the project's _id to hostedProjects
    await User.updateOne(
      { clerkId: projectData.hostClerkId },
      { $push: { hostedProjects: project._id } }
    );

    return JSON.parse(JSON.stringify(project));
  } catch (error) {
    handleError(error);
    return null;
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
export async function getHostedProjectsByClerkUserId(currentClerkUser: string) {
  try {
    await connectToDatabase();

    // Find the user by their Clerk user ID
    const user = await User.findOne({ clerkId: currentClerkUser })
      .populate("hostedProjects") // Populates the hostedProjects with actual project data
      .exec();

    // If the user is not found or has no hosted projects, return an empty array
    if (!user || !user.hostedProjects) {
      return [];
    }

    // Return the list of hosted projects
    return JSON.parse(JSON.stringify(user.hostedProjects));
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getWorkingOnProjectsByClerkId(clerkId: string | null) {
  try {
    await connectToDatabase();

    if (!clerkId) {
      return [];
    }

    // Find all projects where the people array contains an object with the matching userId
    const projects = await Project.find({ "people.userId": clerkId }).exec();

    // Return the list of projects
    return JSON.parse(JSON.stringify(projects));
  } catch (error) {
    handleError(error);
    return [];
  }
}
