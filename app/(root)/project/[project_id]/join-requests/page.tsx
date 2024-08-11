import { getProjectById } from "@/lib/actions/project.actions";
import { currentUser } from "@clerk/nextjs/server";
import GoBack from "@/components/shared/GoBack";
import { IJoinRequest } from "@/lib/database/models/project.model";
import { Card } from "@/components/ui/card";
import AcceptReq from "@/components/shared/AcceptReq";
import RejectReq from "@/components/shared/RejectReq";
import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";

export default async function JoinRequests({
  params,
}: {
  params: { project_id: string };
}) {
  try {
    const user = await currentUser();
    const userId = user?.id || "";
    const projectData = await getProjectById(params.project_id);
    return (
      <main>
        <section className="wrapper">
          {userId === projectData.hostClerkId ? (
            <div>
              <p>
                Showing <span className="font-bold">join requests</span> for
                project
              </p>
              <p className="text-2xl font-semibold">
                {projectData.projectName}
              </p>
              <div className="mt-6">
                {projectData &&
                  projectData.joinRequests.map((req: IJoinRequest) => (
                    <Card
                      key={req._id.toString()}
                      className=" px-4 py-2.5 flex flex-col gap-1.5 hover:bg-border transition-all"
                    >
                      <p className="text-xl font-semibold">@{req.username}</p>
                      <p>~{req.userId}</p>
                      <AcceptReq
                        req_id={req._id.toString()}
                        projectId={params.project_id}
                      />
                      <RejectReq
                        req_id={req._id.toString()}
                        projectId={params.project_id}
                      />
                    </Card>
                  ))}
              </div>
            </div>
          ) : (
            <div className="min-h-screen flex justify-center items-center text-center flex-col gap-3">
              <p className="text-3xl font-bold">Nope...!!!</p>
              <p className="text-2xl font-semibold">
                You don't have access to this page.
              </p>
              <p>Only project Host can access this page.</p>
              <GoBack />
            </div>
          )}
        </section>
      </main>
    );
  } catch (error) {
    return <NetwokConnetionSLow />;
  }
}
