import { IProject } from "@/lib/database/models/project.model";
import Link from "next/link";

interface ProjectsContainerProps {
  type: "hosted" | "working";
  projects: IProject[];
}

const ProjectsContainer = ({ type, projects }: ProjectsContainerProps) => {
  return (
    <section>
      <h2 className="font-bold text-2xl">{type === "hosted" ? "Projects Hosted By You" : "Working On"}</h2>
      <div>
        <Link href=""></Link>
      </div>
    </section>
  );
};

export default ProjectsContainer;
