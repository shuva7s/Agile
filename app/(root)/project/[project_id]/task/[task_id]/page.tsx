import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { getProjectById, getTaskData } from "@/lib/actions/project.actions";
import { userInfo } from "@/lib/actions/userInfo.action";
import { IPerson } from "@/lib/database/models/project.model";

export default async function TaskPage({
  params,
}: {
  params: { project_id: string; task_id: string };
}) {
  try {
    const projectData = await getProjectById(params.project_id);
    const taskInfo = await getTaskData(params.project_id, params.task_id);
    const { userId } = await userInfo();
    // Handle project-related errors
    if (projectData === "project_not_found") {
      return (
        <main>
          <div className="wrapper">
            <section>
              <h1 className="text-3xl font-semibold mt-4 uppercase">
                Project Not Found
              </h1>
              <p className="text-lg">
                The project you are looking for does not exist or has been
                removed.
              </p>
            </section>
          </div>
        </main>
      );
    } else if (projectData === "invalid_ids") {
      return (
        <main>
          <div className="wrapper">
            <section>
              <h1 className="text-3xl font-semibold mt-4 uppercase">
                Invalid Project ID
              </h1>
              <p className="text-lg">
                The provided project ID is invalid. Please check the URL and try
                again.
              </p>
            </section>
          </div>
        </main>
      );
    } else if (projectData === "error") {
      return (
        <main>
          <div className="wrapper">
            <section>
              <h1 className="text-3xl font-semibold mt-4 uppercase">
                Error Loading Project
              </h1>
              <p className="text-lg">
                An error occurred while loading the project. Please try again
                later.
              </p>
            </section>
          </div>
        </main>
      );
    }

    // Handle task-related errors
    if (taskInfo === "task_not_found") {
      return (
        <main>
          <div className="wrapper">
            <section>
              <h1 className="text-3xl font-semibold mt-4 uppercase">
                Task Not Found
              </h1>
              <p className="text-lg">
                The task you are looking for does not exist or has been removed.
              </p>
            </section>
          </div>
        </main>
      );
    } else if (taskInfo === "invalid_ids") {
      return (
        <main>
          <div className="wrapper">
            <section>
              <h1 className="text-3xl font-semibold mt-4 uppercase">
                Invalid Task ID
              </h1>
              <p className="text-lg">
                The provided task ID is invalid. Please check the URL and try
                again.
              </p>
            </section>
          </div>
        </main>
      );
    } else if (taskInfo === "error") {
      return (
        <main>
          <div className="wrapper">
            <section>
              <h1 className="text-3xl font-semibold mt-4 uppercase">
                Error Loading Task
              </h1>
              <p className="text-lg">
                An error occurred while loading the task. Please try again
                later.
              </p>
            </section>
          </div>
        </main>
      );
    }

    // Type guard to check if taskInfo is of type ITask
    if (typeof taskInfo !== "string" && taskInfo) {
      // Render project and task details
      return (
        <main>
          <div className="wrapper flex flex-col gap-6">
            <section>
              <h1 className="text-3xl font-semibold mt-4 uppercase">
                {projectData.projectName}
              </h1>
              {projectData.projectDescription && (
                <p className="text-lg">{projectData.projectDescription}</p>
              )}
            </section>
            <section className="flex flex-col gap-2">
              <p className="text-2xl font-semibold">Task name</p>
              <h2 className="text-xl">{taskInfo.task}</h2>
            </section>
            <section className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold">Members</h3>
              <div className="flex flex-col">
                {taskInfo.assignedPeople.length > 0 ? (
                  taskInfo.assignedPeople.map((person: IPerson) => (
                    <Card key={person._id.toString()}>
                      <CardHeader className="flex flex-row items-center gap-2">
                        <div>
                          <Avatar
                            key={person._id.toString()}
                            className="w-12 h-12"
                          >
                            <AvatarImage src={person.userImage} />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <p className="font-semibold hover:underline text-lg">
                            @{person.username}
                          </p>
                          <p>{person.userEmail}</p>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : (
                  <p>No member is present in this task</p>
                )}
              </div>
            </section>
          </div>
        </main>
      );
    }

    // Default rendering in case of unexpected state
    return (
      <main>
        <div className="wrapper">
          <section>
            <h1 className="text-3xl font-semibold mt-4 uppercase">
              Unexpected Error
            </h1>
            <p className="text-lg">
              An unexpected error occurred. Please try again later.
            </p>
          </section>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return (
      <main>
        <div className="wrapper">
          <section>
            <h1 className="text-3xl font-semibold mt-4 uppercase">
              Unexpected Error
            </h1>
            <p className="text-lg">
              An unexpected error occurred. Please try again later.
            </p>
          </section>
        </div>
      </main>
    );
  }
}
