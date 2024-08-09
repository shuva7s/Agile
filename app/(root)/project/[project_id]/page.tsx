import { getProjectById } from "@/lib/actions/project.actions";

export default async function projectDynamic({
  params,
}: {
  params: { project_id: string };
}) {
  const projectData = await getProjectById(params.project_id);
  return (
    <main>
      <section className="wrapper">
        {projectData ? (
          <div>
            <p>{projectData.hostClerkId}</p>
            <p>{projectData.projectName}</p>
            <p>{projectData.projectDescription}</p>
          </div>
        ) : (
          <div>
            <p>No projects Found...!</p>
          </div>
        )}
      </section>
    </main>
  );
}
