import SendJoinReq from "@/components/shared/SendJoinReq";
import { getProjectById } from "@/lib/actions/project.actions";
import { currentUser } from "@clerk/nextjs/server";
import { hasUserRequested } from "@/lib/actions/other.actions";
import { IPerson } from "@/lib/database/models/project.model";
import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

    return (
      <main>
        <section className="wrapper">
          {isUserHostOrMember ? (
            <section>
              <h2 className="text-2xl font-semibold">
                {projectData.projectName}
              </h2>
              <p className="text-lg ">{projectData.projectDescription}</p>
              {userId === projectData.hostClerkId && (
                <div className="flex gap-2">
                  <Button asChild>
                    <Link href={`/project/${projectData._id}/join-requests`}>
                      Join requests
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/project/${projectData._id}/members`}>
                      Members
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={`/project/${projectData._id}/settings`}>
                      Settings
                    </Link>
                  </Button>
                </div>
              )}
            </section>
          ) : (
            <div className="min-h-screen flex flex-col justify-center items-center">
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
                    senderId={userId}
                    senderUsername={userName}
                  />
                </>
              )}
            </div>
          )}
        </section>
      </main>
    );
  } catch (error) {
    return <NetwokConnetionSLow />;
  }
}
