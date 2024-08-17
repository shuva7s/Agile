import SendJoinReq from "@/components/shared/SendJoinReq";
import { getProjectById } from "@/lib/actions/project.actions";
import { currentUser } from "@clerk/nextjs/server";
import { hasUserRequested } from "@/lib/actions/other.actions";
import { IPerson } from "@/lib/database/models/project.model";
import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CopyCode from "@/components/shared/CopyCode";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import TaskCard from "@/components/shared/TaskCard";

export default async function projectDynamic({
  params,
}: {
  params: { project_id: string };
}) {
  try {
    const projectData = await getProjectById(params.project_id);
    const user = await currentUser();
    const userId = user?.id || "";
    const userName = user?.username || "";
    const userImage = user?.imageUrl || "";

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
    const isUserHostOrMember =
      userId === projectData.hostClerkId ||
      projectData.people.some((person: IPerson) => person.userId === userId);

    return (
      <main className="min-h-[100vh]">
        <div className="wrapper flex flex-col gap-6">
          {isUserHostOrMember ? (
            <>
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold mt-4">
                  {projectData.projectName}
                </h2>
                {projectData.projectDescription && (
                  <p className="text-lg">{projectData.projectDescription}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="secondary" className="text-sm">
                    <Link href={`/project/${projectData._id}/members`}>
                      Members
                    </Link>
                  </Button>
                  {userId === projectData.hostClerkId && (
                    <>
                      <Button asChild variant="secondary" className="text-sm">
                        <Link
                          href={`/project/${projectData._id}/join-requests`}
                        >
                          Join requests
                        </Link>
                      </Button>
                      <Button asChild variant="secondary" className="text-sm">
                        <Link href={`/project/${projectData._id}/settings`}>
                          Settings
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex flex-col gap-4">
                  <CopyCode content={projectData._id} buttonType="code" />
                  <CopyCode content={projectData._id} buttonType="link" />
                </div>
              </section>
              {userId === projectData.hostClerkId && (
                <section>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary">
                        <h3 className="text-xl font-medium">
                          All Requirements
                        </h3>
                      </AccordionTrigger>
                      <AccordionContent className="rounded-md">
                        <div className="w-full grid gap-4 auto-grid-small items-start p-4">
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </section>
              )}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary">
                        <h3 className="text-xl font-medium">TO DO</h3>
                      </AccordionTrigger>
                      <AccordionContent className="rounded-md">
                        <div className="w-full grid gap-4 auto-grid-small items-start p-4">
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary">
                        <h3 className="text-xl font-medium">In progress</h3>
                      </AccordionTrigger>
                      <AccordionContent className="rounded-md">
                        <div className="w-full grid gap-4 auto-grid-small items-start p-4">
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div>
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary">
                        <h3 className="text-xl font-medium">Done</h3>
                      </AccordionTrigger>
                      <AccordionContent className="rounded-md">
                        <div className="w-full grid gap-4 auto-grid-small items-start p-4">
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                          <TaskCard></TaskCard>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </section>
            </>
          ) : (
            <section className="min-h-screen flex flex-col justify-center items-center">
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
                    userImage={userImage}
                  />
                </>
              )}
            </section>
          )}
        </div>
      </main>
    );
  } catch (error) {
    return <NetwokConnetionSLow />;
  }
}
