import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";
import RemoveMember from "@/components/shared/RemoveMember";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHostInfoByClerkId } from "@/lib/actions/other.actions";
import { getProjectById } from "@/lib/actions/project.actions";
import { IPerson } from "@/lib/database/models/project.model";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function MemberPage({
  params,
}: {
  params: { project_id: string };
}) {
  try {
    const projectData = await getProjectById(params.project_id);
    const user = await currentUser();
    const userId = user?.id || "";
    const { hostname, hostPhoto } = await getHostInfoByClerkId(
      projectData.hostClerkId
    );

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
              <ul className="member-list">
                <li key={projectData.hostClerkId}>
                  <div className="flex flex-row gap-2 items-center">
                    <Image
                      src={hostPhoto}
                      height={45}
                      width={45}
                      alt="member-Image"
                      className="rounded-full"
                    />
                    <p className="text-lg font-medium hover:underline">
                      @
                      {userId === projectData.hostClerkId
                        ? "You"
                        : `${hostname}`}
                      <Badge className="ml-2">Host</Badge>
                    </p>
                  </div>
                </li>
                {projectData.people.map((person: IPerson) => (
                  <li key={person.username} className="flex justify-between">
                    <div className="flex flex-row gap-2 items-center">
                      <Image
                        src={person.userImage}
                        height={45}
                        width={45}
                        alt="member-Image"
                        className="rounded-full"
                      />
                      <p className="text-lg font-medium hover:underline">
                        @{person.username}
                      </p>
                    </div>

                    {userId === projectData.hostClerkId && (
                      <RemoveMember
                        hostClerkId={projectData.hostClerkId}
                        projectId={params.project_id}
                        memberName={person.username}
                        memberClerkId={person.userId}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className="wrapper fl-center">
              <p>You Don'n have access to this page.</p>
            </section>
          )}
        </section>
      </main>
    );
  } catch (error) {
    return <NetwokConnetionSLow />;
  }
}
