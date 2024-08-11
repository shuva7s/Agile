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
                  </CardDescription>{" "}
                  {type === "hosted" && (
                    <CardFooter>
                      {/* <Button variant="outline" className="w-8 h-8 rounded-full" asChild>
                        <Link href={`/project/${project._id}/join-requests`}>
                          {"->"}
                        </Link>
                      </Button> */}
                    </CardFooter>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))
        ) : (
          <p>No Projects to Show.</p>
        )}
      </div>
  );
};

export default ProjectsContainer;
