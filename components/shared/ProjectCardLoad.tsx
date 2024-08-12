import React from "react";
import { Skeleton } from "../ui/skeleton";

type ProjectCardLoadProps = {
  count: number; // Number of skeletons to show
};

const ProjectCardLoad = ({ count }: ProjectCardLoadProps) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="grid auto-grid gap-3">
      {skeletons.map((_, index) => (
        <Skeleton key={index} className="w-full min-h-32" />
      ))}
    </div>
  );
};

export default ProjectCardLoad;
