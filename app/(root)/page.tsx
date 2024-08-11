import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ProjectsContainer from "@/components/shared/ProjectsContainer";

import { currentUser } from "@clerk/nextjs/server";
import {
  getHostedProjectsByClerkUserId,
  getWorkingOnProjectsByClerkId,
} from "@/lib/actions/project.actions";
import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";
import Link from "next/link";
export default async function Home() {
  try {
    const user = await currentUser();
    const userId = user?.id || "";
    const Hosted_projects = await getHostedProjectsByClerkUserId(userId);
    const WorkingOn_projects = await getWorkingOnProjectsByClerkId(userId);
    return (
      <main>
        <SignedIn>
          <div className="wrapper min-h-screen">
            <section>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-2xl my-6">
                  Projects Hosted By You
                </h2>
                <Button asChild className="font-medium">
                  <Link href="/new">Create Project</Link>
                </Button>
              </div>
              <ProjectsContainer type={"hosted"} projects={Hosted_projects} />
            </section>
            <section>
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-2xl my-6">Working on</h2>
                <Button asChild className="font-medium">
                  <Link href="/join">Join Project</Link>
                </Button>
              </div>
              <ProjectsContainer
                type={"working"}
                projects={WorkingOn_projects}
              />
            </section>
          </div>
        </SignedIn>
        <SignedOut>
          <div className="wrapper min-h-screen flex flex-col justify-center items-center">
            <p className="font-semibold text-xl">Agile</p>
            <p>Manage Your Orojects With Ease</p>
            <SignInButton>
              <Button>Sign In</Button>
            </SignInButton>
          </div>
        </SignedOut>
      </main>
    );
  } catch (error) {
    return <NetwokConnetionSLow />;
  }
}
