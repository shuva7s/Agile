import { getProjectById } from "@/lib/actions/project.actions";
import { currentUser } from "@clerk/nextjs/server";
import GoBack from "@/components/shared/GoBack";
import { IJoinRequest } from "@/lib/database/models/project.model";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";
import HandleJoinReqForm from "@/components/shared/HandleJoinReqForm";
import Image from "next/image";

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
                {projectData.joinRequests.length > 0 ? (
                  projectData.joinRequests.map((req: IJoinRequest) => (
                    <Card key={req._id.toString()}>
                      <CardHeader className="flex flex-row gap-2 items-center">
                        <Image
                          src={req.userImage}
                          width={50}
                          height={50}
                          alt="userimage"
                          className="rounded-full"
                        />
                        <div>
                          <p className="text-xl font-semibold">
                            @{req.username}
                          </p>
                          <p className="text-sm">~{req.senderMail}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0 pt-4">
                        <HandleJoinReqForm
                          reqId={req._id.toString()}
                          projectId={params.project_id}
                        />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p>No join requests to show.</p>
                )}
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
