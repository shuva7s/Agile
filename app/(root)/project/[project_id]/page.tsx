import SendJoinReq from "@/components/shared/SendJoinReq";
import { getProjectById } from "@/lib/actions/project.actions";
import { currentUser } from "@clerk/nextjs/server";
import { hasUserRequested } from "@/lib/actions/other.actions";
import { IPerson } from "@/lib/database/models/project.model";
import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CopyLink } from "@/components/shared/CopyLink";
import TaskContainer from "@/components/shared/TaskContainer";

export default async function projectDynamic({
  params,
}: {
  params: { project_id: string };
}) {
  try {
    const projectData = await getProjectById(params.project_id);
    const user = await currentUser();
    const userId = user?.id || "";
    const userName = user?.username || "";
    const userImage = user?.imageUrl || "";
    const userMail = user?.emailAddresses[0].emailAddress || "";

    if (!projectData) {
      return (
        <main>
          <section className="wrapper">
            <div>
              <p>No projects found</p>
            </div>
          </section>
        </main>
      );
    }

    const userHasRequested = await hasUserRequested(params.project_id, userId);
    const isUserHostOrMember =
      userId === projectData.hostClerkId ||
      projectData.people.some((person: IPerson) => person.userId === userId);
    const isUserHost = userId === projectData.hostClerkId;
    return (
      <main className="min-h-[100vh]">
        <div className="wrapper flex flex-col gap-6">
          {isUserHostOrMember ? (
            <>
              <section className="flex flex-col gap-4">
                <h1 className="text-3xl font-semibold mt-6 uppercase">
                  {projectData.projectName}
                </h1>
                {projectData.projectDescription && (
                  <p className="text-lg">{projectData.projectDescription}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="secondary" className="text-sm">
                    <Link href={`/project/${projectData._id}/members`}>
                      Members
                    </Link>
                  </Button>
                  {isUserHost && (
                    <>
                      <Button asChild variant="secondary" className="text-sm">
                        <Link
                          href={`/project/${projectData._id}/join-requests`}
                        >
                          Join requests
                        </Link>
                      </Button>
                      <Button asChild variant="secondary" className="text-sm">
                        <Link href={`/project/${projectData._id}/settings`}>
                          Settings
                        </Link>
                      </Button>
                    </>
                  )}
                  <CopyLink content={projectData._id} buttonType="link" />
                </div>
              </section>

              <>
                <section>
                  <h2 className="text-2xl mb-2 font-semibold">
                    Your tasks
                  </h2>
                  <TaskContainer
                    type="your_tasks"
                    isHost={isUserHost}
                    projectId={params.project_id}
                  />
                </section>
                <section>
                  <TaskContainer
                    type="requirements"
                    isHost={isUserHost}
                    projectId={params.project_id}
                  />
                </section>
                <section className="grid grid-cols-1 md:grid-cols-2">
                  <TaskContainer
                    type="designing"
                    isHost={isUserHost}
                    projectId={params.project_id}
                  />
                  <TaskContainer
                    type="development"
                    isHost={isUserHost}
                    projectId={params.project_id}
                  />
                </section>
                <section className="grid grid-cols-1 md:grid-cols-2">
                  <TaskContainer
                    type="testing"
                    isHost={isUserHost}
                    projectId={params.project_id}
                  />
                  <TaskContainer
                    type="deployment"
                    isHost={isUserHost}
                    projectId={params.project_id}
                  />
                </section>
                <section>
                  <TaskContainer
                    type="done"
                    isHost={isUserHost}
                    projectId={params.project_id}
                  />
                </section>
              </>
            </>
          ) : (
            <section className="min-h-screen flex flex-col justify-center items-center">
              {userHasRequested ? (
                <p className="text-xl font-bold">
                  You have already requested to join this project.
                </p>
              ) : (
                <>
                  <p className="text-2xl font-bold">
                    You are not a member of this project.
                  </p>
                  <p>Join the project to get access to it.</p>
                  <SendJoinReq
                    projectId={params.project_id}
                    senderClerkId={userId}
                    senderMail={userMail}
                    senderUsername={userName}
                    userImage={userImage}
                  />
                </>
              )}
            </section>
          )}
        </div>
      </main>
    );
  } catch (error) {
    return <NetwokConnetionSLow />;
  }
}
