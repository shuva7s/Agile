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
import { Types } from "mongoose";
import { userInfo } from "./userInfo.action";

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
export async function getProjectRequirements(projectId: string) {
  try {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }
    const project = await Project.findById(projectId).select("requirements");
    if (!project || !project.requirements) {
      return [];
    }
    return project.requirements.reverse(); // Return the array directly
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function addRequirement(
  projectId: string,
  taskName: string
): Promise<string> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId)) {
      return "invalid_id";
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return "not_found";
    }

    const newTask = {
      task: taskName,
      assignedPeople: [],
    };

    project.requirements.push(newTask);

    await project.save();
    return "success";
  } catch (error) {
    handleError(error);
    return "error";
  }
}

export async function moveTaskToTodo(
  projectId: string,
  taskId: string
): Promise<string> {
  try {
    await connectToDatabase();

    const project = await Project.findById(projectId);
    if (!project) {
      return "project_not_found";
    }

    const taskIndex = project.requirements.findIndex(
      (task: ITask) => task._id.toString() === taskId
    );
    if (taskIndex === -1) {
      return "task_not_found";
    }

    // Remove the task from requirements and add it to the todo list
    const task = project.requirements.splice(taskIndex, 1)[0];
    project.todo.push(task);

    await project.save();

    return "success";
  } catch (error) {
    console.error("Error moving task to TODO:", error);
    return "error";
  }
}

export async function getAllTodos(projectId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    const project = await Project.findById(projectId);

    if (!project || !project.todo) {
      return [];
    }

    return project.todo.reverse();
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function moveTaskBackToRequirements(
  projectId: string,
  taskId: string
): Promise<string> {
  try {
    await connectToDatabase();

    const project = await Project.findById(projectId);
    if (!project) {
      return "project_not_found";
    }

    // Find the task in TODO or InProgress
    let taskIndex = project.todo.findIndex(
      (task: ITask) => task._id.toString() === taskId
    );

    if (taskIndex === -1) {
      taskIndex = project.inProgress.findIndex(
        (task: ITask) => task._id.toString() === taskId
      );

      if (taskIndex !== -1) {
        const task = project.inProgress.splice(taskIndex, 1)[0];
        task.assignedPeople = []; // Remove all assigned people
        project.requirements.push(task);
      } else {
        return "task_not_found";
      }
    } else {
      const task = project.todo.splice(taskIndex, 1)[0];
      task.assignedPeople = []; // Remove all assigned people
      project.requirements.push(task);
    }

    await project.save();
    return "success";
  } catch (error) {
    console.error("Error moving task back to Requirements:", error);
    return "error";
  }
}

// Function to join a task and move it to InProgress
export async function joinTaskFunc(
  projectId: string,
  taskId: string
): Promise<string> {
  try {
    await connectToDatabase(); // Ensure you're connected to the database

    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return "invalid_ids";
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return "project_not_found";
    }

    // Fetch the currently logged-in user's information
    const { userId, userName, userMail, userImage } = await userInfo();

    if (!userId) {
      return "user_not_found";
    }

    // Find the task in TODO or InProgress
    let task =
      project.todo.find((task: ITask) => task._id.toString() === taskId) ||
      project.inProgress.find((task: ITask) => task._id.toString() === taskId);

    if (!task) {
      return "task_not_found";
    }

    // Initialize the assignedPeople array if it's undefined
    if (!task.assignedPeople) {
      task.assignedPeople = [];
    }

    // Check if the user has already joined the task
    const alreadyJoined = task.assignedPeople.some(
      (person: IPerson) => person.userId === userId
    );
    if (alreadyJoined) {
      return "already_joined";
    }

    // Add user to the task's assigned people using the PersonSchema
    task.assignedPeople.push({
      _id: new Types.ObjectId(), // Generates a new ObjectId for this person
      userId,
      username: userName,
      userEmail: userMail,
      userImage,
    });

    // If the task is in TODO, move it to InProgress
    if (project.todo.some((task: ITask) => task._id.toString() === taskId)) {
      project.todo = project.todo.filter(
        (task: ITask) => task._id.toString() !== taskId
      );
      project.inProgress.push(task);
    }

    await project.save();

    return "success";
  } catch (error) {
    handleError(error);
    return "error";
  }
}

export async function getInProgressTasks(projectId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    const project = await Project.findById(projectId);

    if (!project || !project.inProgress) {
      return [];
    }

    return project.inProgress.reverse();
  } catch (error) {
    handleError(error);
    return [];
  }
}
