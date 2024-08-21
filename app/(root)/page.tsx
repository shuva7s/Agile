import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ProjectsContainer from "@/components/shared/ProjectsContainer";
import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";
import Action from "@/components/shared/Action";
export default async function Home() {
  try {
    return (
      <main>
        <SignedIn>
          <div className="min-h-screen">
            <div className="mt-6 wrapper flex flex-col sm:flex-row gap-2">
              <Action actionType="create" />
              <Action actionType="join" />
            </div>
            <section>
              <div className="wrapper flex flex-row justify-between items-center gap-6 py-3 my-3">
                <h2 className="font-semibold text-2xl">Hosted by You</h2>
              </div>
              <ProjectsContainer type={"hosted"} />
            </section>
            <section>
              <div className="wrapper flex flex-row justify-between items-center gap-6 py-3 my-3">
                <h2 className="font-semibold text-2xl">Working on</h2>
              </div>
              <ProjectsContainer type={"working"} />
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
