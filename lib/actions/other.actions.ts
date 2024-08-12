"use server";
import { Types } from "mongoose";
import Project, { IPerson, ITask } from "../database/models/project.model";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

interface SendJoinReqProps {
  projectId: string;
  senderId: string; // Clerk user ID
  senderUsername: string; // Clerk username
}

export async function sendReq({
  projectId,
  senderId,
  senderUsername,
}: SendJoinReqProps) {
  try {
    await connectToDatabase();

    const project = await Project.findById(projectId);

    if (!project) {
      return "Project not found";
    }
    // Add the new join request
    project.joinRequests.push({ userId: senderId, username: senderUsername });
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
      (request: any) => request.userId === senderId
    );
  } catch (error) {
    console.error("Error checking join request status:", error);
    return false;
  }
}

// export async function acceptReqById(reqId: string, projectId: string) {
//   try {
//     await connectToDatabase();
//     const project = await Project.findById(projectId);
//     const joinRequest = project.joinRequests.id(reqId);
//     project.people.push({
//       userId: joinRequest.userId,
//       username: joinRequest.username,
//     });

//     project.joinRequests.pull({ _id: reqId });
//     await project.save();
//     const user = await User.findOne({ clerkId: joinRequest.userId });
//     if (user) {
//       user.workingOnProjects.push(project._id);
//       await user.save();
//     }
//   } catch (error) {
//     handleError(error);
//   }
// }

// export async function deleteRequestById(
//   req_id: string,
//   projectId: string
// ): Promise<void> {
//   try {
//     await connectToDatabase();
//     await Project.updateOne(
//       { _id: projectId, "joinRequests._id": req_id },
//       { $pull: { joinRequests: { _id: req_id } } }
//     );
//   } catch (error) {
//     handleError(error);
//   }
// }

export async function handleJoinRequest({
  reqId,
  projectId,
  type,
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
        userId: joinRequest.userId,
        username: joinRequest.username,
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

export async function getUsernameByClerkId(clerkId: string) {
  try {
    // Query the database to find the user with the given clerkId
    const user = await User.findOne({ clerkId }).select("username");
    return user ? user.username : "";
  } catch (error) {
    handleError(error);
    return "";
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
          (id) => id !== memberClerkId
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
