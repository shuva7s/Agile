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
  projects = projects.reverse();
  return (
    <div className="grid auto-grid gap-3 items-start">
      {projects.length > 0 ? (
        projects.map((project) => (
          <Link
            href={`/project/${project._id.toString()}`}
            key={project._id.toString()}
          >
            <Card className="hover:bg-border/30 transition-all">
              <CardHeader>
                <CardTitle>{project.projectName}</CardTitle>
                <CardDescription>{project.projectDescription}</CardDescription>
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
