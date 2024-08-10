import SendJoinReq from "@/components/shared/SendJoinReq";
import { getProjectById } from "@/lib/actions/project.actions";
import { currentUser } from "@clerk/nextjs/server";
import { hasUserRequested } from "@/lib/actions/other.actions";

export default async function projectDynamic({
  params,
}: {
  params: { project_id: string };
}) {
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

  return (
    <main>
      <section className="wrapper">
        {userId === projectData.hostClerkId ? (
          <div>
            <p>{projectData.hostClerkId}</p>
            <p>{projectData.projectName}</p>
            <p>{projectData.projectDescription}</p>
          </div>
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
}
