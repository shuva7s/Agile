import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ProjectsContainer from "@/components/shared/ProjectsContainer";
import NetwokConnetionSLow from "@/components/shared/NetwokConnetionSLow";
import Link from "next/link";
import Image from "next/image";
export default async function Home() {
  try {
    return (
      <main>
        <SignedIn>
          <div className="min-h-screen">
            <div className="mt-6 wrapper flex flex-row gap-2 sm:hidden">
              <Button asChild className="w-1/2 min-h-16" variant="outline">
                <Link className="font-light" href="/new">
                  Create
                </Link>
              </Button>
              <Button
                asChild
                className="w-1/2 min-h-16 bg-border/40 hover:bg-border/50"
                variant="secondary"
              >
                <Link className="font-light" href="/join">
                  Join
                </Link>
              </Button>
            </div>
            <section>
              <div className="wrapper flex flex-row justify-between items-center gap-6 py-3 my-3">
                <h2 className="font-semibold text-2xl">Hosted by You</h2>
                <Button
                  asChild
                  className="font-medium rounded-full sm:hidden" // Hidden on small screens and visible on larger screens
                  size="icon"
                  variant="secondary"
                >
                  <Link href="/new">
                    <Image
                      src="/add.svg"
                      width={17}
                      height={17}
                      alt="add"
                      className="inv opacity-55"
                    />
                  </Link>
                </Button>

                <Button
                  asChild
                  className="font-medium hidden sm:flex items-center space-x-2"
                >
                  <Link href="/new">
                    <span>Create project</span>
                  </Link>
                </Button>
              </div>
              <ProjectsContainer type={"hosted"} />
            </section>
            <section>
              <div className="wrapper flex flex-row justify-between items-center gap-6 py-3 my-3">
                <h2 className="font-semibold text-2xl">Working on</h2>
                <Button
                  asChild
                  className="font-medium rounded-full sm:hidden" // Hidden on small screens and visible on larger screens
                  size="icon"
                  variant="secondary"
                >
                  <Link href="/join">
                    <Image
                      src="/join.svg"
                      width={17}
                      height={17}
                      alt="add"
                      className="inv opacity-55"
                    />
                  </Link>
                </Button>

                <Button
                  asChild
                  className="font-medium hidden sm:flex items-center space-x-2"
                >
                  <Link href="/join">
                    <span>Join project</span>
                  </Link>
                </Button>
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
