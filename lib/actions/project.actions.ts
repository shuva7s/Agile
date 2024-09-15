"use server";
import { currentUser } from "@clerk/nextjs/server";
import Project, {
  IJoinRequest,
  IPerson,
  IProject,
  ITask,
} from "../database/models/project.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { Types } from "mongoose";
import { userInfo } from "./userInfo.action";

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
    handleError(error);
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
      taskLocation: "requirements",
      isComplete: false,
    };

    project.requirements.push(newTask);

    await project.save();
    return "success";
  } catch (error) {
    handleError(error);
    return "error";
  }
}

export async function moveTaskToDesign(
  projectId: string,
  taskId: string
): Promise<string> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return "invalid_id";
    }

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

    // Remove the task from requirements
    const task = project.requirements.splice(taskIndex, 1)[0];

    // Update taskLocation to 'todo'
    task.taskLocation = "designing";

    // Add the updated task to the todo list
    project.designing.push(task);

    await project.save();

    return "success";
  } catch (error) {
    handleError(error);
    return "error";
  }
}

export async function getAllDesigningTasks(projectId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    const project = await Project.findById(projectId);

    if (!project || !project.designing) {
      return [];
    }

    return project.designing.reverse();
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getAllDevelopmentTasks(projectId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    const project = await Project.findById(projectId);

    if (!project || !project.development) {
      return [];
    }

    return project.development.reverse();
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getAllTestingTasks(projectId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    const project = await Project.findById(projectId);

    if (!project || !project.testing) {
      return [];
    }

    return project.testing.reverse();
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getAllDeploymentTasks(projectId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    const project = await Project.findById(projectId);

    if (!project || !project.deployment) {
      return [];
    }

    return project.deployment.reverse();
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getAllDoneTasks(projectId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    const project = await Project.findById(projectId);

    if (!project || !project.done) {
      return [];
    }

    return project.done.reverse();
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function getUserJoinedTasks(projectId: string) {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId)) {
      return [];
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return [];
    }

    // Fetch the currently logged-in user's information
    const { userId } = await userInfo();
    if (!userId) {
      return [];
    }

    // Define all sections from which the user may have joined tasks
    const taskSections = [
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
    ];

    // Collect tasks where the current user is in the assignedPeople array
    const userTasks: ITask[] = [];

    for (const section of taskSections) {
      const tasksInSection = project[section].filter((task: ITask) =>
        task.assignedPeople.some((person) => person.userId === userId)
      );
      userTasks.push(...tasksInSection);
    }

    return userTasks.reverse();
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

    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return "invalid_id";
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return "project_not_found";
    }

    // All task sections where the task might be present
    const taskSections = [
      "designing",
      "pending_designing",
      "development",
      "pending_development",
      "testing",
      "pending_testing",
      "deployment",
      "pending_deployment",
    ];

    let taskFound = false;

    // Search for the task in each section
    for (const section of taskSections) {
      const taskIndex = project[section].findIndex(
        (task: ITask) => task._id.toString() === taskId
      );

      if (taskIndex !== -1) {
        const task = project[section].splice(taskIndex, 1)[0];
        task.assignedPeople = []; // Remove all assigned members
        task.isComplete = false;

        // Update taskLocation to 'requirements'
        task.taskLocation = "requirements";

        project.requirements.push(task);
        taskFound = true;
        break; // Exit the loop once the task is found and moved
      }
    }

    if (!taskFound) {
      return "task_not_found";
    }

    await project.save();
    return "success";
  } catch (error) {
    console.error("Error moving task back to Requirements:", error);
    return "error";
  }
}

export async function getTaskStatus(
  projectId: string,
  taskId: string
): Promise<string> {
  try {
    await connectToDatabase(); // Ensure database connection

    const project = await Project.findById(projectId);
    if (!project) {
      return "project_not_found";
    }

    // Find the task in all project tasks
    const allTasks = project.requirements.concat(
      project.designing,
      project.pending_designing,
      project.development,
      project.pending_development,
      project.testing,
      project.pending_testing,
      project.deployment,
      project.pending_deployment,
      project.done
    );

    const task = allTasks.find((task: ITask) => task._id.toString() === taskId);

    if (!task) {
      return "task_not_found";
    }

    return task.taskLocation; // Directly return the task's location
  } catch (error) {
    console.error("Error getting task location:", error);
    return "error";
  }
}

export async function joinTaskFunc(
  projectId: string,
  taskId: string
): Promise<string> {
  try {
    await connectToDatabase(); // Ensure you're connected to the database

    // Validate IDs
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

    // Flatten all tasks into a single array for easier search
    const allTasks = [
      ...project.requirements,
      ...project.designing,
      ...project.pending_designing,
      ...project.development,
      ...project.pending_development,
      ...project.testing,
      ...project.pending_testing,
      ...project.deployment,
      ...project.pending_deployment,
      ...project.done,
    ];

    // Find the task using the taskId
    const task = allTasks.find((task: ITask) => task._id.toString() === taskId);
    if (!task) {
      return "task_not_found";
    }
    if (task.isComplete) {
      return "already_complete";
    }
    // Check if the user has already joined the task
    const alreadyJoined = task.assignedPeople.some(
      (person: IPerson) => person.userId === userId
    );
    if (alreadyJoined) {
      return "already_joined";
    }

    // Add the user to the task's assignedPeople array
    task.assignedPeople.push({
      _id: new Types.ObjectId(), // Generate a new ObjectId for this person
      userId,
      username: userName,
      userEmail: userMail,
      userImage,
    });

    await project.save();
    return "success";
  } catch (error) {
    handleError(error);
    return "error";
  }
}

export async function deleteRequirement(
  projectId: string,
  taskId: string
): Promise<string> {
  try {
    await connectToDatabase();

    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return "invalid_ids";
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return "project_not_found";
    }

    // Use $pull to remove the task directly from the database
    const result = await Project.updateOne(
      { _id: projectId },
      { $pull: { requirements: { _id: taskId } } }
    );

    if (result.modifiedCount === 0) {
      return "task_not_found";
    }

    return "success";
  } catch (error) {
    handleError(error);
    return "error";
  }
}
export async function getTaskData(
  projectId: string,
  taskId: string
): Promise<ITask | string> {
  try {
    await connectToDatabase(); // Ensure the database is connected

    // Validate IDs
    if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(taskId)) {
      return "invalid_ids";
    }

    // Fetch the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return "project_not_found";
    }

    // Aggregate all tasks from various arrays into one
    const allTasks = project.requirements.concat(
      project.designing,
      project.pending_designing,
      project.development,
      project.pending_development,
      project.testing,
      project.pending_testing,
      project.deployment,
      project.pending_deployment,
      project.done
    );

    // Find the task by taskId
    const task = allTasks.find((task: ITask) => task._id.toString() === taskId);

    if (!task) {
      return "task_not_found";
    }

    return task; // Return the task if found
  } catch (error) {
    handleError(error);
    return "error";
  }
}

