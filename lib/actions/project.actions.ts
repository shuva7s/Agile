"use server";
import { currentUser } from "@clerk/nextjs/server";
import Project, {
  IJoinRequest,
  ILog,
  IPerson,
  IProject,
  ITask,
} from "../database/models/project.model";
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

// Function to get hosted projects by Clerk user ID
// export async function getHostedProjectsByClerkUserId(
//   userId: string,
//   limit: number,
//   offset: number
// ) {
//   try {
//     await connectToDatabase();
//     const projects = await Project.find({ hostClerkId: userId })
//       .sort({ createdAt: -1 })
//       .skip(offset)
//       .limit(limit)
//       .lean<IProject[]>()
//       .exec();

//     // Convert ObjectId and Date fields to plain types
//     return JSON.stringify(projects);
//   } catch (error) {
//     console.error("Error fetching hosted projects:", error);
//     return [];
//   }
// }

// // Function to get working-on projects by Clerk user ID
// export async function getWorkingOnProjectsByClerkId(
//   userId: string,
//   limit: number,
//   offset: number
// ) {
//   try {
//     await connectToDatabase();
//     const projects = await Project.find({ "people.userId": userId })
//       .sort({ createdAt: -1 })
//       .skip(offset)
//       .limit(limit)
//       .lean<IProject[]>()
//       .exec();
//     return JSON.stringify(projects);
//   } catch (error) {
//     console.error("Error fetching working-on projects:", error);
//     return [];
//   }
// }

// export async function fetchProjects(
//   type: "hosted" | "working",
//   page: number,
//   limit: number
// ): Promise<{ projects: IProject[]; hasMoreProjects: boolean }> {
//   try {
//     const user = await currentUser();
//     const userId = user?.id || "";
//     const offset = (page - 1) * limit;

//     // Fetch projects as JSON strings
//     const projectsJson =
//       type === "hosted"
//         ? await getHostedProjectsByClerkUserId(userId, limit, offset)
//         : await getWorkingOnProjectsByClerkId(userId, limit, offset);

//     // Parse JSON strings to objects
//     const projects: IProject[] = JSON.parse(projectsJson as any);

//     const hasMoreProjects = projects.length === limit;

//     return { projects, hasMoreProjects };
//   } catch (error) {
//     handleError(error);
//     return { projects: [], hasMoreProjects: false };
//   }
// }

export async function fetchProjects(
  type: "hosted" | "working",
  page: number,
  limit: number
): Promise<{ projects: IProject[]; hasMoreProjects: boolean }> {
  try {
    await connectToDatabase();
    const user = await currentUser();
    const userId = user?.id || "";
    const offset = (page - 1) * limit;

    let projectsJson: string;
    let totalProjectsCount: number;

    if (type === "hosted") {
      // Fetch projects as JSON string and count for hosted projects
      projectsJson = JSON.stringify(
        await Project.find({ hostClerkId: userId })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean<IProject[]>()
          .exec()
      );

      totalProjectsCount = await Project.countDocuments({
        hostClerkId: userId,
      });
    } else {
      // Fetch projects as JSON string and count for working-on projects
      projectsJson = JSON.stringify(
        await Project.find({ "people.userId": userId })
          .sort({ createdAt: -1 })
          .skip(offset)
          .limit(limit)
          .lean<IProject[]>()
          .exec()
      );

      totalProjectsCount = await Project.countDocuments({
        "people.userId": userId,
      });
    }

    // Parse JSON string to objects
    const projects: IProject[] = JSON.parse(projectsJson);

    // Determine if there are more projects to load
    const hasMoreProjects = offset + limit < totalProjectsCount;

    return { projects, hasMoreProjects };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return { projects: [], hasMoreProjects: false };
  }
}
