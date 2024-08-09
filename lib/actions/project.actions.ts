import Project from "../database/models/project.model";
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
