import { getProjectById } from "@/lib/actions/project.actions";
import { currentUser } from "@clerk/nextjs/server";
import GoBack from "@/components/shared/GoBack";

export default async function JoinRequests({
  params,
}: {
  params: { project_id: string };
}) {
  const user = await currentUser();
  const userId = user?.id || null;
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
            <p className="text-2xl font-semibold">{projectData.projectName}</p>
            <div>
              {/* {projectData &&
                projectData.joinRequests.map((req) => <p>{req}</p>)} */}
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
}
