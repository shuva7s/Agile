import DeleteProjectButton from "@/components/shared/DeleteProjectButton";
import { getProjectById } from "@/lib/actions/project.actions";
import { userInfo } from "@/lib/actions/userInfo.action";

export default async function SettingsPage({
  params,
}: {
  params: { project_id: string; task_id: string };
}) {
  try {
    const { userId } = await userInfo();
    const projectData = await getProjectById(params.project_id);
    if (projectData.hostClerkId === userId) {
      return (
        <main>
          <div className="wrapper">
            <p className="mt-6">Project settings page</p>
            <DeleteProjectButton projectId={params.project_id} />
          </div>
        </main>
      );
    } else {
      return (
        <main>
          <div className="wrapper fl-center">
            <p className="text-center">You dont have access to this page</p>
          </div>
        </main>
      );
    }
  } catch (error) {
    return (
      <main>
        <div className="wrapper fl-center">
          <p className="text-center">Something went Wrong</p>
        </div>
      </main>
    );
  }
}
