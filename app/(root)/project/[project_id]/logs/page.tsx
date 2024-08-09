import { getProjectById } from "@/lib/actions/project.actions";
import { currentUser } from "@clerk/nextjs/server";

export default async function logsPage({
  params,
}: {
  params: { project_id: string };
}) {
  const user = await currentUser();
  const userId = user?.id || null;
  const projectData = await getProjectById(params.project_id);
  console.log(userId);
  console.log(projectData.hostClerkId);
  return (
    <main>
      {userId === projectData.hostClerkId ? (
        <div className="wrapper">
          <p className="text-xl font-semibold">
            {projectData.projectName}
            {".logs"}
          </p>
          <p>Log keeps track every thing in this project.</p>
        </div>
      ) : (
        <section>
          <p className="text-destructive">
            You don't have access to this page.
          </p>
          <p>Only Project Host can access this page.</p>
        </section>
      )}
    </main>
  );
}
