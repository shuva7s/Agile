import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import {
  getProjectById,
  getUnassignedMembers,
} from "@/lib/actions/project.actions";
import { userInfo } from "@/lib/actions/userInfo.action";

export default async function AssignPage({
  params,
}: {
  params: { project_id: string; task_id: string };
}) {
  try {
    const { userId } = await userInfo();
    const projectData = await getProjectById(params.project_id);
    if (projectData.hostClerkId === userId) {
      const unAssMembers = await getUnassignedMembers(
        params.project_id,
        params.task_id
      );
      return (
        <main>
          <div className="wrapper">
            {unAssMembers.length > 0 ? (
              unAssMembers.map((person) => (
                <Card key={person._id.toString()}>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <div>
                      <Avatar key={person._id.toString()} className="w-12 h-12">
                        <AvatarImage src={person.userImage} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="font-semibold hover:underline text-lg">
                        @{person.username}
                      </p>
                      <p>{person.userEmail}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <p>No members to show</p>
            )}
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
