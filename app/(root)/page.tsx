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
import { getHostedProjectsByClerkUserId, getWorkingOnProjectsByClerkId } from "@/lib/actions/project.actions";

export default async function Home() {
  const user = await currentUser();
  const userId = user?.id || null;
  const Hosted_projects = await getHostedProjectsByClerkUserId(userId);
  const WorkingOn_projects = await getWorkingOnProjectsByClerkId(userId);
  return (
    <main>
      <SignedIn>
        <div className="wrapper min-h-screen">
          <ProjectsContainer type={"hosted"} projects={Hosted_projects} />
          <ProjectsContainer type={"working"} projects={WorkingOn_projects} />
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
}