export async function getUnassignedMembers(
  projectId: string,
  taskId: string
): Promise<IPerson[]> {
  try {
    // Fetch the project by ID
    const project = await Project.findById(projectId).exec();

    if (!project) {
      return [];
    }

    // Initialize a variable for the specific task
    let task = null;

    // Search for the task in all task arrays of the project
    const allTasks = [
      ...project.requirements,
      ...project.designing,
      ...project.pending_designing,
      ...project.development,
      ...project.pending_development,
      ...project.testing,
      ...project.pending_testing,
      ...project.deployment,
      ...project.pending_deployment,
      ...project.done,
    ];

    task = allTasks.find((t) => t._id.toString() === taskId);

    if (!task) {
      return [];
    }

    // Extract all people and assigned people
    const allPeople = project.people;
    const assignedPeople = task.assignedPeople;

    // Find members who are not assigned to the task
    const unassignedMembers = allPeople.filter(
      (person: IPerson) =>
        !assignedPeople.some(
          (assigned: IPerson) => assigned.userId === person.userId
        )
    );

    return unassignedMembers;
  } catch (error) {
    handleError(error);
    return [];
  }
}

export async function toggleTaskCompletion(projectId: string, taskId: string) {
  try {
    // Fetch the project from the database
    const project = await Project.findById(projectId).exec();
    if (!project) {
      return "Project not found"; // More descriptive error message
    }

    let taskUpdated = false; // Flag to track if a task is updated

    // Search for the task in all task arrays of the project
    const taskArrays = [
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
    ] as const;

    for (const arrayName of taskArrays) {
      const taskArray = project[arrayName];
      const task = taskArray.find((t: ITask) => t._id.toString() === taskId);

      if (task) {
        task.isComplete = !task.isComplete; // Toggle task completion status
        taskUpdated = true;
        break; // Exit the loop once the task is found and updated
      }
    }

    if (!taskUpdated) {
      return "Task not found";
    }

    await project.save(); // Save only if a task was updated
    return "success";
  } catch (error) {
    handleError(error);
    return "Server error"; // More descriptive error message
  }
}

export async function processProjectTasks(projectId: string) {
  try {
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const taskArrays = [
      "designing",
      "development",
      "testing",
      "deployment",
    ] as const;

    taskArrays.forEach((stage, index) => {
      if (index === taskArrays.length - 1) return; // Skip the last stage 'deployment'

      const nextStage = taskArrays[index + 1]; // Get the next stage
      const pendingStage = `pending_${stage}` as keyof typeof project; // Pending stage key

      // Get the tasks from the current stage
      const tasks = project[stage];

      // Process each task in the current stage
      tasks.forEach((task: ITask) => {
        if (task.isComplete) {
          // If task is complete, move to the next stage and remove assigned people
          project[nextStage].push({
            ...task, // Spread the task properties
            assignedPeople: [], // Clear assigned people
            taskLocation: nextStage, // Update task location
          } as ITask);
        } else {
          // If task is not complete, move to the pending stage and retain assigned people
          project[pendingStage].push({
            ...task,
            taskLocation: pendingStage, // Update task location to pending
          } as ITask);
        }
      });
      // Clear tasks from the current stage after processing
      project[stage] = [];
    });

    await project.save();
  } catch (error) {
    console.error("Error processing project tasks:", error);
    throw error;
  }
}

export async function deleteProject(projectId: string): Promise<string> {
  try {
    // Find and delete the project by ID
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return "npf";
    }
    await User.updateMany(
      { workingOnProjects: projectId },
      { $pull: { workingOnProjects: projectId } }
    );
    return "success";
  } catch (error) {
    // Handle any errors that occur during deletion
    handleError(error);
    return "swr";
  }
}
