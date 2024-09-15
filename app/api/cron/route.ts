import { NextRequest, NextResponse } from "next/server";
import Project from "@/lib/database/models/project.model";
import { processProjectTasks } from "@/lib/actions/project.actions";
import { handleError } from "@/lib/utils"; // Error handling utility

export async function GET(req: NextRequest) {
  try {
    // Fetch all projects where hasStarted is true
    const projects = await Project.find({
      hasStarted: true,
      hasCompleted: false,
    });

    // Loop through each project
    for (const project of projects) {
      // Increment day count
      project.dayCount += 1;

      // Check if dayCount has reached the timeSlice
      if (project.dayCount >= project.timeSlice) {
        // Move tasks to the next stage or pending stage if not complete
        await processProjectTasks(project._id);

        // Reset dayCount after processing tasks
        project.dayCount = 0;
      }

      // Save updated project
      await project.save();
    }

    // Respond with success message
    return new NextResponse("cron ran successfully", { status: 200 });
  } catch (error) {
    handleError(error);
    return new NextResponse("Error running cron", { status: 500 });
  }
}
