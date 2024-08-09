import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import ProjectsContainer from "@/components/shared/ProjectsContainer";

type DummyProject = {
  _id: string;
  hostClerkId: string;
  projectName: string;
  projectDescription?: string;
  people: string[]; // or you can keep it as Types.ObjectId[] if you want to mimic the relationship
  createdAt: Date;
  updatedAt: Date;
};

// Dummy project data
const dummyProjects: DummyProject[] = [
  {
    _id: "project1-id",
    hostClerkId: "clerk1-id",
    projectName: "Project Alpha",
    projectDescription: "This is the first project",
    people: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "project2-id",
    hostClerkId: "clerk2-id",
    projectName: "Project Beta",
    projectDescription: "This is the second project",
    people: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "project3-id",
    hostClerkId: "clerk3-id",
    projectName: "Project Gamma",
    projectDescription: "This is the third project",
    people: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
export default function Home() {
  return (
    <main>
      <SignedIn>
        <div className="wrapper min-h-screen flex justify-center items-center gap-4">
          {/* <ProjectsContainer type={"hosted"} projects={dummyProjects}></ProjectsContainer> */}
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
