"use server";
import { Types } from "mongoose";
import Project, {
  IJoinRequest,
  IPerson,
  ITask,
} from "../database/models/project.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

interface SendJoinReqProps {
  projectId: string;
  senderClerkId: string;
  senderMail: string; // Clerk user ID
  senderUsername: string; // Clerk username
  userImage: string;
}

export async function sendReq({
  projectId,
  senderClerkId,
  senderMail,
  senderUsername,
  userImage,
}: SendJoinReqProps) {
  try {
    await connectToDatabase();

    const project = await Project.findById(projectId);

    if (!project) {
      return "Project not found";
    }
    // Add the new join request
    project.joinRequests.push({
      senderClerkId: senderClerkId,
      senderMail: senderMail,
      username: senderUsername,
      userImage: userImage,
    });
    await project.save();
    return "Join request sent successfully";
  } catch {
    return "An error occurred while sending the join request";
  }
}

export async function hasUserRequested(
  projectId: string,
  senderId: string
): Promise<boolean> {
  try {
    // Connect to the database
    await connectToDatabase();

    // Find the project by its ID
    const project = await Project.findById(projectId);

    if (!project) {
      return false;
    }

    // Check if senderId is in joinRequests by matching userId
    return project.joinRequests.some(
      (request: IJoinRequest) => request.senderClerkId === senderId
    );
  } catch (error) {
    console.error("Error checking join request status:", error);
    return false;
  }
}

export async function handleJoinRequest({
  reqId, //object_id
  projectId, //project_id
  type, //accept or reject
}: {
  reqId: string;
  projectId: string;
  type: "accept" | "reject";
}): Promise<void> {
  try {
    await connectToDatabase();
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error("Project not found");
    }

    const joinRequest = project.joinRequests.id(reqId);

    if (!joinRequest) {
      throw new Error("Join request not found");
    }

    if (type === "accept") {
      // Add the user to the people array
      project.people.push({
        userId: joinRequest.senderClerkId,
        username: joinRequest.username,
        userImage: joinRequest.userImage,
        userEmail: joinRequest.senderMail,
      });

      // Add the project to the user's workingOnProjects array
      const user = await User.findOne({ clerkId: joinRequest.userId });
      if (user) {
        user.workingOnProjects.push(project._id);
        await user.save();
      }
    }

    // Remove the join request from the project
    project.joinRequests.pull({ _id: reqId });
    await project.save();
  } catch (error) {
    handleError(error);
  }
}

export async function getHostInfoByClerkId(clerkId: string) {
  try {
    // Query the database to find the user with the given clerkId and select username, photo, and email
    const user = await User.findOne({ clerkId }).select("username photo email");

    // Return the username, photo, and email if the user is found, otherwise return empty values
    return user
      ? {
          hostname: user.username,
          hostPhoto: user.photo,
          hostEmail: user.email,
        }
      : { hostname: "", hostPhoto: "", hostEmail: "" };
  } catch (error) {
    handleError(error);
    return { hostname: "", hostPhoto: "", hostEmail: "" };
  }
}

type deleteMemberProps = {
  hostClerkId: string;
  projectId: string;
  memberClerkId: string;
};

export async function deleteMemberAction({
  hostClerkId,
  projectId,
  memberClerkId,
}: deleteMemberProps) {
  try {
    const host = await User.findOne({ clerkId: hostClerkId });
    if (!host) {
      return "nhf"; // No host found
    }

    const project = await Project.findOne({
      _id: projectId,
      hostClerkId: hostClerkId,
    });
    if (!project) {
      return "npf"; // No project found
    }

    // Remove the member from the project's people array
    project.people = project.people.filter(
      (person: IPerson) => person.userId !== memberClerkId
    );

    // Remove the member from all tasks in the project
    const taskSections = ["todo", "inProgress", "testing", "done"];
    taskSections.forEach((section) => {
      project[section].forEach((task: ITask) => {
        task.assignedPeople = task.assignedPeople.filter(
          (person: IPerson) => person.userId !== memberClerkId
        );
      });
    });

    await project.save();

    // Remove the project reference from the member's workingOnProjects array
    const member = await User.findOne({ clerkId: memberClerkId });
    if (member) {
      member.workingOnProjects = member.workingOnProjects.filter(
        (id: Types.ObjectId) => !id.equals(project._id)
      );
      await member.save();
    }

    return "success";
  } catch (error) {
    console.error("Error in deleteMemberAction:", error);
    return "swr"; // Something went wrong
  }
}
