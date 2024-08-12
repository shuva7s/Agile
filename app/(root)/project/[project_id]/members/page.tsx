import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";
import RemoveMember from "@/components/shared/RemoveMember";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUsernameByClerkId } from "@/lib/actions/other.actions";
import { getProjectById } from "@/lib/actions/project.actions";
import { IPerson } from "@/lib/database/models/project.model";
import { currentUser } from "@clerk/nextjs/server";

export default async function MemberPage({
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
                  <div className="text-lg font-medium hover:underline inline-block">
                    @
                    {userId === projectData.hostClerkId
                      ? "You"
                      : `${await getUsernameByClerkId(
                          projectData.hostClerkId
                        )}`}
                    <Badge className="ml-2">Host</Badge>
                  </div>
                </li>
                {projectData.people.map((person: IPerson) => (
                  <li key={person.username} className="flex justify-between">
                    <p className="text-lg font-medium hover:underline inline-block">
                      @{person.username}
                    </p>
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
