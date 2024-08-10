import { IProject } from "@/lib/database/models/project.model";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

interface ProjectsContainerProps {
  type: "hosted" | "working";
  projects: IProject[];
}

const ProjectsContainer = ({ type, projects }: ProjectsContainerProps) => {
  return (
    <section>
      {type === "hosted" ? (
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-2xl my-6">
            Projects Hosted By You
          </h2>
          <Button asChild className="font-medium">
            <Link href="/new">Create Project</Link>
          </Button>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-2xl my-6">Working on</h2>
          <Button asChild className="font-medium">
            <Link href="/join">Join Project</Link>
          </Button>
        </div>
      )}

      <div className="min-h-[40vh] grid auto-grid gap-3 items-start">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link
              href={`/project/${project._id.toString()}`}
              key={project._id.toString()}
            >
              <Card className="hover:bg-border transition-all">
                <CardHeader>
                  <CardTitle>{project.projectName}</CardTitle>
                  <CardDescription>
                    {project.projectDescription}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <p>No Projects to Show.</p>
        )}
      </div>
    </section>
  );
};

export default ProjectsContainer;
