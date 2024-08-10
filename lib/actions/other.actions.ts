"use server";
import Project from "../database/models/project.model";
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

export async function deleteRequestById(
  req_id: string,
  projectId: string
): Promise<void> {
  try {
    await connectToDatabase();
    await Project.updateOne(
      { _id: projectId, "joinRequests._id": req_id },
      { $pull: { joinRequests: { _id: req_id } } }
    );
  } catch (error) {
    handleError(error);
  }
}
